import type { PermListItem } from "./permission.d";
// 列表内容结构以及表单提交结构
export type RoleListItem = {
  id: string; // 自增id
  name: string; // 名称
  slug: string; // 标识
  permissions: PermListItem[]; // 权限
  updatedAt?: Date; // 更新时间
  createdAt?: Date; // 创建时间
};

// 查询参数
export type RoleListParams = {
  id?: string; // 自增id
  name?: string; // 名称
  slug?: string; // 标识
  desc?: string; // 描述
  sorter?: string; // 排序
  pageSize?: number;
  currentPage?: number;
};
