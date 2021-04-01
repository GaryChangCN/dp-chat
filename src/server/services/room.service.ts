import fs from 'fs-extra'
import os from 'os'
import path from 'path'
import { Server, Socket } from 'socket.io'
import { DefaultEventsMap } from 'socket.io/dist/typed-events'
import { RoomEntity, UserEntity } from '../typings/model'
import { rpc } from './rpc.service'

export default class RoomService {
    private roomDirPath = path.resolve(__dirname, '../../../datas/rooms')
    private roomConfigPath = path.join(this.roomDirPath, 'room.config.json')

    async init() {
        await fs.ensureFile(this.roomConfigPath)
        await this.setDefaultRoomConfig()
    }


    private async setDefaultRoomConfig() {
        const list = await this.listRooms()
        if (list.length === 0) {
            list.push({
                id: 'default',
                desc: '默认房间',
            })
        }
        fs.writeFile(this.roomConfigPath, JSON.stringify(list, null, 4))
    }

    async listRooms() {
        const buf = await fs.readFile(this.roomConfigPath)
        const data = buf.toString()

        if (!data) {
            return [] as RoomEntity[]
        }

        return JSON.parse(data) as RoomEntity[]
    }

    async emitMessageInRoom(roomId: string, message: string) {
        await rpc.useInRoom(roomId, `printRoomMessage`, message)
    }
}
