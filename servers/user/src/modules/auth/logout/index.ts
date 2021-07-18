import { FastifyInstance, FastifyServerOptions } from 'fastify'

import { cookieConfig, refreshTokenConfig } from '../../../../config'
import * as s from '../schemas'

export default async (fastify: FastifyInstance, opts: FastifyServerOptions) => {

  fastify.post(
    '/',
    {
      schema: {
        response: {
          200: s.messageSchema,
          400: s.messageSchema
        }
      }
    },
    async (request, reply) => {
      try {
        const refreshToken = request.cookies[refreshTokenConfig.name]
        if (!refreshToken)
          return { time: reply.getResponseTime(), message: 'ok' }

        const payload = fastify.jwt.decode<{ email: string }>(refreshToken)
        if (payload) {
          const redisDelete = await fastify.redis.del(payload.email)
          if (!redisDelete)
            request.log.warn('redis delete failed')
        }

        reply.clearCookie(refreshTokenConfig.name, cookieConfig)
        return { time: reply.getResponseTime(), message: 'ok' }
      } catch (error) {
        request.log.warn(`error: ${error}`)
        return reply
          .code(400)
          .send({ time: reply.getResponseTime(), message: 'something broke' })
      }
    }
  )
}
