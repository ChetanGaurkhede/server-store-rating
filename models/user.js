import pool from "../config/config.js";
import bcrypt from 'bcryptjs';
class User {
  static async create(userData) {
    const { name, email, password, address, role = 'user' } = userData;
    
    const hashedPassword = await bcrypt.hash(password, 10);
    
    const [result] = await pool.execute(
      'INSERT INTO users (name, email, password, address, role) VALUES (?, ?, ?, ?, ?)',
      [name, email, hashedPassword, address, role]
    );
    
    return result.insertId;
  }

  static async findByEmail(email) {
    const [rows] = await pool.execute(
      'SELECT * FROM users WHERE email = ?',
      [email]
    );
    return rows[0];
  }

  static async findById(id) {
    const [rows] = await pool.execute(
      'SELECT id, name, email, address, role, created_at FROM users WHERE id = ?',
      [id]
    );
    return rows[0];
  }

  static async getAll(filters = {}, sort = {}) {
    let query = 'SELECT id, name, email, address, role, created_at FROM users WHERE 1=1';
    const params = [];

    // Apply filters
    if (filters.name) {
      query += ' AND name LIKE ?';
      params.push(`%${filters.name}%`);
    }
    if (filters.email) {
      query += ' AND email LIKE ?';
      params.push(`%${filters.email}%`);
    }
    if (filters.address) {
      query += ' AND address LIKE ?';
      params.push(`%${filters.address}%`);
    }
    if (filters.role) {
      query += ' AND role = ?';
      params.push(filters.role);
    }

    // Apply sorting
    if (sort.field) {
      const allowedFields = ['name', 'email', 'address', 'role', 'created_at'];
      if (allowedFields.includes(sort.field)) {
        query += ` ORDER BY ${sort.field} ${sort.direction === 'desc' ? 'DESC' : 'ASC'}`;
      }
    }

    const [rows] = await pool.execute(query, params);
    return rows;
  }

  static async updatePassword(userId, newPassword) {
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    
    const [result] = await pool.execute(
      'UPDATE users SET password = ? WHERE id = ?',
      [hashedPassword, userId]
    );
    
    return result.affectedRows > 0;
  }

  static async validatePassword(plainPassword, hashedPassword) {
    return await bcrypt.compare(plainPassword, hashedPassword);
  }

  static async getStats() {
  const [result] = await pool.execute(
    "SELECT COUNT(*) as total FROM users WHERE role IN ('user', 'store_owner')"
  );
  return result[0].total;
}

}

export default User;