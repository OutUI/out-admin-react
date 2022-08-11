// 列表内容结构以及表单提交结构
export type PermListItem = {
  id: string; // 自增id
  name: string; // 名称
  slug: string; // 标识
  httpMethod: string[]; // 请求方式
  httpPath: string; // 请求路径
  desc?: string; // 描述
  updatedAt?: Date; // 更新时间
  createdAt?: Date; // 创建时间
};

// 查询参数
export interface PermListParams {
  id?: string; // 自增id
  name?: string; // 名称
  slug?: string; // 标识
  httpMethod?: string[]; // 请求方式
  httpPath?: string; // 请求路径
  desc?: string; // 描述
  sorter?: string; // 排序
  pageSize?: number;
  currentPage?: number;
}
