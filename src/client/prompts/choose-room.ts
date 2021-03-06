import * as inquirer from 'inquirer'
import { rpc } from '../services/rpc'
import { RoomEntity } from '../../server/typings/model'

export default async function promptChooseRoom() {
    const list = await rpc.use<RoomEntity[]>('listRooms')
    
    const ret = await inquirer.prompt([{
        type: 'list',
        name: 'selectRoomId',
        message: '请选择要进入的房间',
        choices: list.map(room => {
            return {
                name: room.desc,
                value: room.id
            }
        })
    }])

    const selectRoomId = ret.selectRoomId

    return selectRoomId
}
