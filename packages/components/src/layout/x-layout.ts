import type { RouteRecordRaw } from 'vue-router';

/**
 * menu item 类型
 */
enum MenuType {
    /** 有子菜单 */
    submenu = 'submenu',
    /** 无子菜单 */
    menuItem = 'menuItem',
}

/**
 * 处理路由转换为el-menu-item数组
 * @param { RouteRecordRaw[] } routes 路由数组
 * @param { string[] | undefined } permissions 权限数组
 * @returns 处理后数组
 */
function routesToMenuItemList(routes: RouteRecordRaw[], permissions?: string[]): RouteRecordRaw[] {
    const menuRoutes: RouteRecordRaw[] = [];

    for (let i = 0; i < routes.length; i += 1) {
        const currentRoute = routes[i];

        if (!currentRoute.meta || currentRoute.meta.hidden) {
            continue;
        }

        // 无权限
        if (permissions && !permissions.includes(currentRoute.meta.title as string)) {
            continue;
        }

        // 区分menu类型
        if (currentRoute.children && currentRoute.children.length > 0) {
            currentRoute.meta.type = MenuType.submenu;

            // 递归 children
            currentRoute.children = routesToMenuItemList(currentRoute.children);
        } else {
            currentRoute.meta.type = MenuType.menuItem;
        }

        menuRoutes.push(currentRoute);
    }

    return menuRoutes;
}

export { routesToMenuItemList, MenuType };
