import vue from "@vitejs/plugin-vue";
import { defineConfig, loadEnv } from "vite";
import path from "path";
// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  // 仅在 Vite 服务端读取这些变量，绝不使用 VITE_ 前缀，避免被打进浏览器包。
  const env = loadEnv(mode, ".", "");
  const proxyHeaders: Record<string, string> = {};
  if (env.API_ORDER_NO) proxyHeaders["X-Order-No"] = env.API_ORDER_NO;
  if (env.API_PHONE) proxyHeaders["X-Phone"] = env.API_PHONE;
  if (env.API_NAME) proxyHeaders["X-Name"] = env.API_NAME;

  return {
    plugins: [vue()],
    server: {
      proxy: {
        // 匹配所有以 /api 开头的请求
        "/api": {
          target: env.API_BACKEND_URL || "http://121.41.88.138:3000",
          changeOrigin: true,
          headers: proxyHeaders,
          rewrite: (requestPath) => requestPath.replace(/^\/api/, ""),
        },
      },
    },
    resolve: {
      alias: {
        "@": path.resolve(import.meta.dirname, "./src"),
      },
    },
  };
});
