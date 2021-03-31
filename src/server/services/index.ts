import AuthService from './auth.service'

export class ServiceCore {
    authService = new AuthService()

    async init() {
        await this.authService.init()
    }

    static instance = new ServiceCore()

    static async init() {
        if (ServiceCore.instance) {
            return ServiceCore.instance
        }

        await ServiceCore.instance.init()
        return ServiceCore.instance
    }
}

const Service = ServiceCore.instance

export default Service
