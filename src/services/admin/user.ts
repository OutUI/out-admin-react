import { request } from "umi";
import type { UserListItem, UserListParams } from "./user.d";

export async function queryUser(params: UserListParams) {
  return request<API.Response<API.PagingData<UserListItem>>>(
    "/api/admin/user/query",
    {
      method: "GET",
      params: {
        ...params,
      },
    }
  );
}

export async function showUser(params?: { id: string }) {
  return request<API.Response<UserListItem>>("/api/admin/user/show", {
    params,
  });
}

export async function updateUser(params: UserListItem) {
  return request<UserListItem>("/api/admin/user/update", {
    method: "PATCH",
    data: {
      ...params,
    },
  });
}

export async function createUser(params: UserListItem) {
  return request<UserListItem>("/api/admin/user/create", {
    method: "POST",
    data: {
      ...params,
    },
  });
}

export async function removeUser(params?: { ids: string[] }) {
  return request<Record<string, any>>("/api/admin/user/remove", {
    method: "DELETE",
    data: {
      ...params,
    },
  });
}
