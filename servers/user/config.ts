import dotenv from 'dotenv'
import crypto from 'crypto'
import { argon2id } from 'argon2'
import fs from 'fs'

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
  password: requiredEnv('REDIS_PW')
}

export const cookieConfig = {
  secret: process.env.COOKIE_SECRET || crypto.randomBytes(32).toString('hex'),
  path: '/',
  sameSite: true,
  httpOnly: true,
  signed: true
}

export const csrfConfig = {
  cookieOpts: { signed: true }
}

export const jwtConfig = {
  secret: {
    public: fs.readFileSync(__dirname + '/keys/jwt.RS256.public.key'),
    private: fs.readFileSync(__dirname + '/keys/jwt.RS256.private.key')
  },
  sign: {
    algorithm: 'RS256',
    issuer: process.env.JWT_ISSUER || 'localhost'
  },
  verify: { issuer: process.env.JWT_ISSUER || 'localhost' },
}

export const accessTokenConfig = {
  expiresIn: +(process.env.JWT_ACCESS_EXPIRES_IN || 600) // 10min
}

export const refreshTokenConfig = {
  name: 'refreshToken',
  sign: {
    expiresIn: +(process.env.JWT_REFRESH_EXPIRES_IN || 10) // 7 days
  }
}

export const argon2Config = {
  type: argon2id,
  timeCost: 2,
  memoryCost: 1 << 14,  // 16 MiB
  hashLength: 32,       // 97 chars
}
