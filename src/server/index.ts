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
        console.log('connect', socket.id, socket.userInfo)
        // 挂载 sandbox
        Service.sandboxService.mountSocket(socket)
    })

    httpServer.listen(config.port, () => {
        console.log(`==== App listen on ${config.port} ====`)
    })
}

main()
