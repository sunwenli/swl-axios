import { AxiosPromise, AxiosRequestConfig, AxiosResponse, RejectedFn, ResovedFn } from "../types";
import dispatchRequest from "./dispatchRequest";
import InterceptorManager from "./interceptorManager";

interface Interceptors {
    request: InterceptorManager<AxiosRequestConfig>
    response: InterceptorManager<AxiosResponse>
}


interface PromiseChain<T> {
    //  ResovedFn<T> | dispatchRequest
    resolved: ResovedFn<T> | ((config: AxiosRequestConfig) => AxiosPromise)
    rejected?: RejectedFn
}
export class Axios {

    interceptors: Interceptors
    constructor() {
        this.interceptors = {
            request: new InterceptorManager<AxiosRequestConfig>(),
            response: new InterceptorManager<AxiosResponse>()
        }
    }

    request(url?: any, config?: any): AxiosPromise {
        if (typeof url === 'string') {
            if (!config) {
                config = {}
            }
            config.url = url
        } else {
            config = url
        }

        const chain: PromiseChain<any>[] = [{
            resolved: dispatchRequest,
            rejected: undefined
        }]

        this.interceptors.request.forEach(interceptor => {
            chain.unshift(interceptor)
        })

        this.interceptors.response.forEach(interceptor => {
            chain.push(interceptor)
        })


        let promise = Promise.resolve(config)
        while (chain.length) {
            const { resolved, rejected } = chain.shift()!
            promise = promise.then(resolved, rejected)
        }
        return promise
        // return dispatchRequest(config)
    }

    get(url: string, config?: AxiosRequestConfig): AxiosPromise {
        return this._requestWithoutData(url, 'get', config)
    }

    delete(url: string, config?: AxiosRequestConfig): AxiosPromise {
        return this._requestWithoutData(url, 'delete', config)
    }

    head(url: string, config?: AxiosRequestConfig): AxiosPromise {
        return this._requestWithoutData(url, 'head', config)
    }

    options(url: string, config?: AxiosRequestConfig): AxiosPromise {
        return this._requestWithoutData(url, 'options', config)
    }

    post(url: string, data?: any, config?: AxiosRequestConfig): AxiosPromise {
        return this._requestWithData(url, 'post', data, config)
    }

    put(url: string, data?: any, config?: AxiosRequestConfig): AxiosPromise {
        return this._requestWithData(url, 'put', data, config)
    }

    patch(url: string, data?: any, config?: AxiosRequestConfig): AxiosPromise {
        return this._requestWithData(url, 'patch', data, config)
    }

    _requestWithData(url: string, method: string, data?: any, config?: AxiosRequestConfig): AxiosPromise {
        return this.request(Object.assign(config || {}, {
            method,
            data,
            url
        }))
    }

    _requestWithoutData(url: string, method: string, config?: AxiosRequestConfig): AxiosPromise {
        return this.request(Object.assign(config || {}, {
            method,
            url
        }))
    }
}