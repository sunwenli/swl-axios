import { AxiosRequestConfig, AxiosPromise, AxiosResponse } from './types'
import { parseHeaders } from './helpers/headers'
export default function xhr(config: AxiosRequestConfig): AxiosPromise {

    return new Promise((resolve, reject) => {
        const { data = null, url, method = 'get', headers, responseType, timeout } = config

        const request = new XMLHttpRequest()
        // console.log('UNSENT', request.readyState); // readyState 为 0 , xhr 代理已被创建，但尚未调用 open() 方法

        if (responseType) {
            request.responseType = responseType
        }
        if (timeout) {
            request.timeout = timeout
        }

        request.open(method.toUpperCase(), url, true)
        // console.log('OPENED', request.readyState); // readyState 为 1 ，open()方法已出发，可以设置请求头（setRequestHeader），也可以发起请求(send)

        // request.onprogress = function handleProgress() {
        //     console.log('LOADING', request.readyState); // readyState 为 3，响应体部分正在被接收，如果 responseType 设置为 text 或空字符串，responseText 将在载入的过程中拥有部分响应数据 
        // };
        // request.onload = function () {
        //     console.log('DONE', request.readyState); // readyState 为 4，请求已完成，数据传输成功或失败
        // };

        request.onerror = function handleError() {
            reject(new Error(`Network Error`))
        }

        request.ontimeout = function handleTimeout() {
            reject(`timeout ${timeout} ms`)
        }

        request.onreadystatechange = function handlLoad() {
            if (request.readyState !== 4) {
                return
            }
            if (request.status === 0) {
                return
            }

            const responseHeaders = request.getAllResponseHeaders()
            const responseData = responseType !== 'text' ? request.response : request.responseText

            const response: AxiosResponse = {
                data: responseData,
                status: request.status,
                statusText: request.statusText,
                headers: parseHeaders(responseHeaders),
                config,
                request
            }

            handleResponse(response)
        }
        Object.keys(headers).forEach(name => {
            if (data === null && name.toLowerCase() === 'content-type') {
                delete headers[name]
            } else {
                request.setRequestHeader(name, headers[name])
            }

        })

        request.send(data)
        // request.readyState 为 2 ，send方法已调用，请求头也已被接收

        function handleResponse(res: AxiosResponse): void {
            if (res.status >= 200 && res.status < 300) {
                resolve(res)
            } else {
                reject(new Error(`Request failed with status ${res.status}`))
            }
        }
    })
}