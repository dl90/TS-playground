import fp from 'fastify-plugin'
import { FastifyInstance, FastifyPluginOptions, FastifyPluginAsync } from 'fastify'
import fastifyMySQL, { MySQLPromisePool } from 'fastify-mysql'
import { RedisClient, ClientOpts } from 'redis'
import fastifyRedis, { FastifyRedisPlugin } from 'fastify-redis'

import { mysqlConfig, redisConfig } from '../../config'

declare module 'fastify' {
  interface FastifyInstance {
    mysql: MySQLPromisePool
  }
}

const dbs: FastifyPluginAsync = async (fastify: FastifyInstance, opts: FastifyPluginOptions) => {
  fastify.register(fastifyMySQL, {
    promise: true,
    ...mysqlConfig
  })

  const redisClient = new RedisClient(redisConfig as ClientOpts)
  fastify.register(fastifyRedis, {
    closeClient: true,
    client: redisClient
  } as FastifyRedisPlugin)
}

export default fp(dbs)
