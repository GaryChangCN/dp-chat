import { Socket } from 'socket.io-client'
import { DefaultEventsMap } from 'socket.io-client/build/typed-events'
import RequestTransfer from '../../transfer/request.transfer'
import ResponseTransfer from '../../transfer/response.transfer'
import Sandbox from '../sandbox'

export let rpc: RPCService

export default class RPCService {
    private socket: Socket<DefaultEventsMap, DefaultEventsMap>
    private sandbox: Sandbox

    // TODO: 超时自定
    private pubs = new Map<string, (ret: ResponseTransfer) => void>()
    
    start (socket: Socket<DefaultEventsMap, DefaultEventsMap>) {
        if (rpc) {
            return rpc
        } else {
            rpc = this
        }
        this.socket = socket
        this.sandbox = new Sandbox(socket)

        this.requestListener()
        this.responseListener()
    }

    private requestListener () {
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

    private responseListener () {
        this.socket.on('response', (transfer: ResponseTransfer) => {
            const cb = this.pubs.get(transfer.uuid)
            if (!cb) {
                return
            }
            cb(transfer)
            this.pubs.delete(transfer.uuid)
        })
    }

    private core(funcName: string, args: any[], callback: (ret: ResponseTransfer) => void) {
        const requestTransfer = new RequestTransfer(funcName, args)
        this.socket.emit('request', requestTransfer)
        this.pubs.set(requestTransfer.data.uuid, callback)
    }

    async use<T> (funcName: string, ...args: any[]): Promise<T> {
        const result = await new Promise<T>((resolve, reject) => {
            this.core(funcName, args || [], (ret: ResponseTransfer) => {
                if (ret.status === 0) {
                    resolve(ret.data)
                } else {
                    reject(new Error(`错误码${ret.error?.code} ${ret.error?.message}`))
                }
            })
        })
        return result
    }

    dispose () {
        this.pubs.clear()
    }
}
