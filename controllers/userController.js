import Store from '../models/store.js';
import Rating from '../models/rating.js';

class UserController {
  static async getStores(req, res) {
    try {
      const { name, address, sortField, sortDirection } = req.query;
      const userId = req.user.id;

      const filters = {};
      if (name) filters.name = name;
      if (address) filters.address = address;

      const sort = {};
      if (sortField) {
        sort.field = sortField;
        sort.direction = sortDirection;
      }

      const stores = await Store.getAll(filters, sort);

      // Get user's ratings for each store
      const storesWithUserRatings = await Promise.all(
        stores.map(async (store) => {
          const userRating = await Rating.getUserRating(userId, store.id);
          return {
            ...store,
            userRating: userRating ? userRating.rating : null
          };
        })
      );

      res.json({ stores: storesWithUserRatings });
    } catch (error) {
      console.error('Get stores error:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  static async submitRating(req, res) {
    try {
      const { storeId, rating } = req.body;
      const userId = req.user.id;

      await Rating.create({
        user_id: userId,
        store_id: storeId,
        rating
      });

      res.json({ message: 'Rating submitted successfully' });
    } catch (error) {
      console.error('Submit rating error:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }
}

export default UserController;

