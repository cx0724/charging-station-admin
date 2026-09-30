import { createApp } from "vue";
import "./style.css";
import App from "./App.vue";
// 持久化插件
// import piniaPluginPersistedstate from 'pinia-plugin-persistedstate'
// UI库
import ElementPlus from "element-plus";
import "element-plus/dist/index.css";
import * as ElementPlusIconsVue from "@element-plus/icons-vue";
import zhCn from "element-plus/es/locale/lang/zh-cn";
// pinia
import { createPinia } from "pinia";
const pinia = createPinia();
// 路由
import rotuer from "./router/index.ts";
// 挂载
const app = createApp(App);
for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
  app.component(key, component);
}
app.use(ElementPlus, {
  locale: zhCn,
});
// pinia.use(piniaPluginPersistedstate)
app.use(pinia);
app.use(rotuer);
app.mount("#app");
