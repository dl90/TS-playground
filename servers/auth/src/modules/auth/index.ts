import { FastifyInstance, FastifyServerOptions } from 'fastify'

export default async (fastify: FastifyInstance, opts: FastifyServerOptions) => {

  fastify.get('/', async (request, reply) => {
    console.debug(request.headers)
    console.debug(request.cookies)
    await reply.generateCsrf()
    return { time: reply.getResponseTime(), message: 'ok' }
  })

}