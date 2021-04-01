import * as inquirer from 'inquirer'
import * as fs from 'fs-extra'
import * as path from 'path'
import * as os from 'os'
import { ClientConfig } from '../typings'


export default async function promptClientConfig () {
    const answers = await inquirer.prompt([
        {
            type: 'confirm',
            message: '是否要使用之前的配置?',
            name: 'useExist',
            default: true,
        },
        {
            type: 'input',
            message: '请输入服务器的 host，例如 google.com',
            name: 'host',
            when: answers => {
                return !answers.useExist
            }
        },
        {
            type: 'input',
            message: '请输入用户 token',
            name: 'token',
            when: answers => {
                return !answers.useExist
            }
        }
    ])

    const configFilePath = path.join(os.homedir(), '.dpconfig')
    let clientConfig = {} as ClientConfig

    if (answers.useExist) {
        const buf = await fs
            .readFile(configFilePath)
            .then(buf => {
                return buf.toString()
            })
            .catch(err => {
                throw new Error('找不到已有的配置信息，请重新输入')
            })
    
        try {
            clientConfig = JSON.parse(buf)
        } catch (error) {
            throw new Error('配置文件格式错误')
        }
    } else {
        clientConfig = {
            token: answers.token,
            host: answers.host
        }
        await fs.writeFile(configFilePath, JSON.stringify(clientConfig, null, 4))
    }
    return clientConfig
}