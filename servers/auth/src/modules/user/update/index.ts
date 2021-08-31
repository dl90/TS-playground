import { FastifyInstance, FastifyServerOptions } from 'fastify'
import argon2 from 'argon2'

import {
  accessTokenConfig,
  argon2Config,
  cookieSerializeConfig,
  refreshTokenConfig
} from '../../../../config'
import DAL from './DAL'
import * as s from '../schemas'

interface DecodedToken {
  email: string
  iat: number
  exp: number
  iss: string
}


export default async (fastify: FastifyInstance, opts: FastifyServerOptions) => {
  const db = DAL(fastify.mysql)

  fastify.post<{ Body: s.IEmail }>('/email',
    {
      preValidation: [fastify.verifyJWT],
      schema: {
        body: s.emailSchema,
        response: {
          200: s.tokenSchema,
          400: s.messageSchema,
          422: s.messageSchema
        }
      }
    },
    async (request, reply): Promise<void> => {
      const { email } = request.user as DecodedToken
      const { email: newEmail } = request.body

      try {
        const exists = await db.getEmail(newEmail)
        if (exists)
          return reply.code(400).send({ message: 'email already exists' })

        const result = await db.updateEmail(email, newEmail)
        if (!result)
          throw new Error('update failed')

        const refreshToken = fastify.jwt.sign({ email: newEmail }, refreshTokenConfig.sign)
        const redisInsert = await fastify.redis.set(newEmail, refreshToken, 'EX', refreshTokenConfig.sign.expiresIn)
        if (!redisInsert)
          throw new Error('redis insert failed')

        const timestamp = Date.now() + (accessTokenConfig.expiresIn * 1000)
        const accessToken = fastify.jwt.sign({ email: newEmail }, accessTokenConfig)

        // @TODO cascade email change to data service (some internal http request)

        return reply
          .code(200)
          .setCookie(refreshTokenConfig.name, refreshToken, cookieSerializeConfig)
          .send({
            time: reply.getResponseTime(),
            accessToken: accessToken,
            expires: timestamp,
            tokenType: 'access'
          })

      } catch (error) {
        request.log.warn(`error: ${error}`)
        return reply
          .code(400)
          .send({ time: reply.getResponseTime(), message: 'update failed' })
      }
    }
  )

  fastify.post<{ Body: s.IPassword }>('/password',
    {
      preValidation: [fastify.verifyJWT],
      schema: {
        body: s.passwordSchema,
        response: {
          200: s.messageSchema,
          400: s.messageSchema,
          422: s.messageSchema
        }
      }
    },
    async (request, reply): Promise<void> => {
      const { email } = request.user as DecodedToken
      const { password: newPassword } = request.body

      try {
        const hash = await argon2.hash(newPassword, argon2Config)
        const updated = await db.updatePassword(email, hash)
        if (!updated)
          throw new Error('update failed')

        return reply
          .code(200)
          .clearCookie(refreshTokenConfig.name, cookieSerializeConfig)
          .send({ time: reply.getResponseTime(), message: 'update successful' })

      } catch (error) {
        request.log.warn(`error: ${error}`)
        return reply
          .code(400)
          .send({ time: reply.getResponseTime(), message: 'update failed' })
      }
    }
  )

}
