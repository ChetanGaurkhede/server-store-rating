
import express from 'express';
import AdminController from '../controllers/adminController.js'
import { authenticateToken, requireRole } from '../middlewares/auth.js'
import {
  userValidationRules,
  storeValidationRules,
  handleValidationErrors
} from '../middlewares/validation.js'


const router = express.Router();

// Apply authentication and admin role requirement to all routes
router.use(authenticateToken);
router.use(requireRole(['admin']));

router.get('/dashboard', AdminController.getDashboardStats);

router.post('/users',
  userValidationRules(),
  handleValidationErrors,
  AdminController.createUser
);

router.post('/stores',
  storeValidationRules(),
  handleValidationErrors,
  AdminController.createStore
);

router.get('/users', AdminController.getUsers);
router.get('/stores', AdminController.getStores);

export default router;