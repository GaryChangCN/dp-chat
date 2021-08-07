import { Socket } from 'socket.io'
import { MessageRawContent } from '../../typings/common'
import Service from '../services'
import type RPCService from '../services/rpc.service'

export default class Sandbox {
    private socket: Socket
    private rpcB: RPCService
    constructor(socket: Socket) {
        this.socket = socket
    }

    /** 设定 rpc 调用 */
    setRPC(rpc: RPCService) {
        this.rpcB = rpc
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

    async emitRomeMessage (roomId: string, message: string) {
        const messageRaw: MessageRawContent = {
            sender: this.socket.userInfo.nick,
            message: message,
            timestamp: Date.now()
        }
        await this.rpcB.useInRoom(roomId, `echoMessageInRoom`, messageRaw)
    }
}