import { FastifyInstance, FastifyServerOptions } from 'fastify'
import { promisify } from 'util'

import * as s from '../schema'
import { refreshTokenConfig, accessTokenConfig } from '../../../../config'

interface IDecodedToken {
  email: string,
  iat: number,
  exp: number,
  iss: string,
}


export default async (fastify: FastifyInstance, opts: FastifyServerOptions) => {

  fastify.get('/',
    {
      preValidation: [fastify.verifyJWT],
      schema: {
        response: {
          200: s.tokenSchema,
          400: s.messageSchema
        }
      }
    },
    async (request, reply) => {
      try {
        const { email } = request.user as IDecodedToken
        const refreshToken = request.cookies[refreshTokenConfig.name]
        if (!refreshToken)
          throw new Error('no token')

        console.log(request.user)

        const getAsync = promisify(fastify.redis.get).bind(fastify.redis)
        const redisToken = await getAsync(email)
        if (!redisToken)
          throw new Error('token not found in redis')

        if (redisToken !== refreshToken)
          throw new Error('token does not match with token stored in redis')

        const extend = await fastify.redis.expire(email, refreshTokenConfig.sign.expiresIn)
        if (!extend)
          throw new Error('redis TTL refresh failed')

        const timestamp = Date.now() + (accessTokenConfig.expiresIn * 1000)
        const accessToken = fastify.jwt.sign({ email: email }, accessTokenConfig)
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
