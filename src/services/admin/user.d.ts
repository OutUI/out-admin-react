import type { PermListItem } from "./permission.d";
import type { RoleListItem } from "./role.d";

// 列表内容结构以及表单提交结构
export type UserListItem = {
  id: string; // 自增id
  username: string; // 账号
  name: string; // 名称
  avatar?: string; // 头像
  password?: string; // 密码
  passwordConfirmation?: string; // 确认密码
  roles?: RoleListItem[]; // 角色
  permissions?: PermListItem[]; // 权限
  updatedAt?: Date; // 更新时间
  createdAt?: Date; // 创建时间
};

// 查询参数
export interface UserListParams {
  id?: string; // 自增id
  name?: string; // 名称
  username?: string; // 账号
  sorter?: string; // 排序
  pageSize?: number;
  currentPage?: number;
}
