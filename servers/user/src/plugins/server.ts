import fp from 'fastify-plugin'
import { FastifyInstance, FastifyPluginOptions, FastifyPluginAsync } from 'fastify'
import fastifyHelmet from 'fastify-helmet'
import fastifyCookie from 'fastify-cookie'
import fastifyCsrf from 'fastify-csrf'
import fastifyJWT from 'fastify-jwt'

import { cookieConfig, accessTokenConfig, csrfConfig } from '../../config'

const plugins: FastifyPluginAsync = async (fastify: FastifyInstance, opts: FastifyPluginOptions) => {
  fastify.register(fastifyHelmet)
  fastify.register(fastifyCookie, cookieConfig)
  fastify.register(fastifyCsrf, csrfConfig)
  fastify.register(fastifyJWT, accessTokenConfig)
}

export default fp(plugins)
