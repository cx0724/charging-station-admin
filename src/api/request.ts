import axios, {
  type AxiosInstance,
  type InternalAxiosRequestConfig,
  type AxiosResponse,
  AxiosError,
} from "axios";

import { ElMessage } from "element-plus";
import { useUserStore } from "@/store/user";
import router from "@/router/index";
interface ApiResponse {
  code: number;
  message: string;
  data: any;
}

// 创建axios实例
const service: AxiosInstance = axios.create({
  baseURL: import.meta.env.DEV ? "/api" : import.meta.env.VITE_API_BASE_URL,
  timeout: 10000, // 请求超时时间 10秒
  headers: {
    "Content-Type": "application/json;charset=utf-8",
  },
});

const userStore = useUserStore();
// ========== 请求拦截器 ==========
// 每次发请求前执行：携带token
service.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    config.headers.Authorization = `Bearer ${userStore.token}`;
    config.headers["X-Order-No"] = "2026090923001461941415054538";
    config.headers["X-Phone"] = "17356475185";
    config.headers["X-Name"] = "shiqi";
    return config;
  },
  (error: AxiosError) => {
    ElMessage.error(error || "业务请求失败");
    return Promise.reject(error);
  },
);

// ========== 响应拦截器 ==========
// 拿到接口返回数据后统一处理
service.interceptors.response.use(
  (response: AxiosResponse) => {
    // response.data 就是后端返回的 {code,msg,data}
    const res = response.data;
    // 业务状态码判断
    if (res.code === 200) {
      return res; // 直接返回业务对象，页面不用再 .data
    } else {
      // 业务失败：400/401等，弹出提示
      ElMessage.error(res.msg || "请求失败");
      return Promise.reject(res);
    }
  },
  (error: AxiosError) => {
    // HTTP层面错误：404、500、网络超时
    let message = "网络异常，请稍后重试";
    if (error.response) {
      switch (error.response.status) {
        case 401:
          message = (error.response?.data as ApiResponse).message;
          console.log("准备跳转登录页");
          userStore.clearUserInfo();
          router.push("/login");
          break;
        case 403:
          message = "权限不足";
          break;
        case 404:
          message = "接口地址不存在";
          break;
        case 500:
          message = "服务器内部错误";
          break;
      }
    } else if (error.message.includes("timeout")) {
      message = "请求超时";
    }
    ElMessage.error(message);
    return Promise.reject(error);
  },
);

interface RequestInstance {
  get<T = unknown>(url: string, config?: any): Promise<T>;

  post<T = unknown>(url: string, data?: any, config?: any): Promise<T>;

  put<T = unknown>(url: string, data?: any, config?: any): Promise<T>;

  delete<T = unknown>(url: string, config?: any): Promise<T>;
}

const request = service as unknown as RequestInstance;

export default request;
