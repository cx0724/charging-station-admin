<template>
  <div class="Home">
    <el-container>
      <el-aside width="200px">
        <Menu></Menu>
      </el-aside>
      <el-container>
        <el-header>
          <Header></Header>
        </el-header>
        <el-main>
          <Tabs></Tabs>
        </el-main>
      </el-container>
    </el-container>
  </div>
</template>

<script setup lang="ts" name="index">
import Menu from "@/components/menu/index.vue";
import Header from "@/components/header/index.vue";
import Tabs from "@/components/header/tabs.vue";
</script>

<style scoped lang="less">
.el-aside {
  height: 100vh;
  background-color: white;
  // border: 1px solid hsl(240deg 6.12% 90.39%);
  box-shadow:
    6px 0 16px 0 rgba(0, 0, 0, 0.08),
    3px 0 6px -4px rgba(0, 0, 0, 0.12),
    9px 0 28px 8px rgba(0, 0, 0, 0.05);
}
.el-main {
  padding: 10px !important;
}
.el-main {
  height: 80vh;
  overflow: auto;
  margin-top: 5px;
  box-sizing: border-box;
}
.el-header {
  border-bottom: 1px solid hsl(240deg 6.12% 90.39%);
  border-left: 1px solid hsl(240deg 6.12% 90.39%);
  overflow: hidden;
  background-color: white;
}
</style>
