import User from '../models/user.js';
import Store from '../models/store.js';
import Rating from '../models/rating.js';

class AdminController {
  static async getDashboardStats(req, res) {
    try {
      const [totalUsers, totalStores, totalRatings] = await Promise.all([
        User.getStats(),
        Store.getStats(),
        Rating.getStats()
      ]);

      res.json({
        totalUsers,
        totalStores,
        totalRatings
      });
    } catch (error) {
      console.error('Dashboard stats error:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  static async createUser(req, res) {
    try {
      const { name, email, password, address, role } = req.body;

      // Check if user already exists
      const existingUser = await User.findByEmail(email);
      if (existingUser) {
        return res.status(409).json({ error: 'User already exists with this email' });
      }

      const userId = await User.create({ name, email, password, address, role });
      const user = await User.findById(userId);

      res.status(201).json({
        message: 'User created successfully',
        user
      });
    } catch (error) {
      console.error('User creation error:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  static async createStore(req, res) {
    try {
      const { name, email, address, owner_email } = req.body;

      let owner_id = null;
      if (owner_email) {
        const owner = await User.findByEmail(owner_email);
        if (!owner) {
          return res.status(400).json({ error: 'Store owner not found' });
        }
        owner_id = owner.id;
      }

      const storeId = await Store.create({ name, email, address, owner_id });
      const store = await Store.findById(storeId);

      res.status(201).json({
        message: 'Store created successfully',
        store
      });
    } catch (error) {
      console.error('Store creation error:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  static async getUsers(req, res) {
    try {
      const { name, email, address, role, sortField, sortDirection } = req.query;

      const filters = {};
      if (name) filters.name = name;
      if (email) filters.email = email;
      if (address) filters.address = address;
      if (role) filters.role = role;

      const sort = {};
      if (sortField) {
        sort.field = sortField;
        sort.direction = sortDirection;
      }

      const users = await User.getAll(filters, sort);

      res.json({ users });
    } catch (error) {
      console.error('Get users error:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  static async getStores(req, res) {
    try {
      const { name, email, address, sortField, sortDirection } = req.query;

      const filters = {};
      if (name) filters.name = name;
      if (email) filters.email = email;
      if (address) filters.address = address;

      const sort = {};
      if (sortField) {
        sort.field = sortField;
        sort.direction = sortDirection;
      }

      const stores = await Store.getAll(filters, sort);

      res.json({ stores });
    } catch (error) {
      console.error('Get stores error:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }
}

export default AdminController;
