
export default class BaseTransfer {
    type: 'request' | 'response'
    /** 正常是 0， 其余为异常 */
    status = 0
    data?: any
    error?: {
        code: number
        message: string
    }
    timeStamp: Date
}
