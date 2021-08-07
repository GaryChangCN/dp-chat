import promptChooseRoom from './prompts/choose-room'
import promptClientConfig from './prompts/client-config'
import joinRoomAndChat from './services/join-room-chat'
import initConnection from './services/socket'

async function main() {

    try {
        const clientConfig = await promptClientConfig()
    
        await initConnection(clientConfig.host, clientConfig.token)

        const roomId = await promptChooseRoom()
    
        await joinRoomAndChat(roomId)
    } catch (error) {
        console.error(error)
    }
}
main()
