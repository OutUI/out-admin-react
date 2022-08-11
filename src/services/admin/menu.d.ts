// 列表内容结构以及表单提交结构
export type MenuListItem = {
  id: string; // 自增id
  parentId: string; // 父级ID
  name: string; // 名称
  path?: string; // 路径
  roles?: any[]; // 角色
  permission?: string; // 权限
  order?: string; // 排序
  updatedAt?: Date; // 更新时间
  createdAt?: Date; // 创建时间
};

// 查询参数
export interface MenuListParams {
  id?: string; // 自增id
  name?: string; // 名称
  username?: string; // 账号
  sorter?: string; // 排序
  pageSize?: number;
  currentPage?: number;
}
