import { Server } from 'socket.io'
import { DefaultEventsMap } from 'socket.io/dist/typed-events'
import AuthService from './auth.service'
import RoomService from './room.service'
import RPCService from './rpc.service'

interface InitOptions {
}

export class ServiceCore {

    authService = new AuthService()
    rpcService = new RPCService()
    roomService = new RoomService()

    async init(opt: InitOptions) {
        await this.authService.init()
        await this.roomService.init()
    }

    static instance = new ServiceCore()
    // 对外调用 全部初始化
    static async init(opt: InitOptions) {
        await ServiceCore.instance.init(opt)
        return ServiceCore.instance
    }
}

const Service = ServiceCore.instance

export default Service
