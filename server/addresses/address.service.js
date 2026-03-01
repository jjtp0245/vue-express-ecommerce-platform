import { pool } from '../database.js';

export default class AddressService {
    // ดึงที่อยู่ของผู้ใช้จาก user_id
    async getAddressesByUserId(user_id) {
        const sql = `SELECT * FROM addresses WHERE user_id = ?`;
        const [result] = await pool.query(sql, [user_id]);
        return result;
    }

    // ดึงที่อยู่จาก address_id
    async getAddressById(address_id) {
        const sql = `SELECT * FROM addresses WHERE address_id = ?`;
        const [result] = await pool.query(sql, [address_id]);
        return result;
    }

    // เพิ่มที่อยู่ใหม่
    async insertAddress(address) {
        const sql = `INSERT INTO addresses SET ?`;
        const [result] = await pool.query(sql, address);
        return result;
    }

    // อัปเดตที่อยู่
    async updateAddress(address_id, address) {
        const sql = `UPDATE addresses SET ? WHERE address_id = ?`;
        const [result] = await pool.query(sql, [address, address_id]);
        return result;
    }

    // ลบที่อยู่
    async deleteAddress(address_id) {
        const sql = `DELETE FROM addresses WHERE address_id = ?`;
        const [result] = await pool.query(sql, [address_id]);
        return result;
    }

    // เคลียร์ค่าที่อยู่เริ่มต้นของผู้ใช้ทั้งหมด
    async clearDefaultAddress(user_id) {
        const sql = `UPDATE addresses SET \`default\` = 0 WHERE user_id = ?`;
        await pool.query(sql, [user_id]);
    }

    // ตั้งค่าที่อยู่เริ่มต้น
    async setDefaultAddress(address_id) {
        const sql = `UPDATE addresses SET \`default\` = 1 WHERE address_id = ?`;
        const [result] = await pool.query(sql, [address_id]);
        return result;
    }
    async getDefaultAddressByUserId(user_id) {
        const sql = `SELECT * FROM addresses WHERE user_id = ? AND \`default\` = 1 LIMIT 1`;
        const [result] = await pool.query(sql, [user_id]);
        return result[0] || null;
    }

}
