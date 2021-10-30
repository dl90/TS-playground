import { FastifyInstance, FastifyServerOptions } from 'fastify'
import argon2 from 'argon2'

import {
  argon2Config,
  refreshTokenConfig,
  accessTokenConfig,
  cookieSerializeConfig
} from '../../../../config'
import DAL, { IEmail } from './DAL'
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
          201: s.tokenSchema,
          400: s.messageSchema,
          422: s.messageSchema
        }
      }
    },
    async (request, reply): Promise<void> => {
      const { email, password } = request.body

      try {
        const exist: IEmail = await db.getEmail(email)
        if (exist)
          throw new Error('email already exists')

        const hash = await argon2.hash(password, argon2Config)
        const inserted = await db.insertEmailHash(email, hash)
        if (!inserted)
          throw new Error('db insert failed')

        const refreshToken = fastify.jwt.sign({ email }, refreshTokenConfig.sign)
        const refreshTokenExpires = Date.now() + (refreshTokenConfig.sign.expiresIn * 1000)
        const redisInserted = await fastify.redis.set(email, refreshToken, 'EX', refreshTokenConfig.sign.expiresIn)
        if (!redisInserted)
          throw new Error('redis insert failed')

        const accessTokenExpires = Date.now() + (accessTokenConfig.expiresIn * 1000)
        const accessToken = fastify.jwt.sign({ email }, accessTokenConfig)

        return reply
          .code(201)
          .send({
            time: reply.getResponseTime(),
            accessToken,
            accessTokenExpires,
            refreshToken,
            refreshTokenExpires
          })

      } catch (error) {
        request.log.warn(`error: ${error}`)
        return reply
          .code(400)
          .send({ time: reply.getResponseTime(), message: 'not created' })
      }
    }
  )
}
