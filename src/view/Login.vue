<template>
  <div class="bg">
    <div class="login">
      <div class="logo">
        <img :src="logo" alt="" />
        <p>充电战管理系统</p>
      </div>
      <el-form
        ref="ruleFormRef"
        style="max-width: 600px"
        :model="ruleForm"
        :rules="rules"
        label-width="auto"
      >
        <el-form-item prop="name" placeholder="请输入用户名">
          <el-input
            v-model="ruleForm.name"
            prefix-icon="UserFilled"
            placeholder="请输入用户名"
            clearable
          />
        </el-form-item>
        <el-form-item prop="pwd" placeholder="请输入密码">
          <el-input
            v-model="ruleForm.pwd"
            type="password"
            prefix-icon="Lock"
            placeholder="请输入密码"
            show-password
            clearable
          />
        </el-form-item>
        <el-form-item>
          <el-button
            class="login-btn"
            type="primary"
            @click="submitForm(ruleFormRef)"
          >
            登录
          </el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script setup lang="ts" name="login">
import logo from "@/assets/logo.png";
import { reactive, ref } from "vue";
import type { FormInstance, FormRules } from "element-plus";
import { ElNotification } from "element-plus";
import { loginApi } from "@/api/modules/login";
import { useUserStore } from "@/store/user";
import { useRouter } from "vue-router";

interface RuleForm {
  name: string;
  pwd: string;
}

const userStore = useUserStore();
const router = useRouter();
const ruleFormRef = ref<FormInstance>();
const ruleForm = reactive<RuleForm>({
  name: "",
  pwd: "",
});
const rules = reactive<FormRules<RuleForm>>({
  name: [{ required: true, message: "请输入用户名", trigger: "blur" }],
  pwd: [{ required: true, message: "请输入密码", trigger: "blur" }],
});
const submitForm = async (formEl: FormInstance | undefined) => {
  if (!formEl) return;
  const valid = await formEl.validate();
  if (valid) {
    let res = await loginApi({
      username: ruleForm.name,
      password: ruleForm.pwd,
    });
    if (res.code == 200) {
      userStore.setUserInfo(res.data);
      // 使用 setUserInfo 处理后的菜单，确保动态路由带有 meta.title，面包屑可立即显示。
      userStore.addRouteToRouter(userStore.menulist, "home");
      userStore.isRouteAdd = true;
      router.push("/dashboard");
      ElNotification({
        title: "登录成功",
        message: `欢迎回来，${res.data.user.username}`,
        type: "success",
      });
    }
  }
};
</script>

<style lang="less" scoped>
.bg {
  height: 100vh;
  background-image: url("../assets/bg.png");
  background-repeat: no-repeat;
  background-size: cover;
  background-position: center;
  position: relative;
  .login {
    width: 500px;
    height: 300px;
    position: absolute;
    top: 50%;
    left: 10%;
    transform: translateY(-50%);
    box-shadow: 0 0 10px 10px #f4f4f4;
    background-color: #fff;
    box-sizing: border-box;
    padding: 40px;
    .logo {
      width: 100%;
      display: flex;
      justify-content: center;
      align-items: center;
      gap: 10px;
      margin-bottom: 30px;
      img {
        width: 50px;
        height: 50px;
      }
      p {
        font-size: 24px;
      }
    }
    :deep(.login-btn) {
      width: 100%;
      display: block;
      margin-top: 5px;
    }
  }
}
</style>
