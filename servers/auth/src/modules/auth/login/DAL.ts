import { MySQLPromisePool } from 'fastify-mysql'
import { RowDataPacket, OkPacket } from 'mysql2'

export interface IEmailHash extends RowDataPacket {
  email: string,
  hash: string,
  bad_attempt: number,
  locked_until: Date
}

export default (db: MySQLPromisePool) => {

  const getEmailHash = async (email: string): Promise<IEmailHash> => {
    const [row] = await db.query<IEmailHash[]>(
      'SELECT * FROM `email_password` WHERE `email` = ? LIMIT 1', [email])
    return row[0]
  }

  const setLockedUntil = async (email: string, lockUntil: Date): Promise<Boolean> => {
    const [row] = await db.query<OkPacket>(
      'UPDATE `email_password` SET `locked_until` = ? WHERE `email` = ?', [lockUntil, email])
    return row.changedRows === 1
  }

  const clearLockedUntil = async (email: string): Promise<Boolean> => {
    const [row] = await db.query<OkPacket>(
      'UPDATE `email_password` SET `locked_until` = NULL WHERE `email` = ?', [email])
    return row.changedRows === 1
  }

  const incrementBadAttempt = async (email: string): Promise<Boolean> => {
    const [row] = await db.query<OkPacket>(
      'UPDATE `password_attempt` SET `bad_attempt` = `bad_attempt` + 1 WHERE `email` = ?', [email])
    return row.changedRows === 1
  }

  const clearBadAttempt = async (email: string): Promise<Boolean> => {
    const [row] = await db.query<OkPacket>(
      'UPDATE `password_attempt` SET `bad_attempt` = 0 WHERE `email` = ?', [email])
    return row.changedRows === 1
  }

  return {
    getEmailHash,
    setLockedUntil,
    clearLockedUntil,
    incrementBadAttempt,
    clearBadAttempt
  }
}
