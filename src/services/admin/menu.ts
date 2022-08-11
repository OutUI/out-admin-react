import { request } from "umi";
import type { MenuListItem, MenuListParams } from "./menu.d";

export async function queryMenu(params: MenuListParams) {
  return request<API.Response<API.PagingData<MenuListItem>>>(
    "/api/admin/menu/query",
    {
      method: "GET",
      params: {
        ...params,
      },
    }
  );
}

export async function showMenu(params?: { id: string }) {
  return request<API.Response<MenuListItem>>("/api/admin/menu/show", {
    params,
  });
}

export async function updateMenu(params: MenuListItem) {
  return request<MenuListItem>("/api/admin/menu/update", {
    method: "PATCH",
    data: {
      ...params,
    },
  });
}

export async function createMenu(params: MenuListItem) {
  return request<MenuListItem>("/api/admin/menu/create", {
    method: "POST",
    data: {
      ...params,
    },
  });
}

export async function removeMenu(params?: { ids: string[] }) {
  return request<Record<string, any>>("/api/admin/menu/remove", {
    method: "DELETE",
    data: {
      ...params,
    },
  });
}

export async function orderMenu(params: {
  orders: { id: string; parentId: string }[];
}) {
  return request<API.Response<MenuListItem>>("/api/admin/menu/order", {
    method: "PATCH",
    data: {
      ...params,
    },
  });
}
