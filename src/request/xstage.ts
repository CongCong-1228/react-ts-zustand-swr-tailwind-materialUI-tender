import { http } from './http';
const xstageURL = import.meta.env.VITE_XSTAGE_URL;


export const getVerificationCode = (url: string) => {
  return http.getBlob(`${xstageURL}/supplier/${url}`);
};

export const supplierLogin = (url: string, params?: any) => {
  return http.post(`${xstageURL}/supplier/${url}`, params);
};

export const supplierRegister = (url: string, params?: any) => {
  return http.post(`${xstageURL}/supplier/${url}`, params, true);
};
