import dotenv from 'dotenv'
import crypto from 'crypto'

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
  port: requiredEnv('REDIS_PORT'),
  db: requiredEnv('REDIS_DB'),
  user: requiredEnv('REDIS_USER'),
  password: requiredEnv('REDIS_PW')
}

export const cookieConfig = {
  secret: process.env.CSRF_SECRET || crypto.randomBytes(32).toString('hex'),
  httpOnly: true,
}
