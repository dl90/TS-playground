import { FastifyInstance, FastifyServerOptions } from 'fastify'
import argon2 from 'argon2'

import {
  refreshTokenConfig,
  accessTokenConfig,
  cookieSerializeConfig
} from '../../../../config'
import DAL, { IEmailHash } from './DAL'
import * as s from '../schemas'
import bodyErrorHandler from '../bodyErrorHandler'


export default async (fastify: FastifyInstance, opts: FastifyServerOptions) => {
  const db = DAL(fastify.mysql)
  fastify.setErrorHandler(bodyErrorHandler)

  fastify.post<{ Body: s.ILoginBody }>(
    '/',
    {
      schema: {
        body: s.credSchema,
        response: {
          200: s.tokenSchema,
          400: s.messageSchema,
          422: s.messageSchema,
          423: s.messageSchema,
        }
      }
    },
    async (request, reply): Promise<void> => {
      const { email, password } = request.body

      try {
        const exist: IEmailHash = await db.getEmailHash(email)
        if (!exist)
          throw new Error('user not found')

        if (exist.locked_until > new Date())
          return reply
            .code(423)
            .send({
              time: reply.getResponseTime(),
              message: `user locked until ${exist.locked_until}`,
              locked_until: exist.locked_until,
            })

        const validPW = await argon2.verify(exist.hash, password)
        if (!validPW) {
          exist.bad_attempt > 3
            ? await db.setLockedUntil(email, new Date(Date.now() + 1000 * 60 * 60 * 3))
            : await db.incrementBadAttempt(email)

          throw new Error('invalid password')
        }

        if (exist.bad_attempt > 0)
          await db.clearBadAttempt(email)

        const refreshToken = fastify.jwt.sign({ email }, refreshTokenConfig.sign)
        const redisInserted = await fastify.redis.set(email, refreshToken, 'EX', refreshTokenConfig.sign.expiresIn)
        if (!redisInserted)
          throw new Error('redis insert failed')

        const timestamp = Date.now() + (accessTokenConfig.expiresIn * 1000)
        const accessToken = fastify.jwt.sign({ email }, accessTokenConfig)

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
          .send({ time: reply.getResponseTime(), message: 'login failed' })
      }
    }
  )

}
