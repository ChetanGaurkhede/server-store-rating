import pool from "../config/config.js";

class Rating {
  static async create(ratingData) {
    const { user_id, store_id, rating } = ratingData;

    // Use INSERT ... ON DUPLICATE KEY UPDATE to handle existing ratings
    const [result] = await pool.execute(`
      INSERT INTO ratings (user_id, store_id, rating) 
      VALUES (?, ?, ?) 
      ON DUPLICATE KEY UPDATE rating = VALUES(rating)
    `, [user_id, store_id, rating]);

    return result.insertId || result.affectedRows;
  }

  static async getUserRating(userId, storeId) {
    const [rows] = await pool.execute(
      'SELECT rating FROM ratings WHERE user_id = ? AND store_id = ?',
      [userId, storeId]
    );
    return rows[0];
  }

  static async getStoreRatings(storeId) {
    const [rows] = await pool.execute(`
      SELECT r.rating, r.created_at, u.name as user_name, u.email as user_email
      FROM ratings r 
      JOIN users u ON r.user_id = u.id 
      WHERE r.store_id = ? 
      ORDER BY r.created_at DESC
    `, [storeId]);
    return rows;
  }

  static async getStats() {
    const [result] = await pool.execute('SELECT COUNT(*) as total FROM ratings');
    return result[0].total;
  }
}

export default Rating;