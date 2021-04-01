import uuid from '../lib/uuid'
import BaseTransfer from './base.transfer'

export default class ResponseTransfer extends BaseTransfer {
    type = 'response' as const

    data: any

    uuid: string

    constructor(uuid: string, returnData: any) {
        super()
        this.data = returnData
        this.uuid = uuid
    }

    setData(data: any) {
        this.data = data
        return this
    }

    setError(errorCode: number, errorMessage?: string) {
        this.status = 1
        this.error = {
            code: errorCode,
            message: errorMessage,
        }
        return this
    }

    static builder (uuid: string, returnData?: any) {
        const instance = new ResponseTransfer(uuid, returnData)
        return instance
    }
}
