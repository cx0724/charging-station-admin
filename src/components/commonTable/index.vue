<template>
  <el-table
    v-loading="loading"
    :data="data"
    border
    style="width: 100%"
    @selection-change="handleSelectionChange"
  >
    <el-table-column v-if="showSelection" type="selection" />
    <!-- 序号 -->
    <el-table-column v-if="showIndex" type="index" label="序号" width="80" />

    <!-- 动态生成普通列 -->
    <el-table-column
      v-for="item in columns"
      :key="item.prop"
      :prop="item.prop"
      :label="item.label"
      :width="item.width"
    >
      <template #default="scope">
        <!--
            如果外部提供了同名插槽，
            就使用外部插槽
            -->
        <slot :name="item.prop" :row="scope.row">
          <!-- 没有特殊插槽，就直接显示数据 -->
          {{ scope.row[item.prop] }}
        </slot>
      </template>
    </el-table-column>

    <!-- 操作列 -->
    <el-table-column
      v-if="showOperation"
      label="操作"
      :width="operationWidth"
      fixed="right"
    >
      <template #default="scope">
        <slot name="operation" :row="scope.row" />
      </template>
    </el-table-column>
  </el-table>
</template>

<script setup lang="ts">
interface Column {
  prop: string;
  label: string;
  width?: string | number;
}
const props = withDefaults(
  defineProps<{
    data: any[];
    columns: Column[];
    loading?: boolean;
    showIndex?: boolean;
    showOperation?: boolean;
    operationWidth?: number;
    showSelection?: boolean;
  }>(),
  {
    showIndex: true,
    showOperation: false,
    operationWidth: 150,
    showSelection: false,
  },
);
const emit = defineEmits(["selectionChange"]);
const handleSelectionChange = (val: any[]) => {
  emit("selectionChange", val);
};
</script>
