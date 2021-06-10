import { AxiosRequestConfig } from './types'
import xhr from './xhr'
import { buildURL } from './helpers/url'
import { transformRequest } from './helpers/data'
function axios(config: AxiosRequestConfig): void {
    processConfig(config)

    xhr(config)
}


function processConfig(config: AxiosRequestConfig): void {
    config.url = transformURL(config)
    config.data = tarnsformRequestData(config)
}

function transformURL(config: AxiosRequestConfig): string {
    const { url, params } = config
    return buildURL(url, params)
}

function tarnsformRequestData(config: AxiosRequestConfig): any {
    const { data } = config
    return transformRequest(data)
}

export default axios