import { Socket } from 'socket.io'
import Service from '../services'


export default async function authMiddleWare(socket: Socket, next) {
    const auth = socket.handshake.auth
    const token = auth?.token
    const userInfo = await Service.authService.login(token)
    if (!userInfo) {
        return next(new Error('auth failed'))
    }

    socket.userInfo = userInfo
    

    return next()
}
