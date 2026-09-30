<template>
  <el-sub-menu v-if="item?.children" :index="item.url">
    <template #title>
      <el-icon>
        <component :is="item.icon"></component>
      </el-icon>
      <span>{{ item?.name }}</span>
    </template>
    <MenuItem
      v-for="children in item?.children"
      :item="children"
      :key="children.url"
    ></MenuItem>
  </el-sub-menu>
  <el-menu-item v-else @click="add(item)" :index="item?.url">
    <el-icon>
      <component :is="item?.icon"></component>
    </el-icon>
    <span>{{ item?.name }}</span>
  </el-menu-item>
</template>

<script setup lang="ts" name="menuItem">
import { useTabsStore } from "@/store/tabs";

defineProps({
  item: {
    type: Object,
  },
});

const tabsStore = useTabsStore();
const add = (item: any) => {
  tabsStore.addTabs(item.icon, item.url, item.name);
  tabsStore.activeTab(item.name, item.url);
};
</script>

<style scoped lang="less">
.is-active {
  background-color: #409eff !important;
  color: white;
  // :deep(.el-sub-menu__title) {
  //   background-color: #fff !important;
  //   i,
  //   span {
  //     color: #409eff !important;
  //   }
  // }
  .el-sub-menu__title {
    span,
    i {
      color: white;
    }
    &:hover {
      span,
      i {
        color: black !important;
      }
    }
  }
}
</style>
