<template>
  <div class="header">
    <!-- 面包屑 -->
    <div class="breadcrumb">
      <Breadcrumb></Breadcrumb>
    </div>
    <div class="right">
      <div class="msg">
        <el-badge is-dot class="item">
          <el-icon><Bell /></el-icon>
        </el-badge>
      </div>
      <div class="avatar">
        <el-avatar
          src="https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png"
        />
      </div>
      <el-dropdown @command="handleCommand">
        <span class="el-dropdown-link">
          {{ userName }}
          <el-icon class="el-icon--right"><arrow-down /></el-icon>
        </span>
        <template #dropdown>
          <el-dropdown-menu>
            <el-dropdown-item icon="SwitchButton" command="exit">
              退出登录
            </el-dropdown-item>
          </el-dropdown-menu>
        </template>
      </el-dropdown>
    </div>
  </div>
</template>

<script setup lang="ts" name="index">
import { useUserStore } from "@/store/user";
import { computed } from "vue";
import { useRouter } from "vue-router";
import Breadcrumb from "@/components/breadcrumb/index.vue";
const userStore = useUserStore();
const router = useRouter();
const handleCommand = (_command: string | number | object) => {
  userStore.clearUserInfo();
  router.push("/login");
};

const userName = computed(() => {
  return userStore.userName;
});
</script>

<style scoped lang="less">
.header {
  width: 100%;
  height: 52px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  .right {
    display: flex;
    align-items: center;
    gap: 20px;
  }
}
</style>
