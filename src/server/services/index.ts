import { Server, Socket } from 'socket.io'
import { DefaultEventsMap } from 'socket.io/dist/typed-events'
import Sandbox from '../sandbox'
import AuthService from './auth.service'
import RoomService from './room.service'
import RPCService from './rpc.service'

interface InitOptions {
}
class ServiceCore {

    private isAsyncInited = false

    authService = new AuthService()
    roomService = new RoomService()

    async asyncInit(opt?: InitOptions) {
        if (this.isAsyncInited) {
            return
        }
        await this.authService.init()
        await this.roomService.init()

        this.isAsyncInited = true
    }

    initRPC(socket: Socket, io: Server<DefaultEventsMap, DefaultEventsMap>) {
        const sandBox = new Sandbox(socket)
        const rpc = new RPCService(socket, io, sandBox)
        sandBox.setRPC(rpc)
    }
}

const Service = new ServiceCore()

export default Service
