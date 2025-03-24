import { create } from 'zustand';
import { setLocalStorageEncryptItem, getLocalStorageDecryptItem, setLocalStorageItem, getLocalStorageItem } from '@/utils/crypto';
interface LocalStore {
  token: string;
  captchaUuid: string;
  customer: {
    id: string;
    mail: string;
    phone: string;
    name: string;
    logo: string;
    account: string;
    tel: string;
    director: string;
    address: string;
  };
  setToken: (token: string) => void;
  setCaptchaUuid: (uuid: string) => void;
  setCustomer: (customer: {
    id: string;
    mail: string;
    phone: string;
    name: string;
    logo: string;
    account: string;
    tel: string;
    director: string;
    address: string;
  }) => void;

  logout: () => void;
}

export const useLocalStore = create<LocalStore>((set) => ({
  token: getLocalStorageDecryptItem('token', ''),
  captchaUuid: getLocalStorageDecryptItem('captchaUuid', ''),
  customer: getLocalStorageItem('customer', {}),
  setToken: (token) => {
    setLocalStorageEncryptItem('token', token);
    set({ token });
  },
  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('captchaUuid');
    localStorage.removeItem('customer');
    set({
      token: '',
      captchaUuid: '',
      customer: {
        id: '',
        mail: '',
        phone: '',
        name: '',
        logo: '',
        account: '',
        tel: '',
        director: '',
        address: '',
      }
    });
  },
  setCaptchaUuid: (uuid) => {
    setLocalStorageEncryptItem('captchaUuid', uuid);
    set({ captchaUuid: uuid });
  },
  setCustomer: (customer) => {
    setLocalStorageItem('customer', customer);
    set({ customer: {...customer} });
  },
}));



