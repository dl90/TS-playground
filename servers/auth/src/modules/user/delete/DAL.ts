import { MySQLPromisePool } from 'fastify-mysql'
import { OkPacket } from 'mysql2'


export default (db: MySQLPromisePool) => {

  const deleteUser = async (email: string): Promise<Boolean> => {
    const [rows] = await db.execute<OkPacket>(
      'DELETE FROM `user` WHERE email = ?',
      [email]
    )
    return rows.affectedRows === 1
  }

  return {
    deleteUser
  }
}
