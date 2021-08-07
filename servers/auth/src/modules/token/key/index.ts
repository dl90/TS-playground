import { FastifyInstance, FastifyServerOptions } from 'fastify'
import { readFile } from 'fs/promises'
import { resolve } from 'path'

import * as s from '../schema'

export default async (fastify: FastifyInstance, opts: FastifyServerOptions) => {
  const publicKey = await readFile(resolve(__dirname, '../../../../keys/jwt.RS256.public.key'))

  fastify.get('/',
    {
      schema: {
        response: {
          200: {
            type: 'object',
            properties: {
              time: { type: 'number' },
              publicKey: {
                type: 'object',
                nullable: false,
                properties: {
                  type: { type: 'string' },
                  data: {
                    type: 'array',
                    items: { type: 'number' }
                  }
                }
              }
            }
          },
          400: s.messageSchema
        }
      }
    },
    async (request, reply) => {
      try {
        reply.send({ time: reply.getResponseTime(), publicKey })
      } catch (error) {
        request.log.warn(`error: ${error}`)
        reply
          .code(400)
          .send({ time: reply.getResponseTime(), message: 'unable to stream key' })
      }
    }
  )
}