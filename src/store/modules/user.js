import { ref } from 'vue';
import store from '@/store';
import { defineStore } from 'pinia';
// import { useTagsViewStore } from './tags-view';
// import { useSettingsStore } from './settings';
import { getToken, removeToken, setToken } from '@/utils/cookies';
import { resetRouter } from '@/router';
import { loginApi, getUserInfoApi } from '@/api/login';
import routeSettings from '@/config/route';
import { useRouter } from 'vue-router';

export const useUserStore = defineStore('user', () => {
  const token = ref(getToken() || '');
  const roles = ref([]);
  const username = ref('');
  const router = useRouter();

  // const tagsViewStore = useTagsViewStore();
  // const settingsStore = useSettingsStore();

  /** 登录 */
  const login = async ({ username, password, code }) => {
    const { data } = await loginApi({ username, password, code });
    setToken(data.token);
    token.value = data.token;
  };

  /** 获取用户详情 */
  const getInfo = async () => {
    const { data } = await getUserInfoApi();
    username.value = data.username;
    // 验证返回的 roles 是否为一个非空数组，否则塞入一个没有任何作用的默认角色，防止路由守卫逻辑进入无限循环
    roles.value = data.roles?.length > 0 ? data.roles : routeSettings.defaultRoles;
  };

  /** 模拟角色变化 */
  const changeRoles = async (role) => {
    const newToken = 'token-' + role;
    token.value = newToken;
    setToken(newToken);
    // 用刷新页面代替重新登录
    window.location.reload();
  };

  /** 登出 */
  const logout = async () => {
    removeToken();
    token.value = '';
    roles.value = [];
    resetRouter();
    document.body.style.visibility = 'hidden';
    await router.replace({ path: '/login' });
    location.reload();
    // _resetTagsView();
  };

  /** 重置 Token */
  const resetToken = () => {
    removeToken();
    token.value = '';
    roles.value = [];
  };

  /** 重置 Visited Views 和 Cached Views */
  // const _resetTagsView = () => {
  //   if (!settingsStore.cacheTagsView) {
  //     tagsViewStore.delAllVisitedViews();
  //     tagsViewStore.delAllCachedViews();
  //   }
  // };

  return { token, roles, username, login, getInfo, changeRoles, logout, resetToken };
});

/** 在 setup 外使用 */
export function useUserStoreHook() {
  return useUserStore(store);
}
