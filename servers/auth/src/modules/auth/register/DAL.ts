import { MySQLPromisePool } from 'fastify-mysql'
import { RowDataPacket, OkPacket } from 'mysql2'

interface IEmail extends RowDataPacket {
  email: string
}

export default (db: MySQLPromisePool) => {

  const getEmail = async (email: string) => {
    const [row] = await db.query<IEmail[]>('SELECT `email` FROM `user` WHERE `email` = ?', [email])
    return row[0]
  }

  const insertEmailHash = async (email: string, hash: string) => {
    let conn
    try {
      conn = await db.getConnection()
      await conn.beginTransaction()
      const [userInsert] = await conn.execute<OkPacket>('INSERT INTO `user` SET `email` = ?', [email])
      const [pwInsert] = await conn.execute<OkPacket>(
        'INSERT INTO `password` SET `user_id` = ?, `hash` = ?',
        [userInsert.insertId, hash]
      )
      if (!pwInsert.insertId)
        throw new Error('')

      await conn.commit()
      return true
    } catch (error) {
      if (conn) await conn.rollback()
      throw error
    } finally {
      if (conn) conn.release()
    }
  }

  return {
    getEmail,
    insertEmailHash
  }
}