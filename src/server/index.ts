import { createServer } from 'http'
import { Server, Socket } from 'socket.io'
import config from '../config'
import authMiddleWare from './middlewares/auth.middleware'
import { MessageResponse } from '../response/message.response'
import Service, { ServiceCore } from './services'

async function main() {
    await ServiceCore.init()
    const httpServer = createServer()
    const io = new Server(httpServer, {})

    io.use(authMiddleWare)

    io.on('connection', (socket: Socket) => {
        console.log('connect', socket.id, socket.userInfo)

        io.emit("data", MessageResponse.setData("ok"))
    })

    httpServer.listen(config.port, () => {
        console.log(`==== App listen on ${config.port} ====`)
    })
}

main()
