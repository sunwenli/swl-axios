import { AxiosRequestConfig, AxiosResponse } from "../types"

export class AxiosError extends Error {
    isAxiosError: boolean
    code?: string | null
    config: AxiosRequestConfig
    request?: any
    response?: AxiosResponse

    /* istanbul ignore next */
    constructor(
        message: string,
        config: AxiosRequestConfig,
        code?: string | null,
        request?: any,
        response?: AxiosResponse
    ) {
        super(message)
        this.isAxiosError = true
        this.code = code
        this.config = config
        this.request = request
        this.response = response

        // resolve ts breaking change
        Object.setPrototypeOf(this, AxiosError.prototype)
    }

}

export function createAxiosError(
    message: string,
    config: AxiosRequestConfig,
    code?: string | null,
    request?: any,
    response?: AxiosResponse
): AxiosError {
    return new AxiosError(message, config, code, request, response)
}