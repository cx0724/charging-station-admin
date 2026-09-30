<template>
  <div class="detail">
    <el-card class="search">
      <el-row :gutter="20">
        <el-col :span="6">
          <el-input v-model="serchFrom.orderNo" placeholder="请输入订单号" />
        </el-col>
        <el-col :span="6">
          <el-select placeholder="请选择订单状态" v-model="serchFrom.status">
            <el-option
              :label="item.label"
              :value="item.value"
              v-for="item in optionList"
              :key="item.value"
            ></el-option>
          </el-select>
        </el-col>
        <el-col :span="6">
          <el-input placeholder="设备编号" v-model="serchFrom.no" />
        </el-col>
        <el-col :span="6">
          <el-button type="primary" @click="loadData">查询</el-button>
          <el-button @click="handleReset">重置</el-button>
        </el-col>
      </el-row>
    </el-card>
    <el-card class="mt list">
      <div class="mb">
        <el-button
          type="danger"
          icon="Delete"
          :disabled="!select.length"
          @click="batchDelete"
          >批量删除</el-button
        >
        <el-button
          type="primary"
          icon="Download"
          :disabled="!select.length"
          @click="exportData"
          >导出订单数据到Excel</el-button
        >
      </div>
      <CommonTable
        :columns="columns"
        :loading="loading"
        :data="tableList"
        :showOperation="true"
        :showSelection="true"
        class="list-table"
        @selection-change="handleSelectionChange"
        :operationWidth="100"
      >
        <template #status="{ row }">
          <el-tag type="success" v-if="row.status == 2">进行中</el-tag>
          <el-tag type="primary" v-else-if="row.status == 3">已完成</el-tag>
          <el-tag type="warning" v-else-if="row.status == 4">异常</el-tag>
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

<script setup lang="ts" name="Detail">
import { reactive, ref } from "vue";
import CommonTable from "@/components/commonTable/index.vue";
import CommonPagination from "@/components/commonPagination/index.vue";
import { orderList, del, deleteBatch, type OrderItem } from "@/api/modules/orders";
import { formatTime } from "@/hooks/useDate";
import { ElMessage } from "element-plus";
import * as XLSX from "xlsx";
export interface RuleForm {
  orderNo: string;
  status: number | string;
  no: string;
}
// 分页选择器
const pageInfo = reactive({
  page: 1,
  pageSize: 10,
});
const searchParams: RuleForm = {
  orderNo: "",
  status: 1,
  no: "",
};
const serchFrom = ref<RuleForm>({ ...searchParams });
const optionList = reactive([
  {
    label: "全部",
    value: 1,
  },
  {
    label: "进行中",
    value: 2,
  },
  {
    label: "已完成",
    value: 3,
  },
  {
    label: "异常",
    value: 4,
  },
]);
const tableList = ref<OrderItem[]>([]);
const handleReset = () => {
  serchFrom.value = { ...searchParams };
};
const columns = ref([
  {
    label: "订单号",
    prop: "order_no",
  },
  {
    label: "设备编号",
    prop: "equipment_no",
  },
  {
    label: "订单日期",
    prop: "date",
    width: 200,
  },
  {
    label: "开始时间",
    prop: "start_time",
  },
  {
    label: "结束时间",
    prop: "end_time",
  },
  {
    label: "金额",
    prop: "money",
  },
  {
    label: "支付方式",
    prop: "pay",
  },
  {
    label: "订单状态",
    prop: "status",
  },
]);
const totals = ref(0);
const loading = ref(true);
const loadData = () => {
  loading.value = true;
  orderList({
    orderNo: searchParams.orderNo,
    status: searchParams.status === 1 ? "" : searchParams.status,
    no: searchParams.no,
    ...pageInfo,
  }).then((res) => {
    if (res.code === 200) {
      loading.value = false;
      const { list, total } = res.data;
      tableList.value = list.map((item) => {
        return {
          ...item,
          date: formatTime(item.date),
        };
      });
      totals.value = total;
    }
  });
};
loadData();
const handleDelete = (row: OrderItem) => {
  del({
    order_no: row.order_no,
  }).then((res) => {
    if (res.code == 200) {
      ElMessage({
        message: `删除成功，为防止数据被误删影响其他人调用，这里只做成功返回，不执行真实删除`,
        type: "success",
      });
      loadData();
    }
  });
};
const batchDelete = () => {
  deleteBatch({
    order_no_list: select.value,
  }).then((res) => {
    if (res.code == 200) {
      select.value = [];
      ElMessage({
        message: `删除成功，为防止数据被误删影响其他人调用，这里只做成功返回，不执行真实删除`,
        type: "success",
      });
      loadData();
    }
  });
};
const select = ref<string[]>([]);
const handleSelectionChange = (data: OrderItem[]) => {
  select.value = data.map((item) => item.order_no);
};
const exportData = () => {
  const exportData = tableList.value.map((item) => ({
    订单号: item.order_no,
    设备编号: item.order_no,
    订单日期: item.date,
    状态:
      item.status === 2
        ? "进行中"
        : item.status === 3
          ? "已完成"
          : item.status === 4
            ? "异常"
            : "",
  }));

  const worksheet = XLSX.utils.json_to_sheet(exportData);

  const workbook = XLSX.utils.book_new();

  XLSX.utils.book_append_sheet(workbook, worksheet, "订单数据");

  XLSX.writeFile(workbook, "订单数据.xlsx");
};
</script>

<style scoped>
.detail {
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
    .list-table {
      margin-top: 20px;
      height: calc(100% - 52px - 52px);
    }
  }
}
</style>
