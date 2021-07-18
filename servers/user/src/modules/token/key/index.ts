import { FastifyInstance, FastifyServerOptions } from 'fastify'
import { createReadStream } from 'fs'
import { resolve } from 'path'

import * as s from '../schema'

export default async (fastify: FastifyInstance, opts: FastifyServerOptions) => {

  fastify.get('/',
    {
      schema: {
        response: {
          400: s.messageSchema
        }
      }
    },
    async (request, reply) => {
      try {
        const stream = createReadStream(resolve(__dirname, '../../../../keys/jwt.RS256.public.key'))
        reply.send(stream)
      } catch (error) {
        request.log.warn(`error: ${error}`)
        reply
          .code(400)
          .send({ time: reply.getResponseTime(), message: 'unable to stream key' })
      }
    }
  )
}