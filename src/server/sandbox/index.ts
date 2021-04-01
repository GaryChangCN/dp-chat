import { Socket } from 'socket.io'
import Service from '../services'
import { RoomEntity } from '../typings/model'

export default class Sandbox {
    private socket: Socket
    constructor(socket: Socket) {
        this.socket = socket
    }

    hello (a, b) {
        return a + b
    }

    async listRooms () {
        const list = await Service.roomService.listRooms()

        return list
    }

    joinRoom (roomId: string) {
        this.socket.join(roomId)
        return 'ok'
    }
}