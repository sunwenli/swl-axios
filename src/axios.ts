import { Axios } from "./core/Axios"
import { AxiosStatic, AxiosRequestConfig } from "./types"
import { extend } from "./helpers/util"
import defaults from "./defaults"
import { mergeConfig } from "./core/mergeConfig"
import CancelToken from "./cancel/CancelToken"
import Cancel, { isCancel } from "./cancel/Cancel"
import { AxiosError } from "./helpers/error"

function createInstance(config: AxiosRequestConfig): AxiosStatic {
    const context = new Axios(config)
    // request 内部会访问 this, 所以这里要绑定 context, 这样就绑定了一个 Axios 实例
    const instance = Axios.prototype.request.bind(context)
    extend(instance, context)
    return instance as AxiosStatic
}

const axios = createInstance(defaults)

axios.create = function (config) {
    return createInstance(mergeConfig(this.defaults, config))
}

axios.CancelToken = CancelToken
axios.Cancel = Cancel
axios.isCancel = isCancel

axios.all = function all(promises) {
    return Promise.all(promises)
}
axios.spread = function spread(callback) {
    return function wrap(arr) {
        return callback.apply(null, arr)
    }
}

axios.Axios = Axios

export default axios