import CryptoJS from "crypto-js";
import {CheckUtil} from "@/utils/check";

const SECRET_KEY = "xt_secret";

/** 加密 **/
export function encrypt(value: any) {
  if (!CheckUtil.isString(value)) {
    return
  }

  return CryptoJS.AES.encrypt(value, SECRET_KEY).toString();
}

/** 解密 **/
export function decrypt(value: any) {
  if (!CheckUtil.isString(value)) {
    return
  }

  return CryptoJS.AES.decrypt(value, SECRET_KEY).toString(CryptoJS.enc.Utf8);
}
export function getLocalStorageItem (key: any, initValue: any) {
  const storedValue = localStorage.getItem(key);
  if (!storedValue) return initValue;

  try {
    return JSON.parse(storedValue);
  } catch (error) {
    console.error(`Error parsing stored value for key "${key}":`, error);
    return initValue;
  }
}

export function setLocalStorageItem (key: any, value: any) {
  localStorage.setItem(key, JSON.stringify(value))
}
export function setLocalStorageEncryptItem (key: any, value: any) {
  localStorage.setItem(key, encrypt(value) as string)
}

export function getLocalStorageDecryptItem (key: any, initValue: any) {
  const encryptedValue = localStorage.getItem(key);
  if (!encryptedValue) return initValue;

  try {
    const decryptedValue = decrypt(encryptedValue);

    // 如果解密后是一个JSON字符串，尝试解析它
    if (decryptedValue && (decryptedValue.startsWith('{') || decryptedValue.startsWith('['))) {
      try {
        return JSON.parse(decryptedValue);
      } catch (e) {
        console.error(`Error parsing decrypted JSON for key "${key}":`, e);
        return decryptedValue; // 返回原始解密字符串
      }
    }

    return decryptedValue || initValue;
  } catch (error) {
    console.error(`Error decrypting value for key "${key}":`, error);
    return initValue;
  }
}

export function setSessionStorageEncryptItem (key: any, value: any) {
  sessionStorage.setItem(key, encrypt(value) as string)
}

export function getSessionStorageDecryptItem (key: any, initValue: any) {
  const encryptedValue = sessionStorage.getItem(key);
  if (!encryptedValue) return initValue;

  try {
    const decryptedValue = decrypt(encryptedValue);

    // 如果解密后是一个JSON字符串，尝试解析它
    if (decryptedValue && (decryptedValue.startsWith('{') || decryptedValue.startsWith('['))) {
      try {
        return JSON.parse(decryptedValue);
      } catch (e) {
        console.error(`Error parsing decrypted JSON for key "${key}":`, e);
        return decryptedValue; // 返回原始解密字符串
      }
    }

    return decryptedValue || initValue;
  } catch (error) {
    console.error(`Error decrypting value for key "${key}":`, error);
    return initValue;
  }
}
