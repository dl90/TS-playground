import { FastifyInstance, FastifyServerOptions } from 'fastify'

export default async function (fastify: FastifyInstance, opts: FastifyServerOptions) {

  fastify.get('/', async (request, reply) => {
    await reply.generateCsrf()
    return { time: reply.getResponseTime(), test: 'test' }
  })

}