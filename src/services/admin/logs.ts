import { request } from "umi";
import type { LogListItem, LogListParams } from "@/services/admin/logs.d";

export async function queryLogs(params: LogListParams) {
  return request<API.Response<API.PagingData<LogListItem>>>(
    "/api/admin/log/query",
    {
      method: "GET",
      params: {
        ...params,
      },
    }
  );
}

export async function removeLogs(options: { ids: string[] }) {
  return request("/api/admin/log/remove", {
    method: "DELETE",
    data: {
      ...(options || {}),
    },
  });
}
