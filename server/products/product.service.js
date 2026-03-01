import { pool } from '../database.js';

export default class ProductService {
    async getProducts() {
        const sql = `SELECT p.*, b.brand_name FROM products p JOIN brands b ON p.brand_id = b.brand_id`;
        const [result] = await pool.query(sql);
        return result;
    }

    async getProductById(product_id) {
        const sql = `
            SELECT p.*, b.brand_name
            FROM products p
            LEFT JOIN brands b ON p.brand_id = b.brand_id
            WHERE p.product_id = ?`;
        const [result] = await pool.query(sql, [product_id]);
        return result[0]; // ส่งคืนข้อมูลผลิตภัณฑ์แรกที่ตรงกัน
    }

    async insertProduct(product) {
        const sql = `INSERT INTO products SET ?`;
        const [result] = await pool.query(sql, product);
        return result;
    }

    async updateProduct(product_id, product) {
        const sql = `UPDATE products SET ? WHERE product_id = ?`;
        const [result] = await pool.query(sql, [product, product_id]);
        return result;
    }
    async deleteProduct(product_id) {
        const sql = `DELETE FROM products WHERE product_id = ?`;
        const [result] = await pool.query(sql, [product_id]);
        return result;
    }
    async searchProducts(query) {
        const likeQuery = `%${query}%`;
        const sql = `
            SELECT p.*, c.category_name, b.brand_name
            FROM products p
            LEFT JOIN categories c ON p.category_id = c.category_id
            LEFT JOIN brands b ON p.brand_id = b.brand_id
            WHERE p.product_name LIKE ? OR c.category_name LIKE ? OR b.brand_name LIKE ?`;
        const [result] = await pool.query(sql, [likeQuery, likeQuery, likeQuery]);
        return result;
    }

    async countProducts() {
        const sql = `SELECT COUNT(*) AS total_products FROM products`;
        const [result] = await pool.query(sql);
        return result[0].total_products;
    }
}
