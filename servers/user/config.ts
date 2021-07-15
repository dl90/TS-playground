import dotenv from 'dotenv'
import crypto from 'crypto'
import { argon2id } from 'argon2'

dotenv.config()

function requiredEnv (name: string) {
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
  password: requiredEnv('REDIS_PW')
}

export const cookieConfig = {
  secret: process.env.CSRF_SECRET || crypto.randomBytes(32).toString('hex'),
  path: '/',
  sameSite: true,
  httpOnly: true,
  signed: true,
  expires: 60 * 60 * 24 * 7
}

export const csrfConfig = {
  cookieOpts: { signed: true }
}

export const accessTokenConfig = {
  secret: process.env.JWT_ACCESS_SECRET || crypto.randomBytes(32).toString('hex'),
  sign: {
    issuer: process.env.JWT_ACCESS_ISSUER || 'localhost',
    expiresIn: process.env.JWT_ACCESS_EXPIRES_IN || '10min'
  },
  verify: { issuer: process.env.JWT_ACCESS_ISSUER || 'localhost' },
}

export const refreshTokenConfig = {
  size: 128
}

export const argon2Config = {
  type: argon2id,
  timeCost: 2,
  memoryCost: 1 << 14,  // 16 MiB
  hashLength: 32,       // 97 chars
}
