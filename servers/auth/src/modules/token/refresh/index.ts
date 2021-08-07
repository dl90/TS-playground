import { FastifyInstance, FastifyServerOptions } from 'fastify'
import { promisify } from 'util'

import * as s from '../schema'
import { refreshTokenConfig, accessTokenConfig } from '../../../../config'

interface IDecodedJWT {
  email: string,
  iat: number,
  exp: number,
  iss: string,
}

export default async (fastify: FastifyInstance, opts: FastifyServerOptions) => {

  function verifyDecodedToken (data: unknown): asserts data is IDecodedJWT {
    if (!(data instanceof Object))
      throw new Error('token is not object')
    if (!('email' in data))
      throw new Error('token does not contain email')
  }

  fastify.get('/',
    {
      schema: {
        response: {
          200: s.tokenSchema,
          400: s.messageSchema
        }
      }
    },
    async (request, reply) => {
      try {
        const refreshToken = request.cookies[refreshTokenConfig.name]
        if (!refreshToken)
          throw new Error('no token')

        const valid: unknown = fastify.jwt.verify(refreshToken)
        verifyDecodedToken(valid)

        const getAsync = promisify(fastify.redis.get).bind(fastify.redis)
        const exist = await getAsync(valid.email)
        if (!exist)
          throw new Error('token not found in redis')

        const extend = await fastify.redis.expire(valid.email, refreshTokenConfig.sign.expiresIn)
        if (!extend)
          throw new Error('redis TTL refresh failed')

        if (exist !== refreshToken)
          throw new Error('token does not match with token stored in redis')

        const timestamp = Date.now() + (accessTokenConfig.expiresIn * 1000)
        const accessToken = fastify.jwt.sign({ email: valid.email }, accessTokenConfig)
        return {
          time: reply.getResponseTime(),
          accessToken: accessToken,
          expires: timestamp,
          tokenType: 'access'
        }
      }
      catch (error) {
        request.log.warn(`error: ${error}`)
        reply
          .code(400)
          .send({ time: reply.getResponseTime(), message: 'invalid token' })
      }
    }
  )
}
