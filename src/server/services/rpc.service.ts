import { Server, Socket } from 'socket.io'
import RequestTransfer from '../../transfer/request.transfer'
import ResponseTransfer from '../../transfer/response.transfer'
import Sandbox from '../sandbox'

export default class RPCService {
    private socket: Socket
    private sandbox: Sandbox

    mountSocket (socket: Socket) {
        this.socket = socket
        this.sandbox = new Sandbox(socket)
        this.listen()
    }

    listen () {
        this.socket.on('request', async (transfer: RequestTransfer) => {
            const sandbox = this.sandbox
            const response = ResponseTransfer.builder(transfer.data.uuid)
            if (!Reflect.has(sandbox, transfer.data.functionName)) {
                response.setError(402, '没有此函数')
                return this.socket.emit('response', response)
            }
            try {
                const result = await Reflect.apply(
                    Reflect.get(sandbox, transfer.data.functionName),
                    sandbox,
                    transfer.data.args || [],
                )
                response.setData(result)
                this.socket.emit('response', response)
            } catch (error) {
                response.setError(500, error.message)
                this.socket.emit('response', response)
            }
        })
    }
}
