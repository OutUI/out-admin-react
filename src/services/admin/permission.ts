import { request } from "umi";
import type { PermListItem, PermListParams } from "./permission.d";

export async function queryPermission(params: PermListParams) {
  return request<API.Response<API.PagingData<PermListItem>>>(
    "/api/admin/permission/query",
    {
      method: "GET",
      params: {
        ...params,
      },
    }
  );
}

export async function showPermission(params?: { id: string }) {
  return request<API.Response<PermListItem>>("/api/admin/permission/show", {
    params,
  });
}

export async function updatePermission(params: PermListItem) {
  return request<PermListItem>("/api/admin/permission/update", {
    method: "PATCH",
    data: {
      ...params,
    },
  });
}

export async function createPermission(params: PermListItem) {
  return request<PermListItem>("/api/admin/permission/create", {
    method: "POST",
    data: {
      ...params,
    },
  });
}

export async function removePermission(params?: { ids: string[] }) {
  return request<Record<string, any>>("/api/admin/permission/remove", {
    method: "DELETE",
    data: {
      ...params,
    },
  });
}
