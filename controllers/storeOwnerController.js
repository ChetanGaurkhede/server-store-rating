import Store from "../models/store.js";
import Rating from "../models/rating.js"
class StoreOwnerController {
  static async getDashboard(req, res) {
    try {
      const ownerId = req.user.id;

      // Find store owned by this user
      const store = await Store.findByOwnerId(ownerId);
      if (!store) {
        return res.status(404).json({ error: 'No store found for this owner' });
      }

      // Get ratings for the store
      const ratings = await Rating.getStoreRatings(store.id);

      res.json({
        store: {
          id: store.id,
          name: store.name,
          averageRating: store.avg_rating,
          totalRatings: store.total_ratings
        },
        ratings
      });
    } catch (error) {
      console.error('Store owner dashboard error:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }
}

export default StoreOwnerController;