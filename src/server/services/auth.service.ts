import fs from 'fs-extra'
import os from 'os'
import path from 'path'
import { UserEntity } from '../typings/model'

export default class AuthService {
    private userDataPath = path.resolve(__dirname, '../../../datas/users.json')
    async init() {
        await fs.ensureFile(this.userDataPath)
    }

    async listUsers() {
        const buf = await fs.readFile(this.userDataPath)
        const data = buf.toString()

        if (!data) {
            return [] as UserEntity[]
        }

        return JSON.parse(data) as UserEntity[]
    }

    async login(token: string) {
        const users = await this.listUsers()
        const current = users.find(o => o.token === token)
        if (!current) {
            return null
        }

        return current
    }
}
