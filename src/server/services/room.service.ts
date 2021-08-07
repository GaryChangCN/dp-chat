import fs from 'fs-extra'
import os from 'os'
import path from 'path'
import { RoomEntity, UserEntity } from '../typings/model'

export default class RoomService {
    private roomDirPath = path.resolve(__dirname, '../../../datas/rooms')
    private roomConfigPath = path.join(this.roomDirPath, 'room.config.json')

    constructor(){}

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
}
