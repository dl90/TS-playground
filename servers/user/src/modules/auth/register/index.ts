import { FastifyInstance, FastifyServerOptions } from 'fastify'
import argon2 from 'argon2'

import { argon2Config, refreshTokenConfig, accessTokenConfig, cookieConfig } from '../../../../config'
import DAL from './DAL'
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
    async (request, reply) => {
      const { email, password } = request.body

      try {
        const exist = await db.getEmail(email)
        if (exist)
          throw new Error('email already exists')

        const hash = await argon2.hash(password, argon2Config)
        const mysqlInsert = await db.insertEmailHash(email, hash)
        if (!mysqlInsert)
          throw new Error('db insert failed')

        const refreshToken = fastify.jwt.sign({ email }, refreshTokenConfig.sign)
        const redisInsert = await fastify.redis.set(email, refreshToken, 'EX', refreshTokenConfig.sign.expiresIn)
        if (!redisInsert)
          throw new Error('redis insert failed')

        const timestamp = Date.now() + (accessTokenConfig.expiresIn * 1000)
        const accessToken = fastify.jwt.sign({ email }, accessTokenConfig)
        reply.setCookie(refreshTokenConfig.name, refreshToken, cookieConfig)
        return {
          time: reply.getResponseTime(),
          accessToken: accessToken,
          expires: timestamp,
          tokenType: 'access'
        }
      }
      catch (error) {
        request.log.warn(`error: ${error}`)
        return reply
          .code(400)
          .send({ time: reply.getResponseTime(), message: 'not created' })
      }
    }
  )
}
