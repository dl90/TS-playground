import { MySQLPromisePool } from 'fastify-mysql'
import { RowDataPacket, OkPacket } from 'mysql2'

interface IEmailHash extends RowDataPacket {
  email: string,
  hash: string
}

export default (db: MySQLPromisePool) => {

  const getEmailHash = async (email: string) => {
    const [row] = await db.query<IEmailHash[]>(
      'SELECT * FROM `email_password` WHERE `email` = ?', [email])
    return row[0]
  }

  const incrementBadAttempt = async (email: string) => {
    const [row] = await db.query<OkPacket>(
      'UPDATE `password_attempt` SET `attempt` = `attempt` + 1 WHERE `email` = ?', [email])
    return row
  }

  return {
    getEmailHash,
    incrementBadAttempt
  }
}
