import BaseResponse from "./base.response";

export class MessageResponse extends BaseResponse {
    type = 'message' as const

    status = 0

    timeStamp = new Date()

    setData (data: any) {
        this.data = data
    }

    static setData (data: any) {
        const instance = new MessageResponse()
        instance.setData(data)

        return instance
    }
}
