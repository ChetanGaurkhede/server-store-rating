// routes/storeOwnerRoutes.js
import express from 'express';
import StoreOwnerController from '../controllers/storeOwnerController.js';
import { authenticateToken, requireRole } from '../middlewares/auth.js';

const router = express.Router();
router.use(authenticateToken);
router.use(requireRole(['store_owner']));

router.get('/dashboard', StoreOwnerController.getDashboard);

export default router;