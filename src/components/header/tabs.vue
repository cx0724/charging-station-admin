<template>
  <div class="tabs">
    <el-tabs
      v-model="tabsStore.active.name"
      type="card"
      class="demo-tabs"
      @tab-click="handleClick"
      closable
      @tab-remove="removeTab"
    >
      <el-tab-pane
        :label="item.name"
        :name="item.name"
        :key="item.url"
        v-for="item in tabsStore.tabsList"
      >
        <template #label>
          <span class="custom-tabs-label">
            <el-icon>
              <component :is="item.icon"></component>
            </el-icon>
            <span>{{ item.name }}</span>
          </span>
        </template>
      </el-tab-pane>
    </el-tabs>
    <RouterView />
  </div>
</template>

<script setup lang="ts" name="tabs">
import { useFlatArray } from "@/hooks/useFlatArray";
import { useTabsStore } from "@/store/tabs";
import { useUserStore } from "@/store/user";
import { useRoute, useRouter } from "vue-router";

const route = useRoute();
const router = useRouter();
const userStore = useUserStore();
const tabsStore = useTabsStore();

const { flat } = useFlatArray();
const meun = flat(userStore.menulist).find((item) => item.url === route.path);
tabsStore.addTabs(meun.icon, meun.url, meun.name);
tabsStore.activeTab(meun.name, meun.url);

const handleClick = ({ index }: { index: number }) => {
  tabsStore.activeTab(
    tabsStore.tabsList[index].name,
    tabsStore.tabsList[index].url,
  );
  router.push(tabsStore.tabsList[index].url);
};
const removeTab = (targetName: string) => {
  tabsStore.delTabs(targetName);
  router.push(tabsStore.active.url);
};
</script>

<style scoped lang="less">
.tabs {
  height: 100%;
}
::v-deep(.is-active) {
  background-color: #409eff !important;
  color: white;
}
::v-deep(.el-tabs__nav-scroll) {
  background-color: white;
}
.custom-tabs-label {
  span {
    margin-left: 8px;
    display: inline-block;
  }
}
</style>
