import { FastifyInstance, FastifyServerOptions } from 'fastify'

import { cookieSerializeConfig, refreshTokenConfig } from '../../../../config'
import DAL from './DAL'
import * as s from '../schemas'

interface IDecodedToken {
  email: string
  iat: number
  exp: number
  iss: string
}


export default async (fastify: FastifyInstance, opts: FastifyServerOptions) => {
  const db = DAL(fastify.mysql)

  fastify.delete('/',
    {
      preValidation: [fastify.verifyJWT],
      schema: {
        response: {
          200: s.messageSchema,
          401: s.messageSchema,
        }
      }
    },
    async (request, reply): Promise<void> => {
      const { email } = request.user as IDecodedToken

      try {
        const result = await db.deleteUser(email)
        if (!result)
          throw new Error('delete failed')

        const redisDelete = await fastify.redis.del(email)
        if (!redisDelete)
          request.log.warn('redis delete failed')

        return reply
          .code(200)
          .clearCookie(refreshTokenConfig.name, cookieSerializeConfig)
          .send({ time: reply.getResponseTime(), message: 'user deleted' })

      } catch (error) {
        request.log.warn(`error: ${error}`)
        return reply
          .code(400)
          .send({ time: reply.getResponseTime(), message: 'delete failed' })
      }
    }
  )

}
