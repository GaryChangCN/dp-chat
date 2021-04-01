import inquirer from 'inquirer'

export default async function PromotWriteMessage() {
    const ret = await inquirer.prompt([
        {
            type: 'input',
            message: '输入文字: ',
            name: 'message',
        },
    ])
    return ret.message as string
}
