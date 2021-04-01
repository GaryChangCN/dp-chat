import * as inquirer from 'inquirer'
import { rpc } from '../services/rpc'

export default async function promptJoinRoomAndChat(roomId: string) {
    await rpc.use<string>('joinRoom', roomId)
    console.log(`进入成功`)
    
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
