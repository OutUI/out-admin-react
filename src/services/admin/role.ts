import { request } from "umi";
import type { RoleListItem, RoleListParams } from "./role.d";

export async function queryRole(params: RoleListParams) {
  return request<API.Response<API.PagingData<RoleListItem>>>(
    "/api/admin/role/query",
    {
      method: "GET",
      params: {
        ...params,
      },
    }
  );
}

export async function showRole(params?: { id: string }) {
  return request<API.Response<RoleListItem>>("/api/admin/role/show", {
    params,
  });
}

export async function updateRole(params: RoleListItem) {
  return request<RoleListItem>("/api/admin/role/update", {
    method: "PATCH",
    data: {
      ...params,
    },
  });
}

export async function createRole(params: RoleListItem) {
  return request<RoleListItem>("/api/admin/role/create", {
    method: "POST",
    data: {
      ...params,
    },
  });
}

export async function removeRole(params?: { ids: string[] }) {
  return request<Record<string, any>>("/api/admin/role/remove", {
    method: "DELETE",
    data: {
      ...params,
    },
  });
}
