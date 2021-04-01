import { Socket } from 'socket.io-client'
import { DefaultEventsMap } from 'socket.io-client/build/typed-events'
import RequestTransfer from '../../transfer/request.transfer'
import ResponseTransfer from '../../transfer/response.transfer'

export let rpc: RPC

export default class RPC {
    private socket: Socket<DefaultEventsMap, DefaultEventsMap>

    // TODO: 超时自定
    private pubs = new Map<string, (ret: ResponseTransfer) => void>()
    private isStart = false

    constructor(socket: Socket<DefaultEventsMap, DefaultEventsMap>) {
        if (rpc) {
            return rpc
        }
        this.socket = socket
        rpc = this
    }

    start () {
        if (this.isStart) {
            return
        }
        this.isStart = true
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
                console.log(ret)
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
