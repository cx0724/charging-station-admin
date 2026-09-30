<template>
  <el-pagination
    class="fr mt mb my-pagination"
    v-model:current-page="currentPage"
    v-model:page-size="pageSize"
    :total="total"
    :page-sizes="pageSizes"
    :layout="layout"
    background
  />
</template>

<script setup lang="ts">
import { computed } from "vue";

const props = withDefaults(
  defineProps<{
    page: number;
    pageSize: number;
    total: number;
    pageSizes?: number[];
    layout?: string;
  }>(),
  {
    pageSizes: () => [10, 20, 30, 40],
    layout: "total, sizes, prev, pager, next, jumper",
  },
);

const emit = defineEmits<{
  "update:page": [value: number];
  "update:pageSize": [value: number];
}>();

const currentPage = computed({
  get: () => props.page,
  set: (value) => emit("update:page", value),
});

const pageSize = computed({
  get: () => props.pageSize,
  set: (value) => emit("update:pageSize", value),
});
</script>

<style scoped>
.my-pagination {
  margin: 20px 0px 0px;
}
.pagination {
  display: flex;
  justify-content: flex-end;
  margin-top: 20px;
}
</style>
