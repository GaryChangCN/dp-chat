import { io } from 'socket.io-client'
import fs from 'fs-extra'
import os from 'os'
import path from 'path'
import { MessageResponse } from '../response/message.response'

const token = '123'
async function main() {
    const socket = io('ws://127.0.0.1:3001', {
        auth: {
            token,
        },
    })
    socket.on('connect', () => {
        console.log('connect', socket.id)
    })

    socket.on('data', (res: MessageResponse) => {
        console.log('>>>', res.data)
    })

    socket.on('disconnect', () => {
        console.log('disconnect', socket.id)
    })

    socket.on('connect_error', err => {
        console.error('connect error', err.message)
        setTimeout(() => {
            socket.connect()
        }, 3000)
    })
}
main()
