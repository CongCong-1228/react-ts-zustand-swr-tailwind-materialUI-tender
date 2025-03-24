import { http } from './http';
const mesURL = import.meta.env.VITE_API_URL;

export const getTenderNoticeList = (url: string, params?: any) => {
  return http.getList(`${mesURL}/inviteTender/${url}`, params);
};

export const getTenderNoticeDetail = (url: string, params?: any) => {
  return http.getDetail(`${mesURL}/inviteTender/${url}`, params);
};

export const tenderNoticeBid = (url: string, params?: any) => {
  return http.post(`${mesURL}/tender/${url}`, params, true);
};

export const getMyBid = (url: string, params?: any) => {
  return http.post(`${mesURL}/tender/${url}`, params);
};

export const getBidRecord = (url: string, params?: any) => {
  return http.getList(`${mesURL}/tender/${url}`, params);
};

export const getWinningBidDetail = (url: string, params?: any) => {
  return http.getDetail(`${mesURL}/tender/${url}`, params);
};
