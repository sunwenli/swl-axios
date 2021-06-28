import { AxiosRequestConfig } from "../types";

function defalutStrat(val1: any, val2: any): any {
    return typeof val2 !== 'undefined' ? val2 : val1
}

function fromVal2Strat(val1: any, val2: any): any {
    if (typeof val2 !== 'undefined') {
        return val2
    }
}



const strats = Object.create(null)
const stratKeysFromVal2 = ['url', 'params', 'data']

stratKeysFromVal2.forEach(key => {
    strats[key] = fromVal2Strat
})

export function mergeConfig(config1: AxiosRequestConfig, config2?: AxiosRequestConfig): AxiosRequestConfig {

    if (!config2) {
        config2 = {}
    }

    const config = Object.create(null)

    for (let key in config2) {
        mergeField(key)
    }
    for (let key in config1) {
        if (!config2[key]) { // 没有在 config2 出现过
            mergeField(key)
        }
    }

    function mergeField(key: string): void {

        const strat = strats[key] || defalutStrat
        config[key] = strat(config1[key], config2![key]) // 中间嵌套函数，推导不出类型 

    }

    return config

}