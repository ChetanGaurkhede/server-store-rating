// routes/userRoutes.js
import express from 'express';
import UserController from '../controllers/userController.js';
import { authenticateToken, requireRole } from '../middlewares/auth.js';
import { ratingValidationRules, handleValidationErrors } from '../middlewares/validation.js';

const router = express.Router();

router.use(authenticateToken);
router.use(requireRole(['user']));

router.get('/stores', UserController.getStores);

router.post('/ratings', 
  ratingValidationRules(),
  handleValidationErrors,
  UserController.submitRating
);

export default router;
