import * as inquirer from 'inquirer'
import { RoomEntity } from '../../server/typings/model'
import PromotWriteMessage from '../prompts/write-message'
import { rpc } from './rpc'

export default async function joinRoomAndChat(roomId: string) {
    const joinRet = await rpc.use<RoomEntity>('joinRoom', roomId)
    console.log(`进入房间：${joinRet.desc} 成功`)

    const sendMessage = async () => {
        const rawInput = await PromotWriteMessage()

        await rpc.use('sendMessage', roomId, rawInput)

        sendMessage()
    }

    sendMessage()
    
    // const ret = await inquirer.prompt([{
    //     type: 'list',
    //     name: 'selectRoomId',
    //     message: '请选择要进入的房间',
    //     choices: list.map(room => {
    //         return {
    //             name: room.desc,
    //             value: room.id
    //         }
    //     })
    // }])

    // const selectRoomId = ret.selectRoomId

    // return selectRoomId
}
