import fastify, { FastifyServerOptions } from 'fastify'
import autoload from 'fastify-autoload'
import { join } from 'path'

export default async (opts: FastifyServerOptions) => {
  const app = fastify(opts)

  app.register(autoload, {
    dir: join(__dirname, 'plugins')
  })

  app.register(autoload, {
    dir: join(__dirname, 'modules')
  })

  return app
}
