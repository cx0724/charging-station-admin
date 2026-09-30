<template>
  <div class="index">
    <el-menu
      class="el-menu-vertical-demo"
      :router="true"
      :default-active="$route.path"
    >
      <div class="title">
        <img :src="logo" />
        <p>充电战管理系统</p>
      </div>
      <MenuItem
        v-for="item in userStore.menulist"
        :item="item"
        :key="item.url"
      ></MenuItem>
    </el-menu>
  </div>
</template>

<script setup lang="ts" name="index">
import MenuItem from "./menuItem.vue";
import { useUserStore } from "@/store/user";
import logo from "@/assets/logo.png";

const userStore = useUserStore();
</script>

<style scoped lang="less">
.el-menu {
  border-right: 0px;
  .title {
    display: flex;
    align-items: center;
    padding: 10px 0px 14px 20px;
    cursor: pointer;
    img {
      width: 35px;
      margin-right: 10px;
    }
  }
}
</style>
