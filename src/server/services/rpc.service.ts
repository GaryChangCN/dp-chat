import { Server, Socket } from 'socket.io'
import { DefaultEventsMap } from 'socket.io/dist/typed-events'
import RequestTransfer from '../../transfer/request.transfer'
import ResponseTransfer from '../../transfer/response.transfer'
import type Sandbox from '../sandbox'

export default class RPCService {
    private socket: Socket
    private io: Server<DefaultEventsMap, DefaultEventsMap>
    // TODO: 超时自定
    private pubs = new Map<string, (ret: ResponseTransfer) => void>()

    constructor(socket: Socket, io: Server<DefaultEventsMap, DefaultEventsMap>, private readonly sandbox: Sandbox) {
        this.start(socket, io)
    }

    private start(socket: Socket, io: Server<DefaultEventsMap, DefaultEventsMap>) {
        this.socket = socket
        this.io = io

        this.requestListener()
        this.responseListener()

        this.use('notify', `欢迎您：${socket.userInfo.nick}`)
    }

    private requestListener() {
        this.socket.on('request', async (transfer: RequestTransfer) => {
            const sandbox = this.sandbox
            const response = ResponseTransfer.builder(transfer.data.uuid)
            if (!Reflect.has(sandbox, transfer.data.functionName)) {
                response.setError(402, '没有此函数' + transfer.data.functionName)
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
                console.log('>>>', error)
                response.setError(500, error.message)
                this.socket.emit('response', response)
            }
        })
    }

    private responseListener() {
        this.socket.on('response', (transfer: ResponseTransfer) => {
            const cb = this.pubs.get(transfer.uuid)
            if (!cb) {
                return
            }
            cb(transfer)
            this.pubs.delete(transfer.uuid)
        })
    }

    private core(funcName: string, args: any[], callback: (ret: ResponseTransfer) => void, roomId?: string) {
        const requestTransfer = new RequestTransfer(funcName, args)
        if (roomId) {
            this.io.to(roomId).emit('request', requestTransfer)
        } else {
            this.socket.emit('request', requestTransfer)
        }
        this.pubs.set(requestTransfer.data.uuid, callback)
    }

    async use<T>(clientFuncName: string, ...args: any[]): Promise<T> {
        const result = await new Promise<T>((resolve, reject) => {
            this.core(clientFuncName, args || [], (ret: ResponseTransfer) => {
                if (ret.status === 0) {
                    resolve(ret.data)
                } else {
                    reject(new Error(`错误码${ret.error?.code} ${ret.error?.message}`))
                }
            })
        })
        return result
    }

    async useInRoom<T>(roomId: string, clientFuncName: string, ...args: any[]): Promise<T> {
        const result = await new Promise<T>((resolve, reject) => {
            this.core(
                clientFuncName,
                args || [],
                (ret: ResponseTransfer) => {
                    if (ret.status === 0) {
                        resolve(ret.data)
                    } else {
                        reject(new Error(`错误码${ret.error?.code} ${ret.error?.message}`))
                    }
                },
                roomId,
            )
        })
        return result
    }

    dispose() {
        this.pubs.clear()
    }
}
