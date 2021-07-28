import { AxiosRequestConfig, AxiosPromise, AxiosResponse } from '../types'
import xhr from './xhr'
import { buildURL } from '../helpers/url'
// import { transformRequest, transformResponse } from '../helpers/data'
import { flattenHeaders, processHeaders } from '../helpers/headers'
import transform from './transform'
import { combineURL, isAbsoluteURL } from '../helpers/util'

export default function dispatchRequest(config: AxiosRequestConfig): AxiosPromise {
    throwIfCancellationRequested(config)
    processConfig(config)

    return xhr(config).then(res => {
        return transformResponseData(res)
    })
}

function throwIfCancellationRequested(config: AxiosRequestConfig): void {

    if (config.cancelToken) {
        config.cancelToken.throwIfRequested()
    }
}

function processConfig(config: AxiosRequestConfig): void {
    config.url = transformURL(config)
    // config.headers = transformHeaders(config)
    config.data = tarnsformRequestData(config)
    config.headers = flattenHeaders(config.headers, config.method!)
}

export function transformURL(config: AxiosRequestConfig): string {
    let { url, params, paramSerializer, baseURL } = config
    if (baseURL && !isAbsoluteURL(url!)) {
        url = combineURL(baseURL, url)
    }
    return buildURL(url!, params, paramSerializer)
}

function tarnsformRequestData(config: AxiosRequestConfig): any {
    const { data, headers, transformRequest } = config
    return transform(data, headers, transformRequest)
}

function transformResponseData(res: AxiosResponse): AxiosResponse {
    res.data = transform(res.data, res.headers, res.config.transformResponse)
    return res
}
