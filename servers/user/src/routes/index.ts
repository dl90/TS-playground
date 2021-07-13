import { FastifyInstance, FastifyServerOptions } from 'fastify'

export default async function (fastify: FastifyInstance, opts: FastifyServerOptions) {

  fastify.get('/', async (request, reply) => {
    await reply.generateCsrf()

    const query = await fastify.mysql.query('SELECT * FROM user')
    console.log(query[0])

    return { time: reply.getResponseTime(), test: 'test' }
  })

}