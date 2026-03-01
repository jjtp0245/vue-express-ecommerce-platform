import { pool } from '../database.js';

export default class OrderService {
    async createOrder(order) {
        const sql = `INSERT INTO orders SET ?`;
        const [result] = await pool.query(sql, order);
        return result;
    }

    async createOrderItems(orderItems) {
        const sql = `INSERT INTO order_items (order_id, product_id, quantity, price) VALUES ?`;
        const values = orderItems.map(item => [item.order_id, item.product_id, item.quantity, item.price]);
        await pool.query(sql, [values]);
    }

    async getOrderById(order_id) {
        const sql = `SELECT * FROM orders WHERE order_id = ?`;
        const [result] = await pool.query(sql, [order_id]);
        return result;
    }
    async updateStatus(order_id, statusType, status) {
        const sql = `UPDATE orders SET ${statusType} = ? WHERE order_id = ?`;
        const [result] = await pool.query(sql, [status, order_id]);
        return result;
    }

    async getOrdersWithDetailsByUserId(user_id) {
        const sql = `
            SELECT 
                o.order_id,
                o.order_date,
                o.total_amount,
                o.shipping_method,
                o.shipping_cost,
                o.order_status,
                oi.product_id,
                p.product_name,
                p.image_url,
                p.description AS product_description,
                oi.quantity,
                oi.price AS product_price
            FROM
                orders o
            INNER JOIN
                order_items oi ON o.order_id = oi.order_id
            INNER JOIN
                products p ON oi.product_id = p.product_id
            WHERE
                o.user_id = ?
        `;

        const [result] = await pool.query(sql, [user_id]);
        return result;
    }

    async deleteOrder(order_id) {
        // ลบรายการสินค้าที่เกี่ยวข้องใน order_items ก่อน
        const deleteOrderItemsSql = `DELETE FROM order_items WHERE order_id = ?`;
        await pool.query(deleteOrderItemsSql, [order_id]);

        // ลบข้อมูลการชำระเงินใน payments (ถ้ามี)
        const deletePaymentSql = `DELETE FROM payments WHERE order_id = ?`;
        await pool.query(deletePaymentSql, [order_id]);

        // ลบข้อมูลออเดอร์ในตาราง orders
        const deleteOrderSql = `DELETE FROM orders WHERE order_id = ?`;
        await pool.query(deleteOrderSql, [order_id]);
    }
    async countOrders() {
        const sql = `SELECT COUNT(*) as count FROM orders`;
        const [result] = await pool.query(sql);
        return result[0].count;
    }
    async getAllOrders() {
        const sql = `
            SELECT orders.order_id AS id, 
                   users.username AS customer, 
                   orders.order_date, 
                   payments.payment_method, 
                   payments.payment_proof, 
                   payments.payment_status, 
                   orders.order_status 
            FROM orders
            JOIN users ON orders.user_id = users.user_id
            LEFT JOIN payments ON orders.order_id = payments.order_id;
        `;
        const [rows] = await pool.query(sql);
        return rows;
    }
    async updateOrderStatus(order_id, status) {
        const sql = `UPDATE orders SET order_status = ? WHERE order_id = ?`;
        const [result] = await pool.query(sql, [status, order_id]);
        return result;
    }

}
