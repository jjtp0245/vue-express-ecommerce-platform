import { pool } from '../database.js';

export default class PaymentService {
    async createPayment(payment) {
        const sql = `INSERT INTO payments SET ?`;
        const [result] = await pool.query(sql, payment);
        return result;
    }

    async getPaymentByOrderId(order_id) {
        const sql = `SELECT * FROM payments WHERE order_id = ?`;
        const [result] = await pool.query(sql, [order_id]);
        return result;
    }

    async updatePaymentStatus(order_id, status) {
        const sql = `UPDATE payments SET payment_status = ? WHERE order_id = ?`;
        const [result] = await pool.query(sql, [status, order_id]);
        return result;
    }
}
