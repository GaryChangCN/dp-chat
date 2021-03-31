import Express = require('express')
import config from '../config'


async function main () {
    const app: Express.Application = Express()
    app.get('/', (req, res) => {
        res.send("hello world")
    })

    app.listen(config.port, () => {
        console.log(`==== app listen on ${config.port} ====`)
    })
}

main()
