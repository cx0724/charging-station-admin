import type { RouteRecordRaw } from "vue-router";
// 白名单
const routes: RouteRecordRaw[] = [
  {
    path: "/",
    name: "home",
    component: () => import("@/view/Home.vue"),
    redirect: "/dashboard",
    children: [],
  },
  {
    path: "/login",
    name: "login",
    component: () => import("@/view/Login.vue"),
  },
  {
    path: "/:pathMath(.*)*",
    name: "notFound",
    component: () => import("@/view/NotFound.vue"),
  },
];

export default routes;
