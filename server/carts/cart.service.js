import { pool } from '../database.js';

export default class CartService {
    async createCart(userId) {
        const sql = `INSERT INTO carts (user_id, status) VALUES (?, 'active')`;
        const [result] = await pool.query(sql, [userId]);
        return result.insertId;
    }

    async getActiveCart(userId) {
        const sql = `SELECT * FROM carts WHERE user_id = ? AND status = 'active' LIMIT 1`;
        const [result] = await pool.query(sql, [userId]);
        return result.length ? result[0] : null;
    }

    async addItemToCart(cartId, productId, quantity, price) {
        const sql = `
            INSERT INTO cart_items (cart_id, product_id, quantity, price)
            VALUES (?, ?, ?, ?)
            ON DUPLICATE KEY UPDATE quantity = quantity + VALUES(quantity)
        `;
        await pool.query(sql, [cartId, productId, quantity, price]);
    }

    async getCartItems(cartId) {
        const sql = `
            SELECT ci.cart_item_id, ci.product_id, ci.quantity, ci.price,
                p.product_name AS name, p.image_url AS image
            FROM cart_items ci
            JOIN products p ON ci.product_id = p.product_id
            WHERE ci.cart_id = ?
        `;
        const [result] = await pool.query(sql, [cartId]);
        return result;
    }

    async clearCart(cartId) {
        const sql = `DELETE FROM cart_items WHERE cart_id = ?`;
        await pool.query(sql, [cartId]);
    }

    async completeCart(cartId) {
        const sql = `UPDATE carts SET status = 'completed' WHERE cart_id = ?`;
        await pool.query(sql, [cartId]);
    }

    async removeItemFromCart(cartId, productId) {
        const sql = `DELETE FROM cart_items WHERE cart_id = ? AND product_id = ?`;
        await pool.query(sql, [cartId, productId]);
    }
}
