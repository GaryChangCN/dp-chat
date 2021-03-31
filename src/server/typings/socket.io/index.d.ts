import SocketIO from 'socket.io'
import { UserEntity } from '../model'

declare module 'socket.io' {
    export interface Socket {
        userInfo: UserEntity
    }
}