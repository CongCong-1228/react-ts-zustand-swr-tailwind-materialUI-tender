import axios from 'axios';
import { useLocalStore } from '@/stores/useLocalStore';
import { CheckUtil } from '@/utils/check';
import { useMessageStore } from '@/stores/useMessageStore';
const axiosCreate = axios.create({
  timeout: 60000,
  headers: {
    'Content-Type': 'application/x-www-form-urlencoded',
  },
});

// 请求拦截器：如果 token 存在，添加 oauth 字段
axiosCreate.interceptors.request.use((config) => {
  const token = useLocalStore.getState().token;

  if (token) {
    // 对于 POST/PATCH/PUT 请求，添加 token 到请求体
    if (config.method !== 'get' && config.data) {
      // 如果是 FormData
      if (CheckUtil.isFormData(config.data)) {
        if (!config.data.get('oauth')) {
          config.data.append('oauth', token);
        }
      } else if (typeof config.data === 'object') {
        config.data = {
          ...config.data,
          oauth: token,
        };
      }
    }

    // 同时也添加到请求头，以确保认证信息被正确传递
    config.headers = config.headers || {};
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

axiosCreate.interceptors.response.use(
  (response: any) => {
    const data = response.data;
    const code = data.code;
    if (code === 1) {
      return response;
    }
    if ([-401, 401].includes(code)) {
      useLocalStore.getState().logout();
      window.location.href = '/';
      return;
    }
    return response;
  },
  (error) => {
    const { status, data } = error.response;
    if (error.response) {
      if (status === 401) {
        const isLoginPage = window.location.pathname === '/';
        useMessageStore.getState().showMessage({
          severity: 'error',
          message: `未授权，${
            isLoginPage ? '请重新登录' : '3秒后自动为您跳转到登录页'
          }！`,
          duration: 3000,
        });
        useLocalStore.getState().logout();
        setTimeout(() => {
          !isLoginPage && (window.location.href = '/');
        }, 3000);
      }
      // 处理其他 HTTP 错误状态码
      let message = data?.message || `请求失败，状态码: ${status}`;
      switch (status) {
        case 400:
          message = data?.message || '请求参数错误';
          break;
        case 403:
          message = '权限不足，无法访问';
          break;
        case 404:
          message = '请求的资源不存在';
          break;
        case 500:
          message = '服务器内部错误';
          break;
        default:
          message = data?.message || `服务器错误 (${status})`;
      }

      useMessageStore.getState().showMessage({
        severity: 'error',
        message,
        duration: 3000,
      });
    } else if (axios.isCancel(error)) {
      console.log('Request canceled:', error.message);
    } else {
      let message = '网络连接错误，请检查您的网络';
      if (error.message.includes('timeout')) {
        message = '请求超时，请稍后再试';
      }
      useMessageStore.getState().showMessage({
        severity: 'error',
        message,
        duration: 3000,
      });
    }

    return Promise.reject(error);
  },
);

export const http = {
  getList<T>(url: string, data: any): Promise<T> {
    return new Promise((resolve, reject) => {
      axiosCreate
        .get<any, any>(url, {
          ...data,
        })
        .then((response) => {
          const data = response.data;
          if (data.code === 1) {
            const list = data.data.data;
            const total = data.data.count;
            const result: any = {
              list,
              total,
            };
            resolve(result);
          } else {
            reject(data.message);
          }
        })
        .catch((err) => {
          reject(err);
        });
    });
  },
  getDetail<T>(url: string, data: any): Promise<T> {
    return new Promise((resolve, reject) => {
      axiosCreate
        .post(url, {
          ...data,
        })
        .then((response) => {
          const data = response.data;
          if (data.code === 1) {
            const result = data.data;
            resolve(result);
          } else {
            reject(data.message);
          }
        })
        .catch((err) => {
          reject(err);
        });
    });
  },
  async getBlob(url: string) {
    const response: any = await axiosCreate.get(url, {
      responseType: 'blob',
    });
    return response;
  },
  post(url: string, data: any, inDataFlag: boolean = false) {
    return axiosCreate.post(
      url,
      inDataFlag ? { data: JSON.stringify(data) } : data,
    );
  },
  patch(url: string, data: any) {
    return axiosCreate.patch(url, data);
  },
  delete(url: string) {
    return axiosCreate.delete(url);
  },
};
