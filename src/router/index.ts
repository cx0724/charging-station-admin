import { createRouter, createWebHistory } from "vue-router";
import routes from "./routers";
import { useUserStore } from "@/store/user";

const router = createRouter({
  history: createWebHistory(),
  routes,
});
router.beforeEach((to) => {
  const userStore = useUserStore();
  const isLogin = userStore.token;

  // 白名单
  if (!isLogin) {
    if (to.path !== "/login") {
      return { path: "/login" };
    }
  } else {
    if (to.path == "/login") {
      return { path: "/" };
    }
    // 如果动态路由还没有添加
    if (!userStore.isRouteAdd) {
      // 没有菜单，就不能添加动态路由
      if (!userStore.menulist?.length) {
        console.log("当前没有菜单，等待重新获取菜单");
        return "/login";
      }
      userStore.addRouteToRouter(userStore.menulist, "home");
      userStore.isRouteAdd = true;

      // 重新跳转当前页面，刷新路由匹配
      return to.fullPath;
    }
  }
});

export default router;
