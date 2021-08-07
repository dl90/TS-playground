import fp from 'fastify-plugin'
import { FastifyInstance, FastifyPluginOptions, FastifyPluginAsync } from 'fastify'
import fastifyHelmet from 'fastify-helmet'
import fastifyCors from 'fastify-cors'
import fastifyCookie from 'fastify-cookie'
import fastifyCsrf from 'fastify-csrf'
import fastifyJWT, { FastifyJWTOptions } from 'fastify-jwt'

import { cookieConfig, csrfConfig, jwtConfig, corsConfig } from '../../config'

const plugins: FastifyPluginAsync = async (fastify: FastifyInstance, opts: FastifyPluginOptions) => {
  fastify.register(fastifyHelmet)
  fastify.register(fastifyCors, corsConfig)
  fastify.register(fastifyCookie, cookieConfig)
  fastify.register(fastifyCsrf, csrfConfig)
  fastify.register(fastifyJWT, jwtConfig as FastifyJWTOptions)
}

export default fp(plugins)
