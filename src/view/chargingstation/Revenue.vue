<template>
  <div class="revenue">
    <el-card class="chart">
      <div ref="chartRef" style="width: 100%; height: 100%"></div>
    </el-card>
    <el-card class="list mt">
      <el-input
        v-model.trim="name"
        style="max-width: 400px"
        placeholder="请输入站点名称"
        class="input-with-select"
      >
        <template #append>
          <el-button icon="Search" @click="loadData" />
        </template>
      </el-input>
      <CommonTable
        class="list-table"
        :data="tableData"
        :columns="column"
        :loading:="loading"
        :showOperation="false"
      >
        <template #day="{ row }">
          <span>{{ row.day }}</span>
          <el-tag
            :type="row.growth_percent > 0 ? 'danger' : 'success'"
            class="ml"
          >
            {{
              row.growth_percent > 0
                ? "+" + row.growth_percent + "%"
                : row.growth_percent + "%"
            }}
          </el-tag>
        </template>
        <template #monthly_income="{ row }">
          <span>{{ row.monthly_income }}</span>
          <el-tag
            :type="row.month_growth_percent > 0 ? 'danger' : 'success'"
            class="ml"
          >
            {{
              row.month_growth_percent > 0
                ? "+" + row.month_growth_percent + "%"
                : row.month_growth_percent + "%"
            }}
          </el-tag>
        </template>
      </CommonTable>
      <CommonPagination
        v-model:page="pageInfo.page"
        v-model:page-size="pageInfo.pageSize"
        :total="totals"
        @update:page="loadData"
        @update:page-size="loadData"
      />
    </el-card>
  </div>
</template>

<script setup lang="ts" name="index">
import { useEcharts } from "@/hooks/useEcharts";
import { ref, reactive } from "vue";
import { chartApi, revenueTableList, type RevenueRecord } from "@/api/modules/revenue";
import CommonTable from "@/components/commonTable/index.vue";
import CommonPagination from "@/components/commonPagination/index.vue";
const chartRef = ref<HTMLElement | null>(null);
type RevenueRow = RevenueRecord & { day: number };
interface PageInfo {
  page: number;
  pageSize: number;
}
const tableData = ref<RevenueRow[]>([]);

const column = ref([
  {
    label: "充电站名称",
    prop: "name",
  },
  {
    label: "充电站ID",
    prop: "id",
  },
  {
    label: "所属城市",
    prop: "city",
  },
  {
    label: "充电桩总量(个)",
    prop: "count",
  },
  {
    label: "单日总收入(元)",
    prop: "day",
  },
  {
    label: "月度总收入(万元)",
    prop: "monthly_income",
  },
  {
    label: "电费营收(元)",
    prop: "electricity",
  },
  {
    label: "停车费营收(元)",
    prop: "parkingFee",
  },
  {
    label: "服务费营收(元)",
    prop: "serviceFee",
  },
  {
    label: "会员储值金(元)",
    prop: "member",
  },
]);
const loading = ref<boolean>(true);
const name = ref<string>("");
// 分页选择器
const pageInfo = reactive<PageInfo>({
  page: 1,
  pageSize: 10,
});
const totals = ref<number>(0);
const setChartData = async () => {
  const res = await chartApi();
  const chartOptions = reactive({
    tooltip: {
      trigger: "axis",
    },
    grid: {
      left: 10, // 距离左边，像素或者百分比，数值越小越靠左
      right: 10, // 距离右边，数值越小越靠右
      bottom: 0, // 距离底部，数值越小越靠下
      top: 30, // 距离顶部
      containLabel: true, // 【推荐】保证坐标轴文字不会被裁掉！
    },
    legend: {
      data: [],
    },
    xAxis: {
      type: "category",
      data: ["一月", "二月", "三月", "四月", "五月", "六月", "七月"],
    },
    yAxis: [
      {
        type: "value",
        name: "销售",
        position: "left",
      },
      {
        type: "value",
        name: "访问量",
        position: "right",
      },
    ],
    series: [
      {
        name: "",
        type: "bar",
        data: [] as number[],
        yAxisIndex: 0,
        itemStyle: {
          color: "#409eff",
        },
      },
      {
        name: "",
        type: "line",
        data: [] as number[],
        yAxisIndex: 1,
        itemStyle: {
          color: "#409eff",
        },
        smooth: true,
      },
    ],
  });
  // 重新赋值后端返回的数据
  for (let index = 0; index < res.data.list.length; index++) {
    chartOptions.series[index].data = res.data.list[index].data;
    chartOptions.series[index].name = res.data.list[index].name;
  }
  return chartOptions;
};
useEcharts(chartRef, setChartData);
const loadData = () => {
  loading.value = true;
  try {
    revenueTableList({
      ...pageInfo,
      name: name.value,
    }).then((res) => {
      if (res.code === 200) {
        loading.value = false;
        const {
          data: { list, total },
        } = res;
        totals.value = total;
        tableData.value = list.map((item) => ({
          ...item,
          day:
            Number(item.electricity) +
            Number(item.parkingFee) +
            Number(item.serviceFee) +
            Number(item.member),
        }));
      }
    });
  } finally {
  }
};
loadData();
</script>

<style scoped lang="less">
.revenue {
  height: calc(100% - 55px);
  overflow: hidden;
  display: flex;
  flex-direction: column;
  .chart {
    height: 38%;
  }
  .list {
    box-sizing: border-box;
    flex: 1;
    .list-table {
      margin-top: 20px;
      height: calc(100% - 72px - 32px);
    }
  }
}
</style>
