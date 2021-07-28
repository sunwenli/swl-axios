
import { Method } from '../types'
import { deepMerge, isPlainObject } from './util'

function normalizeHeaderName(headers: any, normalizedName: string): void {
    if (!headers) {
        return
    }
    Object.keys(headers).forEach(name => {
        if (name !== normalizedName && name.toUpperCase() === normalizedName.toUpperCase()) {
            headers[normalizedName] = headers[name]
            delete headers[name]
        }
    })
}
export function processHeaders(headers: any, data: any): any {

    normalizeHeaderName(headers, 'Content-Type')
    if (isPlainObject(data)) {
        if (headers && !headers['Content-Type']) {
            headers['Content-Type'] = 'application/json;charset=utf-8'

        }
    }

    return headers

}

export function parseHeaders(headers: string): any {

    const parsed = Object.create(null)
    if (!headers) {
        return parsed
    }
    headers.split('\r\n').forEach(line => {
        let [key, val] = line.split(':')
        if (!key) {
            return
        }
        key = key.trim().toLowerCase()
        if (val) {
            val = val.trim()
        }
        parsed[key] = val
    })
    return parsed
}

export function flattenHeaders(headers: any, mehtod: Method) {

    if (!headers) {
        return headers
    }
    headers = deepMerge(headers.common || {}, headers[mehtod] || {}, headers)

    const methodsToDelete = ['delete', 'get', 'post', 'head', 'options', 'put', 'patch', 'common']

    methodsToDelete.forEach(key => {
        delete headers[key]
    })

    return headers

}