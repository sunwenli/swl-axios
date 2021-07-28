import { Canceler, CancelExector, CancelTokenSource } from "../types"
import Cancel from './Cancel'

interface ResovlePromise {
    (reason: Cancel): void
}

export default class CancelToken {
    promise: Promise<Cancel>
    reason?: Cancel
    constructor(exector: CancelExector) {

        let resolvePromise: ResovlePromise
        // pendding 状态的 promise
        this.promise = new Promise<Cancel>(resolve => {
            resolvePromise = resolve
        })

        exector(message => {
            // 多次调用直接返回，只在第一次调用时赋值
            if (this.reason) {
                return
            }
            this.reason = new Cancel(message)
            resolvePromise(this.reason)
        })
    }

    static source(): CancelTokenSource {

        let cancel!: Canceler
        const token = new CancelToken(c => cancel = c)

        return {
            token,
            cancel,
        }
    }

    throwIfRequested(): void {
        if (this.reason) {
            throw this.reason
        }
    }
}