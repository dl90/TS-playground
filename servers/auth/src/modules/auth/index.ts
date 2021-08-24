import { FastifyInstance, FastifyServerOptions } from 'fastify'

export default async (fastify: FastifyInstance, opts: FastifyServerOptions) => {

  fastify.get('/', {
    // onRequest: fastify.csrfProtection
  }, async (request, reply) => {
    console.debug(request.headers)
    // const token = await reply.generateCsrf()
    // reply.setCookie('_csrf', '')
    return { time: reply.getResponseTime(), message: 'ok' }
  })

}