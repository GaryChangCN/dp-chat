import { Socket } from 'socket.io'
import Service from '../services'

export default class Sandbox {
    private socket: Socket
    constructor(socket: Socket) {
        this.socket = socket
    }

    async listRooms () {
        const list = await Service.roomService.listRooms()

        return list
    }

    async getRoomInfo (roomId: string) {
        const list = await this.listRooms()
        const info = list.find(o => o.id === roomId)
        return info
    }

    async joinRoom (roomId: string) {
        const roomInfo = await this.getRoomInfo(roomId)
        if (!roomInfo) {
            throw new Error("找不到该房间")
        }
        this.socket.join(roomId)
        return roomInfo
    }

    async sendMessageInRoom (roomId: string, message: string) {
        await Service.roomService.emitMessageInRoom(roomId, message)
    }
}