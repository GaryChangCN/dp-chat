import { createServer } from 'http'
import { Server, Socket } from 'socket.io'
import config from '../config'
import authMiddleWare from './middlewares/auth.middleware'
import Service, { ServiceCore } from './services'

async function main() {
    const httpServer = createServer()
    const io = new Server(httpServer, {})
    const Service = await ServiceCore.init({})

    io.use(authMiddleWare)

    io.on('connection', (socket: Socket) => {
        console.log('新的连接', socket.id, socket.userInfo)
        // 挂载 sandbox
        Service.rpcService.start(socket, io)

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
