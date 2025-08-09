import pool from "../config/config.js";

class Store {
  static async create(storeData) {
    const { name, email, address, owner_id } = storeData;

    const [result] = await pool.execute(
      'INSERT INTO stores (name, email, address, owner_id) VALUES (?, ?, ?, ?)',
      [name, email, address, owner_id]
    );

    return result.insertId;
  }

  static async getAll(filters = {}, sort = {}) {
    let query = `
      SELECT s.*, u.name as owner_name 
      FROM stores s 
      LEFT JOIN users u ON s.owner_id = u.id 
      WHERE 1=1
    `;
    const params = [];

    // Apply filters
    if (filters.name) {
      query += ' AND s.name LIKE ?';
      params.push(`%${filters.name}%`);
    }
    if (filters.email) {
      query += ' AND s.email LIKE ?';
      params.push(`%${filters.email}%`);
    }
    if (filters.address) {
      query += ' AND s.address LIKE ?';
      params.push(`%${filters.address}%`);
    }

    // Apply sorting
    if (sort.field) {
      const allowedFields = ['name', 'email', 'address', 'avg_rating', 'created_at'];
      if (allowedFields.includes(sort.field)) {
        query += ` ORDER BY s.${sort.field} ${sort.direction === 'desc' ? 'DESC' : 'ASC'}`;
      }
    }

    const [rows] = await pool.execute(query, params);
    return rows;
  }

  static async findById(id) {
    const [rows] = await pool.execute(
      'SELECT s.*, u.name as owner_name FROM stores s LEFT JOIN users u ON s.owner_id = u.id WHERE s.id = ?',
      [id]
    );
    return rows[0];
  }

  static async findByOwnerId(ownerId) {
    const [rows] = await pool.execute(
      'SELECT * FROM stores WHERE owner_id = ?',
      [ownerId]
    );
    return rows[0];
  }

  static async getStats() {
    const [result] = await pool.execute('SELECT COUNT(*) as total FROM stores');
    return result[0].total;
  }
}

export default Store;