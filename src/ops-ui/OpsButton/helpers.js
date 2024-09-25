import { useCommonStore } from '@/store/common';
import { toRaw } from 'vue';

export function allowClicking(pageCode, authCode) {
  const allowedList = toRaw(getAllowedList(pageCode));
  if (authCode) {
    return allowedList.includes(authCode);
  }
  return true;
}

export function getAllowedList(pageCode) {
  const store = useCommonStore();
  const authenticationList = store.userInfo;
  return authenticationList[pageCode] || [];
}
