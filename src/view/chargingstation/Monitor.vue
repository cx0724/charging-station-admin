<template>
  <div class="monitor">
    <el-card class="search">
      <el-row :gutter="20">
        <el-col :span="6">
          <el-input
            v-model.trim="formParams.input"
            placeholder="请输入站点名称、ID"
            clearable
            @clear="loadData"
          >
            <template #append>
              <el-select v-model="select" style="width: 115px">
                <el-option label="按名称查询" value="name" />
                <el-option label="按ID查询" value="id" />
              </el-select>
            </template>
          </el-input>
        </el-col>
        <el-col :span="6">
          <el-select
            placeholder="充电站状态"
            v-model="formParams.value"
            clearable
            @clear="loadData"
          >
            <el-option
              :label="item.label"
              :value="item.value"
              v-for="item in state"
              :key="item.value"
            ></el-option>
          </el-select>
        </el-col>
        <el-col :span="6">
          <el-button type="primary" @click="loadData">查询</el-button>
          <el-button @click="handleReset">重置</el-button>
        </el-col>
      </el-row>
    </el-card>
    <el-card class="mt list">
      <div class="list-title">
        <p>充电站管理列表</p>
        <el-button type="primary" icon="Plus" @click="addFn"
          >新增充电站</el-button
        >
      </div>
      <CommonTable
        :data="tableData"
        :columns="column"
        :loading:="loading"
        :showOperation="true"
        class="list-table"
      >
        <template #status="{ row }">
          <el-tag v-if="row.status == 1" type="primary">使用中</el-tag>
          <el-tag v-if="row.status == 2" type="primary">使用中</el-tag>
          <el-tag v-if="row.status == 3" type="success">空闲中</el-tag>
          <el-tag v-if="row.status == 4" type="warning">维护中</el-tag>
          <el-tag v-if="row.status == 5" type="danger">待维修</el-tag>
        </template>
        <template #operation="{ row }">
          <el-popconfirm
            title="确定要删除当前站点吗？"
            width="200"
            placement="top"
            @confirm="handleDelete(row.id)"
          >
            <template #reference>
              <el-button type="danger" size="small">删除</el-button>
            </template>
          </el-popconfirm>
          <el-button type="primary" size="small" @click="edit(row)"
            >编辑</el-button
          >
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
    <StationForm
      :ruleForm="ruleForm"
      :dialog-visible="visible"
      @close="close"
      @reload="loadData"
      :title="title"
    >
    </StationForm>
  </div>
</template>

<script setup lang="ts" name="index">
import { ref, reactive, onMounted } from "vue";
import { stationList, deleteApi } from "@/api/modules/monitor";
import CommonTable from "@/components/commonTable/index.vue";
import CommonPagination from "@/components/commonPagination/index.vue";
import StationForm from "./components/StationForm.vue";
import type { RuleForm } from "@/types/monitor.ts";
import { ElMessage } from "element-plus";
onMounted(() => {
  loadData();
});
const select = ref("name");
// 查询状态数据
const state = reactive([
  {
    label: "全部",
    value: 1,
  },
  {
    label: "使用中",
    value: 2,
  },
  {
    label: "空闲中",
    value: 3,
  },
  {
    label: "维护中",
    value: 4,
  },
  {
    label: "待维修",
    value: 5,
  },
]);
const formParams = reactive({
  input: "",
  value: "",
});
const tableData = ref<RuleForm[]>([]);
const loadData = () => {
  loading.value = true;
  try {
    stationList({
      ...pageInfo,
      status: formParams.value,
      [select.value]: formParams.input,
    }).then((res) => {
      if (res.code === 200) {
        loading.value = false;
        const {
          data: { list, total },
        } = res;
        totals.value = total;
        tableData.value = list;
      }
    });
  } finally {
    loading.value = false;
  }
};
const handleReset = () => {
  pageInfo.page = 1;
  pageInfo.pageSize = 10;
  formParams.input = "";
  formParams.value = "";
  select.value = "name";
  loadData();
};
const handleDelete = (id: string | number) => {
  deleteApi({ id }).then((res) => {
    if (res.code == 200) {
      ElMessage({
        message: `
        ${id}删除成功，为防止数据被误删影响其他人调用，这里只做成功返回，不执行真实删除`,
        type: "success",
      });
      loadData();
    }
  });
};
const loading = ref<boolean>(true);
const column = ref([
  {
    prop: "name",
    label: "站点名称",
    width: 300,
  },
  {
    prop: "id",
    label: "站点ID",
  },
  {
    prop: "fast",
    label: "快充数",
  },
  {
    prop: "slow",
    label: "慢充数",
  },
  {
    prop: "status",
    label: "充电站状态",
  },
  {
    prop: "now",
    label: "正在充电",
  },
  {
    prop: "fault",
    label: "故障数",
  },
  {
    prop: "person",
    label: "站点负责人",
  },
  {
    prop: "tel",
    label: "负责人电话",
  },
]);
// 分页选择器
const pageInfo = reactive({
  page: 1,
  pageSize: 10,
});
const visible = ref<boolean>(false);
const emptyForm: RuleForm = {
  name: "",
  id: "",
  city: "",
  fast: "",
  slow: "",
  status: "",
  now: "",
  fault: "",
  person: "",
  tel: "",
  station_id: "",
};
const ruleForm = ref<RuleForm>({ ...emptyForm });
const totals = ref<number>(0);

const title = ref("新增充电站");
const edit = (row: RuleForm) => {
  title.value = "编辑充电站";
  visible.value = true;
  ruleForm.value = { ...row };
};
const addFn = () => {
  title.value = "新增充电站";
  ruleForm.value = { ...emptyForm };
  visible.value = true;
};
const close = () => {
  visible.value = false;
  ruleForm.value = { ...emptyForm };
};
</script>

<style scoped lang="less">
.monitor {
  height: calc(100% - 55px);
  overflow: hidden;
  display: flex;
  flex-direction: column;

  .search {
    flex-shrink: 0;
  }
  .list {
    box-sizing: border-box;
    flex: 1;
    .list-title {
      display: flex;
      justify-content: space-between;
      align-items: center;
      p {
        font-size: 18px;
        font-weight: bold;
      }
    }
  }
  .list-table {
    margin-top: 20px;
    height: calc(100% - 52px - 52px);
  }
}
.my-pagination {
  margin: 20px 0px 0px;
}
</style>
