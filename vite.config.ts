import vue from "@vitejs/plugin-vue";
import { defineConfig } from "vite";
import path from "path";
// https://vite.dev/config/
export default defineConfig({
  plugins: [vue()],
  server: {
    proxy: {
      // 匹配所有以 /api 开头的请求
      "/api": {
        target: "http://121.41.88.138:3000",
        changeOrigin: true, // 必须开启，修改请求源，解决跨域
        rewrite: (path) => path.replace(/^\/api/, ""),
      },
    },
  },
  resolve: {
    alias: {
      "@": path.resolve(import.meta.dirname, "./src"),
    },
  },
});
