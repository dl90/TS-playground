import fp from 'fastify-plugin'
import { FastifyPluginOptions } from 'fastify'
import fastifyMySQL, { MySQLPromisePool } from 'fastify-mysql'
import { RedisClient, ClientOpts } from 'redis'
import fastifyRedis, { FastifyRedisPlugin } from 'fastify-redis'

import { mysqlConfig, redisConfig } from '../../config'

declare module 'fastify' {
  interface FastifyInstance {
    mysql: MySQLPromisePool
  }
}

export default fp(async (fastify, opts: FastifyPluginOptions) => {
  fastify.register(fastifyMySQL, {
    promise: true,
    ...mysqlConfig
  })

  const redisClient = new RedisClient(redisConfig as ClientOpts)
  fastify.register(fastifyRedis, {
    closeClient: true,
    client: redisClient
  } as FastifyRedisPlugin)
})
