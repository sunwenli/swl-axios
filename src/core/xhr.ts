import { AxiosRequestConfig, AxiosPromise, AxiosResponse } from '../types'
import { parseHeaders } from '../helpers/headers'
import { createAxiosError } from '../helpers/error'
import { isURLSameOrigin } from '../helpers/url'
import cookie from '../helpers/cookie'
import { isFormData } from '../helpers/util'
export default function xhr(config: AxiosRequestConfig): AxiosPromise {

    return new Promise((resolve, reject) => {
        const {
            data = null,
            url,
            method = 'get',
            headers = {},
            responseType,
            timeout,
            cancelToken,
            withCredentials,
            xsrfHeaderName,
            xsrfCookieName,
            onDownloadProgress,
            onUploadProgress,
            auth,
            validateStatus
        } = config

        const request = new XMLHttpRequest()
        // console.log('UNSENT', request.readyState); // readyState 为 0 , xhr 代理已被创建，但尚未调用 open() 方法
        request.open(method.toUpperCase(), url!, true)
        // console.log('OPENED', request.readyState); // readyState 为 1 ，open()方法已出发，可以设置请求头（setRequestHeader），也可以发起请求(send)

        configureRequest()
        addEvents()
        processHeaders()
        processCancel()

        request.send(data)
        // request.readyState 为 2 ，send方法已调用，请求头也已被接收


        function configureRequest(): void {
            if (responseType) {
                request.responseType = responseType
            }
            if (timeout) {
                request.timeout = timeout
            }

            if (withCredentials) {
                request.withCredentials = withCredentials
            }

        }

        function addEvents(): void {

            // request.onprogress = function handleProgress() {
            //     console.log('LOADING', request.readyState); // readyState 为 3，响应体部分正在被接收，如果 responseType 设置为 text 或空字符串，responseText 将在载入的过程中拥有部分响应数据 
            // };
            // request.onload = function () {
            //     console.log('DONE', request.readyState); // readyState 为 4，请求已完成，数据传输成功或失败
            // };
            request.onerror = function handleError() {
                reject(createAxiosError(`Network Error`, config, null, request))
            }

            request.ontimeout = function handleTimeout() {
                reject(createAxiosError(`timeout ${timeout} ms`, config, 'ECONNABORTED', request))
            }

            if (onUploadProgress) {
                request.upload.onprogress = onUploadProgress
            }
            if (onDownloadProgress) {
                request.onprogress = onDownloadProgress
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
        }

        function processHeaders(): void {
            if (isFormData(data)) {
                delete headers['Content-Type']
            }

            if ((withCredentials || isURLSameOrigin(url!)) && xsrfCookieName) {
                const xsrfValue = cookie.read(xsrfCookieName)
                if (xsrfValue) {
                    headers[xsrfHeaderName!] = xsrfValue
                }
            }

            if (auth) {
                headers['Authorization'] = 'Basic ' + window.btoa(auth.username + ':' + auth.password)
            }

            Object.keys(headers).forEach(name => {
                if (data === null && name.toLowerCase() === 'content-type') {
                    delete headers[name]
                } else {
                    request.setRequestHeader(name, headers[name])
                }

            })
        }

        function processCancel(): void {
            if (cancelToken) {
                // tslint:disable-next-line: no-floating-promises
                cancelToken.promise.then(reason => {
                    request.abort()
                    reject(reason)
                }).catch(
                    /* istanbul ignore next */
                    () => {
                        // do nothing
                    }
                )
            }

        }

        function handleResponse(res: AxiosResponse): void {
            if (!validateStatus || validateStatus(res.status)) {
                resolve(res)
            } else {
                reject(createAxiosError(`Request failed with status ${res.status}`, config, null, request, res))
            }
        }
    })
}