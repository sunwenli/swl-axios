import { AxiosRequestConfig } from "../types"

export class AxiosError extends Error {
    isAxiosError: boolean
    code?: string | null
    config?: AxiosRequestConfig
    request?: any
    response?: any

    constructor(
        message: string,
        code?: string | null,
        config?: AxiosRequestConfig,
        request?: any,
        response?: any
    ) {
        super(message)
        this.isAxiosError = true
        this.message = message
        this.code = code
        this.config = config
        this.request = request
        this.response = response

        // resolve ts breaking change
        Object.setPrototypeOf(this, AxiosError)
    }

}

export function createAxiosError(
    message: string,
    code?: string | null,
    config?: AxiosRequestConfig,
    request?: any,
    response?: any
) {
    return new AxiosError(message, code, config, request, response)
}