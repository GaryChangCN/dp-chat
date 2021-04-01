import { io, Socket } from 'socket.io-client'
import { DefaultEventsMap } from 'socket.io-client/build/typed-events'
import RPCService from './rpc'

const RETRY_LIMIT = 10

export default async function initConnection(host: string, token: string) {
    const ret = await new Promise<Socket<DefaultEventsMap, DefaultEventsMap>>((resolve, reject) => {
        let retry = 0
        const socket = io(`ws://${host}`, {
            auth: {
                token,
            },
        })
        const rpc = new RPCService()
        socket.on('connect', () => {
            console.info(`connect to server ${host}`, socket.id)
            rpc.start(socket)

            resolve(socket)
        })

        socket.on('disconnect', () => {
            // console.info('disconnect of server', socket.id)
        })

        socket.on('connect_error', err => {
            rpc.dispose()
            console.error('connect error of server', err.message)
            setTimeout(() => {
                if (retry === RETRY_LIMIT) {
                    reject(new Error('超出重试次数'))
                    return
                } else {
                    retry++
                    socket.connect()
                }
            }, 3000)
        })
    })

    return ret
}
