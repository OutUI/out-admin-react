// 列表内容结构以及表单提交结构
export type LogListItem = {
  id: string; // 自增id
  userId: string; // 用户ID
  method: string; // 请求方式
  path: string; // 请求路径
  input: string; // 请求参数
  ip: string; // IP
  updatedAt?: Date; // 更新时间
  createdAt?: Date; // 创建时间
};

// 查询参数
export type LogListParams = {
  id?: string; // 自增id
  name?: string; // 名称
  method?: string[]; // 请求方式
  path?: string; // 请求路径
  ip?: string; // 描述
  sorter?: string; // 排序
  pageSize?: number;
  currentPage?: number;
};
