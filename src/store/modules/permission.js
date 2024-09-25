import { ref } from 'vue';
import store from '@/store';
import { defineStore } from 'pinia';
import { publicRoutes, protectedRoutes } from '@/router';
// import { flatMultiLevelRoutes } from '@/router/helper';
// import routeSettings from '@/config/route';

const hasPermission = (roles, route) => {
  const routeRoles = route.meta?.roles;
  return routeRoles ? roles.some((role) => routeRoles.includes(role)) : true;
};

const filterProtectedRoutes = (routes, roles) => {
  const res = [];
  routes.forEach((route) => {
    const tempRoute = { ...route };
    if (hasPermission(roles, tempRoute)) {
      if (tempRoute.children) {
        tempRoute.children = filterProtectedRoutes(tempRoute.children, roles);
      }
      res.push(tempRoute);
    }
  });
  return res;
};

export const usePermissionStore = defineStore('permission', () => {
  /** 可访问的路由 */
  const allRoutes = ref([]);
  /** 有访问权限的动态路由 */
  const grantedRoutes = ref([]);

  /** 根据角色生成可访问的 Routes（可访问的路由 = 常驻路由 + 有访问权限的动态路由） */
  const setRoutes = (roles) => {
    const routes = filterProtectedRoutes(protectedRoutes, roles);
    _set(routes);
  };

  /** 所有路由 = 所有常驻路由 + 所有动态路由 */
  const setAllRoutes = () => {
    _set(protectedRoutes);
  };

  const _set = (routes) => {
    allRoutes.value = publicRoutes.concat(routes);
    // grantedRoutes.value = routeSettings.thirdLevelRouteCache ? flatMultiLevelRoutes(routes) : routes;
    grantedRoutes.value = routes;
  };

  // 生成可访问的 Routes
  setAllRoutes();

  return { allRoutes, grantedRoutes, setRoutes, setAllRoutes };
});

/** 在 setup 外使用 */
export function usePermissionStoreHook() {
  return usePermissionStore(store);
}
