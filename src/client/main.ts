import promptChooseRoom from './prompts/choose-room'
import promptClientConfig from './prompts/client-config'
import promptJoinRoomAndChat from './prompts/join-room-chat'
import initConnection from './services/socket'

async function main() {

    const clientConfig = await promptClientConfig()

    await initConnection(clientConfig.host, clientConfig.token)

    const roomId = await promptChooseRoom()

    await promptJoinRoomAndChat(roomId)
}
main()
