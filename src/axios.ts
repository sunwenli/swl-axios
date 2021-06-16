import { Axios } from "./core/Axios"
import { AxiosInstance } from "./types"
import { extend } from "./helpers/util"

function createInstance(): AxiosInstance {
    const context = new Axios()
    // request 内部会访问 this, 所以这里要绑定 context, 这样就绑定了一个 Axios 实例
    const instance = Axios.prototype.request.bind(context)
    extend(instance, context)
    return instance as AxiosInstance
}

const axios = createInstance()

export default axios