import uuid from '../lib/uuid'
import BaseTransfer from './base.transfer'

export default class RequestTransfer extends BaseTransfer {
    type = 'request' as const

    data: {
        functionName: string
        args: any[]
        uuid: string
    }

    constructor(functionName: string, args: any[]) {
        super()
        this.data = {
            functionName,
            args,
            uuid: uuid(),
        }
    }

    static builder (functionName: string, args: any[]) {
        const instance = new RequestTransfer(functionName, args)
        return instance
    }
}
