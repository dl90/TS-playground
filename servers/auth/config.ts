import dotenv from 'dotenv'
import crypto from 'crypto'
import { argon2id } from 'argon2'
import fs from 'fs'
import { Algorithm } from 'jsonwebtoken'
import { CookieSerializeOptions } from 'fastify-cookie'


dotenv.config()

const requiredEnv = (name: string) => {
  if (process.env[name] === undefined)
    throw new Error(`missing env ${name}`)

  return process.env[name]
}

export const serverConfig = {
  port: process.env.PORT || 3001
}

export const mysqlConfig = {
  host: requiredEnv('MYSQL_HOST'),
  user: requiredEnv('MYSQL_USER'),
  password: requiredEnv('MYSQL_PW'),
  database: requiredEnv('MYSQL_DB'),
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
}

export const redisConfig = {
  host: requiredEnv('REDIS_HOST'),
  port: +!requiredEnv('REDIS_PORT'),
  db: requiredEnv('REDIS_DB'),
  user: requiredEnv('REDIS_USER'),
  password: requiredEnv('REDIS_PW'),
  closeClient: true
}

export const corsConfig = {
  origin: process.env.CLIENT_SERVER || 'http://localhost:4200',
  credentials: true,
  allowedHeaders: [
    'Content-Type',
    'Authorization',
    'X-Requested-With',
    'Access-Control-Allow-Origin',
    'Allow-Origin-With-Credentials'
  ]
}

export const cookieConfig = {
  secret: process.env.COOKIE_SECRET || crypto.randomBytes(32).toString('hex'),
}

export const cookieSerializeConfig = {
  path: '/',
  sameSite: 'none', // explicit for cross-origin cookies
  secure: true,     // needs to be https to set cross-origin cookies
  httpOnly: true
} as CookieSerializeOptions

export const csrfConfig = {
  cookieOpts: {
    // signed: true,
    path: '/',
    sameSite: 'none',
    httpOnly: true,
    secure: true
  } as CookieSerializeOptions
}

export const jwtConfig = {
  secret: {
    private: fs.readFileSync(__dirname + '/keys/jwt.RS256.private.key'),
    public: fs.readFileSync(__dirname + '/keys/jwt.RS256.public.key')
  },
  verify: { issuer: process.env.JWT_ISSUER || 'localhost' },
  cookie: { cookieName: process.env.JWT_COOKIE_NAME || 'jwt' }
}

export const accessTokenConfig = {
  algorithm: 'RS256' as Algorithm,
  expiresIn: +(process.env.JWT_ACCESS_EXPIRES_IN || 600), // 10 min
  issuer: process.env.JWT_ISSUER || 'localhost'
}

export const refreshTokenConfig = {
  name: process.env.JWT_COOKIE_NAME || 'jwt',
  sign: {
    algorithm: 'RS256' as Algorithm,
    expiresIn: +(process.env.JWT_REFRESH_EXPIRES_IN || 86400), // 1 days
    issuer: process.env.JWT_ISSUER || 'localhost'
  }
}

export const argon2Config = {
  type: argon2id,
  timeCost: 2,
  memoryCost: 1 << 14,  // 16 MiB
  hashLength: 32,       // 97 chars
}
