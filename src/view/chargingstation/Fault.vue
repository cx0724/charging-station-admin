<template>
  <div class="fault">
    <el-card class="search-card">
      <el-form :inline="true" class="demo-form-inline">
        <el-form-item label="请选择站点:">
          <el-select v-model="name" placeholder="请选择站点" filterable>
            <el-option
              :label="item.name"
              :value="item.station_id"
              v-for="item in stationListData"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="请选择状态:">
          <el-select v-model="state" placeholder="请选择状态">
            <el-option
              :label="item.name"
              :value="item.value"
              v-for="item in stationState"
            />
          </el-select>
        </el-form-item>
      </el-form>
    </el-card>
    <el-card class="list-card mt">
      <el-empty
        description="暂无数据"
        style="height: 100%"
        v-if="listData?.length == 0"
      />
      <el-row :gutter="20" v-else class="list-scroll">
        <el-col :span="6" v-for="item in listData" :key="item.id" class="mt">
          <div class="item">
            <div class="pic">
              <p v-if="item.status === 1">空闲中</p>
              <p v-else-if="item.status === 2">充电中</p>
              <p v-else-if="item.status === 3">连接中</p>
              <p v-else-if="item.status === 4">排队中</p>
              <p v-else-if="item.status === 5">已预约</p>
              <p v-else-if="item.status === 6">故障/离线</p>
              <img
                :src="
                  item.status == 1 ? free : item.status == 6 ? outline : ing
                "
                width="100px"
              />
              <p v-if="item.status == 2">{{ item.percent }}</p>
              <p v-else>0%</p>
            </div>
            <div class="info">
              <h3>{{ item.pile_id }}</h3>
              <hr class="mb" />
              <p>电压：{{ item.voltage }}</p>
              <p>电流：{{ item.current }}</p>
              <p>功率：{{ item.power }}</p>
              <p>温度：{{ item.tem }}</p>
            </div>
          </div>
          <div class="btn">
            <div class="divder"></div>
            <div>
              <p class="fl ml" style="font-size: 12px; color: #999">暂无预警</p>
              <div class="fr" style="text-align: right">
                <el-popover placement="right" :width="300" trigger="click">
                  <template #reference>
                    <el-button
                      size="small"
                      type="primary"
                      class="mr"
                      @click="consumptionRecord(item.pile_id)"
                      >使用记录</el-button
                    >
                  </template>
                  <h3 class="mb">使用记录</h3>
                  <el-timeline v-if="consumptionRecordList?.length">
                    <el-timeline-item
                      :timestamp="list.create_time"
                      v-for="list in consumptionRecordList"
                      :key="list.id"
                      :hollow="true"
                      type="primary"
                    >
                      {{
                        `充电${list.charge_amount}度,消费${list.consume_amount}元`
                      }}
                    </el-timeline-item>
                  </el-timeline>
                  <el-empty description="暂无使用记录" v-else />
                </el-popover>
              </div>
            </div>
          </div>
        </el-col>
      </el-row>
    </el-card>
  </div>
</template>

<script setup lang="ts" name="index">
import { ref, watch } from "vue";
import {
  stationList,
  chargingPileList,
  chargingPileUsageRecord,
} from "@/api/modules/fault";
import free from "@/assets/free.png";
import outline from "@/assets/outline.png";
import ing from "@/assets/ing.png";
import { type PileInfo, type ChargeInfo } from "@/types/fault";

const name = ref<string>();
const stationListData = ref();
interface StatusOption {
  name: string;
  value: number;
}
const stationState = ref<StatusOption[]>([
  {
    name: "全部",
    value: 0,
  },
  {
    name: "空闲中",
    value: 1,
  },
  {
    name: "充电中",
    value: 2,
  },
  {
    name: "连接中",
    value: 3,
  },
  {
    name: "排队中",
    value: 4,
  },
  {
    name: "已预约",
    value: 5,
  },
  {
    name: "故障/离线",
    value: 6,
  },
]);
const state = ref(0);
const listData = ref<PileInfo[]>();
const stationListFn = () => {
  stationList({
    page: 1,
    pageSize: 10000,
  }).then((res) => {
    if (res.code == 200) {
      const { list } = res.data;
      stationListData.value = list;
      name.value = list[0].station_id;
    }
  });
};
const consumptionRecordList = ref<ChargeInfo[]>();
stationListFn();
const listDataFn = (id: string) => {
  chargingPileList({
    station_id: id,
    status: state.value === 0 ? "" : state.value,
  }).then((res) => {
    if (res.code == 200) {
      listData.value = res.data;
    }
  });
};
const consumptionRecord = (pile_id: string) => {
  chargingPileUsageRecord({ pile_id }).then((res) => {
    // console.log(1111, res);
    if (res.code === 200) {
      consumptionRecordList.value = res.data;
    }
  });
};
watch([name, state], ([newNum1]) => {
  if (newNum1) {
    listDataFn(newNum1);
  }
});
</script>

<style scoped lang="less">
.demo-form-inline .el-input {
  --el-input-width: 220px;
}
.demo-form-inline .el-select {
  --el-select-width: 220px;
}
.el-form {
  .el-form-item {
    margin: 0px 28px 0px 0px;
  }
}
.el-timeline.is-start {
  padding-left: 15px;
  margin-top: 15px;
  max-height: 310px;
  overflow-y: auto;
  overflow-x: hidden;
}
.el-timeline.is-start::-webkit-scrollbar {
  display: block;
  width: 6px;
}

.el-timeline.is-start::-webkit-scrollbar-thumb {
  background: #c0c4cc;
  border-radius: 3px;
}

.el-timeline.is-start::-webkit-scrollbar-track {
  background: transparent;
}
.fault {
  height: calc(100% - 55px);
  overflow: hidden;
  display: flex;
  flex-direction: column;
  .search-card {
    flex-shrink: 0;
  }
  .list-card {
    box-sizing: border-box;
    flex: 1;
    .list-scroll::-webkit-scrollbar {
      display: block;
      width: 6px;
    }

    .list-scroll::-webkit-scrollbar-thumb {
      background: #c0c4cc;
      border-radius: 3px;
    }

    .list-scroll::-webkit-scrollbar-track {
      background: transparent;
    }
    .list-scroll {
      height: 100%;
      overflow-y: auto;
      overflow-x: hidden;
      .item {
        display: flex;
        justify-content: center;
        align-items: center;
        height: 200px;
        background-color: rgb(247, 251, 254);
        padding: 20px;
        border-radius: 10px 10px 0 0;

        .pic {
          p {
            width: 76px;
            text-align: center;
            margin-bottom: 10px;
            color: rgb(61, 187, 146);
          }
        }

        .info {
          color: #999;
          margin-left: 30px;
          line-height: 26px;
          margin-top: -10px;
        }
      }

      .btn {
        width: 100%;
        height: 50px;
        line-height: 50px;
        background-color: #f7fbfe;

        .divder {
          background-color: #f4f4f4;
          height: 2px;
          width: 95%;
          margin: auto;
        }
      }
    }
  }
}
</style>
