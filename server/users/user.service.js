import { pool } from '../database.js';

export default class UserService {
    async getUsers() {
        let sql = `SELECT * FROM users`;
        const [result] = await pool.query(sql);
        return result;
    }
    async loginuser(email, password) {
        let sql = `SELECT user_id,email,password FROM users WHERE email = '${email}' AND password = '${password}' LIMIT 1`;
        const [result] = await pool.query(sql);
        return result;
    }
    async updatePassword(email, password) {
        let updateSql = `UPDATE users SET password = ? WHERE email = ?`;
        const [updateResult] = await pool.query(updateSql, [password, email]);
        return updateResult;
    }
    async getUserByEmail(email) {
        const query = "SELECT * FROM users WHERE email = ?";
        const [user] = await pool.execute(query, [email]);
        return user;
    }
    async deleteUser(user_id) {
        let deleteSql = `DELETE FROM users WHERE user_id = ?`;
        const [result] = await pool.query(deleteSql, [user_id]);
        return result;
    }
    async userRegister(user) {
        let sql = `INSERT INTO users SET ?`;
        const [result] = await pool.query(sql, user);
        return result;
    }
    async getUserByEmail(email) {
        const query = "SELECT * FROM users WHERE email = ?";
        const [user] = await pool.execute(query, [email]);
        return user;
    }
    async updateUserProfile(email, data) {
        const query = `UPDATE users SET ? WHERE email = ?`;
        const [result] = await pool.query(query, [data, email]);  // ใช้ชื่อไฟล์และข้อมูลอื่น ๆ ที่ถูกต้อง
        return result;
    }
}