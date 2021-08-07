import app from './src/app'
import { serverConfig } from './config'

(async () => {
  const server = await app({ logger: true })

  try {
    const addr = await server.listen(serverConfig.port)
    console.log('serving: ', addr)
    // console.log(server.printRoutes())
  } catch (error) {
    server.log.error(error)
    process.exit(1)
  }
})()
