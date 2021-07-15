import { FastifyInstance, FastifyServerOptions } from 'fastify'
import argon2 from 'argon2'
import crypto from 'crypto'

import { argon2Config, refreshTokenConfig } from '../../../config'
import DAL from './DAL'
import * as s from './schemas'
import bodyErrorHandler from '../../util/bodyErrorHandler'

export default async function (fastify: FastifyInstance, opts: FastifyServerOptions) {
  const db = DAL(fastify.mysql)

  fastify.setErrorHandler(bodyErrorHandler)

  // @remove
  fastify.get('/', async (request, reply) => {

    try {
      const valid = await request.jwtVerify()
      console.log(valid)

    } catch (error) {
      console.log(error)
    }

    return {
      time: reply.getResponseTime(),
      header: request.headers
    }
  })


  fastify.post<{ Body: s.ILoginBody, Headers: s.ILoginHeaders }>(
    '/',
    {
      schema: {
        body: s.credSchema,
        response: {
          201: s.messageSchema,
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
        const inserted = await db.insertEmailHash(email, hash)
        if (!inserted)
          throw new Error('db insert failed')

        const accessToken = fastify.jwt.sign({ email })
        const refreshToken = crypto.randomBytes(refreshTokenConfig.size).toString('base64')

        reply.setCookie('refreshToken', refreshToken)
        return { time: reply.getResponseTime(), token: accessToken }
      }
      catch (error) {
        request.log.warn(`error: ${error}`)
        return reply
          .code(400)
          .send({ time: reply.getResponseTime(), message: 'not created' })
      }
    })
}
