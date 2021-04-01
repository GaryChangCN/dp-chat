import { Socket } from 'socket.io-client/build/socket'

export default class Sandbox {
    private socket: Socket
    constructor(socket: Socket) {
        this.socket = socket
    }

    hello (a, b) {
        return a + b
    }

    printRoomMessage (message: string) {
        console.log('[新消息]', message)
    }
}