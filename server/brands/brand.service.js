import { pool } from '../database.js';

export default class BrandService {
    async getBrands() {
        let sql = `SELECT * FROM brands`;
        const [result] = await pool.query(sql);
        return result;
    }
    async getBrandById(brand_id) {
        let sql = `SELECT * FROM brands WHERE brand_id = ?`;
        const [result] = await pool.query(sql, [brand_id]);
        return result;
    }
    async insertBrand(brand) {
        let sql = `INSERT INTO brands SET ?`;
        const [result] = await pool.query(sql, brand);
        return result;
    }
    async updateBrand(brand_id, brand) {
        let sql = `UPDATE brands SET ? WHERE brand_id = ?`;
        const [result] = await pool.query(sql, [brand, brand_id]);
        return result;
    }
    async deleteBrand(brand_id) {
        // ลบสินค้าที่เกี่ยวข้องในตาราง products ก่อน
        const deleteProductsSql = `DELETE FROM products WHERE brand_id = ?`;
        await pool.query(deleteProductsSql, [brand_id]);

        // ลบแบรนด์ในตาราง brands
        const deleteBrandSql = `DELETE FROM brands WHERE brand_id = ?`;
        await pool.query(deleteBrandSql, [brand_id]);
    }
    async countBrands() {
        const sql = `SELECT COUNT(*) as count FROM brands`;
        const [result] = await pool.query(sql);
        return result[0].count;
    }

}
