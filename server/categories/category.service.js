import { pool } from '../database.js';

export default class CategoryService {
    async getCategories() {
        let sql = `SELECT * FROM categories`;
        const [result] = await pool.query(sql);
        return result;
    }
    async getCategoryById(category_id) {
        let sql = `SELECT category_name FROM categories WHERE category_id = ?`;
        const [result] = await pool.query(sql, [category_id]);
        return result;
    }
    async insertCategory(category) {
        let sql = `INSERT INTO categories SET ?`;
        const [result] = await pool.query(sql, category);
        return result;
    }
    async updateCategory(category_id, category) {
        let sql = `UPDATE categories SET ? WHERE category_id = ?`;
        const [result] = await pool.query(sql, [category, category_id]);
        return result;
    }
    async deleteCategory(category_id) {
        let sql = `DELETE FROM categories WHERE category_id = ?`;
        const [result] = await pool.query(sql, [category_id]);
        return result;
    }
}
