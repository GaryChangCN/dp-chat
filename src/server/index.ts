import { createServer } from 'http'
import { Server, Socket } from 'socket.io'
import config from '../config'
import authMiddleWare from './middlewares/auth.middleware'
import Service from './services/index'

async function main() {
    const httpServer = createServer()
    await Service.asyncInit()
    const io = new Server(httpServer, {})

    io.use(authMiddleWare)

    io.on('connection', (socket: Socket) => {
        // 挂载 sandbox
        Service.rpcService.start(socket, io)

        Service.rpcService.use('notify', `欢迎您：${socket.userInfo.nick}`)

        socket.on('disconnecting', () => {
            // socket.rooms.forEach(room => {
            //     socket.leave(room)
            // })
            console.log('>> 断开', socket.rooms)
        })

        socket.on('disconnect', () => {
            console.log('断开 Size', socket.rooms.size)
        })
    })

    httpServer.listen(config.port, () => {
        console.log(`==== App listen on ${config.port} ====`)
    })
}

main()
