import { Socket } from 'socket.io-client/build/socket'
import { MessageRawContent } from '../../typings/common'
import { format } from '../utils/utils'

export default class Sandbox {
    private socket: Socket
    constructor(socket: Socket) {
        this.socket = socket
    }

    hello (a, b) {
        return a + b
    }

    notify(message: string) {
        console.log(`[新提示]`, message)
    }

    /** 接受当前房间输出的消息 */
    echoMessageInRoom (messageRaw: MessageRawContent) {
        const echo = `${format(new Date(messageRaw.timestamp))} [${messageRaw.sender}] --------------
    ${messageRaw.message}
------------`
        console.log(echo)
    }
}