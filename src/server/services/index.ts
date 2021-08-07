import { Server } from 'socket.io'
import { DefaultEventsMap } from 'socket.io/dist/typed-events'
import AuthService from './auth.service'
import RoomService from './room.service'
import RPCService from './rpc.service'

interface InitOptions {
}
class ServiceCore {

    private isAsyncInited = false

    authService = new AuthService()
    rpcService = new RPCService()
    roomService = new RoomService()

    async asyncInit(opt?: InitOptions) {
        if (this.isAsyncInited) {
            return
        }
        await this.authService.init()
        await this.roomService.init()

        this.isAsyncInited = true
    }
}

const Service = new ServiceCore()

export default Service
