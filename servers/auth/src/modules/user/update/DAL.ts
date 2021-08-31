import { MySQLPromisePool } from 'fastify-mysql'
import { RowDataPacket, OkPacket } from 'mysql2'

interface IEmail extends RowDataPacket {
  email: string
}


export default (db: MySQLPromisePool) => {

  const getEmail = async (email: string): Promise<boolean> => {
    const [result] = await db.query<IEmail[]>(
      'SELECT `email` FROM `user` WHERE `email` = ?', [email])

    return result.length > 0
  }

  const updateEmail = async (email: string, newEMail: string): Promise<boolean> => {
    const [result] = await db.query<OkPacket>(
      'UPDATE `user` SET `email` = ?, `updated_at` = NOW() WHERE `email` = ?', [newEMail, email])

    return result.affectedRows === 1
  }

  const updatePassword = async (email: string, password: string): Promise<boolean> => {
    const [result] = await db.query<OkPacket>(
      'UPDATE `password` INNER JOIN `user` ON user.id = password.id SET `hash` = ?, password.updated_at = NOW()  WHERE `email` = ?',
      [password, email])

    return result.affectedRows === 1
  }

  return {
    getEmail,
    updateEmail,
    updatePassword
  }
}
