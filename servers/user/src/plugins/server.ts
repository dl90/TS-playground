import fp from 'fastify-plugin'
import { FastifyPluginOptions } from 'fastify'
import fastifyHelmet from 'fastify-helmet'
import fastifyCookie from 'fastify-cookie'
import fastifyCsrf from 'fastify-csrf'

import { cookieConfig } from '../../config'

export default fp(async (fastify, opts: FastifyPluginOptions) => {
  fastify.register(fastifyHelmet)
  fastify.register(fastifyCookie, cookieConfig)
  fastify.register(fastifyCsrf, { cookieOpts: { signed: true } })
})
