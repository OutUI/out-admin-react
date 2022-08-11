export default [
  {
    path: "/user",
    layout: false,
    routes: [
      {
        path: "/user",
        routes: [
          { name: "登录", path: "/user/login", component: "./user/Login" },
        ],
      },
      { component: "./404" },
    ],
  },
  {
    path: "/table",
    name: "桌台",
    icon: "icon-zhuozi",
    access: "canAdmin",
    component: "./Table",
  },
  {
    path: "/welcome",
    name: "订餐",
    icon: "icon-diancan",
    component: "./Welcome",
  },
  {
    name: "订单",
    icon: "icon-dingdan",
    path: "/list",
    component: "./TableList",
  },
  {
    path: "/report",
    name: "统计",
    icon: "icon-shuju",
    access: "canAdmin",
    component: "./Admin",
  },
  {
    path: "/admin",
    name: "管理",
    icon: "icon-xitongguanli",
    access: "canAdmin",
    //component: './admin',
    routes: [
      {
        path: "/admin/user",
        name: "用户管理",
        //hideInMenu: true,
        icon: "smile",
        component: "./admin/users",
      },
      {
        path: "/admin/role",
        name: "角色管理",
        ///hideInMenu: true,
        icon: "smile",
        component: "./admin/roles",
      },
      {
        path: "/admin/permission",
        name: "权限管理",
        ///hideInMenu: true,
        icon: "smile",
        component: "./admin/permissions",
      },
      {
        path: "/admin/menu",
        name: "菜单管理",
        ///hideInMenu: true,
        icon: "smile",
        component: "./admin/menus",
      },
      {
        path: "/admin/log",
        name: "操作日志",
        ///hideInMenu: true,
        icon: "smile",
        component: "./admin/logs",
      },
      { component: "./404" },
    ],
  },
  { path: "/", redirect: "/welcome" },
  { component: "./404" },
];
