export type Method = 'get' | 'GET'
    | 'delete' | 'Delete'
    | 'head' | 'HEAD'
    | 'options' | 'OPTIONS'
    | 'post' | 'POST'
    | 'put' | 'PUT'
    | 'patch' | 'PATCH'

export interface AxiosRequestConfig {
    url?: string
    method?: Method
    data?: any
    params?: any
    headers?: any
    responseType?: XMLHttpRequestResponseType
    timeout?: number

    // 字符串索引签名
    [propName: string]: any
}

export interface AxiosResponse<T = any> {
    data: T
    status: number
    statusText: string
    headers: any
    config: AxiosRequestConfig
    request: any
}

export interface AxiosPromise<T = any> extends Promise<AxiosResponse<T>> {

}

export interface AxiosError extends Error {
    isAxiosError: boolean
    code?: string | null
    config?: AxiosRequestConfig
    request?: any
    response?: any
}

export interface Axios {
    interceptors: {
        request: AxiosInterceptorManager<AxiosRequestConfig>
        response: AxiosInterceptorManager<AxiosResponse>
    }
    request<T = any>(config: AxiosRequestConfig): AxiosResponse<T>

    get<T = any>(url: string, config?: AxiosRequestConfig): AxiosResponse<T>
    delete<T = any>(url: string, config?: AxiosRequestConfig): AxiosResponse<T>
    head<T = any>(url: string, config?: AxiosRequestConfig): AxiosResponse<T>
    options<T = any>(url: string, config?: AxiosRequestConfig): AxiosResponse<T>

    post<T = any>(url: string, data?: any, config?: AxiosRequestConfig): AxiosResponse<T>
    put<T = any>(url: string, data?: any, config?: AxiosRequestConfig): AxiosResponse<T>
    patch<T = any>(url: string, data?: any, config?: AxiosRequestConfig): AxiosResponse<T>
}

export interface AxiosInstance extends Axios {
    <T = any>(config: AxiosRequestConfig): AxiosPromise<T>
    <T = any>(url: string, config?: AxiosRequestConfig): AxiosPromise<T>
}

export interface AxiosInterceptorManager<T> {
    use(resolved: ResovedFn<T>, rejected?: RejectedFn): number
    eject(id: number): void
}

export interface ResovedFn<T> {
    (val: T): T | Promise<T>
}

export interface RejectedFn {
    (error: any): any
}
