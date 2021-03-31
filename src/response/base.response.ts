
export default abstract class BaseResponse {
    type: 'message' | 'other'
    status: number
    data?: any
    error?: {
        code: number
        message: string
    }
    timeStamp: Date
}
