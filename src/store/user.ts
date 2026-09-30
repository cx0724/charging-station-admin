import { defineStore } from "pinia";
import router from "@/router";
import type { MenuItem } from "@/types/menu";

const viteComponent = import.meta.glob("../view/**/*.vue");

const whiteList = ["home", "login", "notFound"];

const componentMap: Record<string, string> = {
  "/dashboard": "dashboard/Index",
  // "/chargingstation": "chargingstation/Monitor",
  "/chargingstation/monitor": "chargingstation/Monitor",
  "/chargingstation/revenue": "chargingstation/Revenue",
  "/chargingstation/fault": "chargingstation/Fault",
  "/map": "map/Index",
  // "/operations": "operations/Orders",
  "/operations/orders": "operations/Orders",
  // "/system": "system/Index",
};

const hiddenMenuUrls = new Set<string>([
  "/operations/detail", // 订单详情
  "/operations/total", // 计费管理
  "/alarm", // 报警管理
  "/equipment", // 会员卡管理
  "/document", // 招商管理
  "/personal", // 个人中心
  "/system",
]);

// 过滤无需页面
function filterMenuList(menuList: MenuItem[] = []): MenuItem[] {
  return menuList
    .filter((item: MenuItem) => !hiddenMenuUrls.has(item.url))
    .map((item: MenuItem) => ({
      ...item,
      meta: {
        title: item.name,
      },
      children: Array.isArray(item.children)
        ? filterMenuList(item.children)
        : item.children,
    }));
}

function routePath(url: string): string {
  return url.replace(/^\//, "");
}

export const useUserStore = defineStore("user", {
  state: () => ({
    userName: localStorage.getItem("userName") || "",

    token: localStorage.getItem("token") || "",

    menulist: localStorage.getItem("menulist")
      ? (JSON.parse(localStorage.getItem("menulist")!) as MenuItem[])
      : [],

    isRouteAdd: false,
  }),

  actions: {
    setUserInfo(data: {
      token: string;
      user: {
        username: string;
      };
      menulist: MenuItem[];
    }) {
      if (data.token) this.token = data.token;

      if (data.user.username) {
        this.userName = data.user.username;
      }

      const filteredMenuList = filterMenuList(data.menulist || []);

      if (data.menulist) {
        this.menulist = filteredMenuList;
      }

      localStorage.setItem("token", data.token);

      localStorage.setItem("menulist", JSON.stringify(filteredMenuList));

      localStorage.setItem("userName", data.user.username);
    },

    addRouteToRouter(data: MenuItem[], parentName: string) {
      data.forEach((item) => {
        const componentPath = componentMap[item.url];
        const routeName = routePath(item.url);

        // 仅给真正有页面组件的菜单注册路由
        if (componentPath) {
          router.addRoute(parentName, {
            path: item.url,
            name: routeName,
            component: viteComponent[`../view/${componentPath}.vue`],
            meta: item.meta,
          });
        }

        // 父级菜单没有页面组件时，子菜单沿用当前父路由
        if (item.children?.length) {
          this.addRouteToRouter(
            item.children,
            componentPath ? routeName : parentName,
          );
        }
      });
    },
    clearUserInfo() {
      const removeRoutes = (items: MenuItem[]) =>
        items.forEach((item: MenuItem) => {
          const name = routePath(item.url);

          // if (router.hasRoute(name)) router.removeRoute(name);
          // if (item.children?.length) removeRoutes(item.children);

          // 白名单路由不删除
          if (router.hasRoute(name) && !whiteList.includes(name)) {
            router.removeRoute(name);
          }

          if (item.children?.length) {
            removeRoutes(item.children);
          }
        });

      removeRoutes(this.menulist);

      this.isRouteAdd = false;

      localStorage.clear();

      this.$reset();
    },
  },
});
