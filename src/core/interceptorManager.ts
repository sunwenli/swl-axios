
import { ResovedFn, RejectedFn } from '../types'

interface Interceptor<T> {
    resolved: ResovedFn<T>
    rejected?: RejectedFn
}

export default class InterceptorManager<T> {

    private interceptors: Array<Interceptor<T> | null>
    constructor() {
        this.interceptors = []
    }

    use(resolved: ResovedFn<T>, rejected?: RejectedFn): number {
        this.interceptors.push({
            resolved,
            rejected
        })
        return this.interceptors.length - 1
    }

    forEach(fn: (interceptor: Interceptor<T>) => void): void {
        this.interceptors.forEach(interceptor => {
            if (interceptor !== null) {
                fn(interceptor)
            }
        })
    }

    eject(id: number): void {
        //  不能这样删，会导致 interceptors 长度改变，里面的值的顺序就会乱了
        // this.interceptors.splice(id, 1)

        // 把对应的值置为null
        if (this.interceptors[id]) {
            this.interceptors[id] = null
        }
    }
}