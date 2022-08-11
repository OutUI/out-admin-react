declare namespace API {
  export interface Response<T> {
    success: boolean; // if request is success
    data: T; // response data
    code?: number; // code for errorType
    message?: string; // message display to user
    showType?: number; // error display type： 0 silent; 1 message.warn; 2 message.error; 4 notification; 9 page
    traceId?: string; // Convenient for back-end Troubleshooting: unique request ID
    host?: string; // onvenient for backend Troubleshooting: host of current access server
  }

  export interface PagingData<T> {
    current: number;
    pageSize: number;
    total: number;
    list: T[];
  }
}
