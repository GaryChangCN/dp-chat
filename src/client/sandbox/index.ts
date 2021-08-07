import { Socket } from 'socket.io-client/build/socket'

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

    printRoomMessage (message: string) {
        console.log('[新消息]', message)
    }
}