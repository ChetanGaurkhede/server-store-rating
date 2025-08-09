// routes/authRoutes.js

import express from 'express';
import AuthController from '../controllers/authController.js'
import { authenticateToken } from '../middlewares/auth.js';

import {
  userValidationRules,
  passwordValidationRules,
  handleValidationErrors
} from '../middlewares/validation.js';

const router = express.Router();


router.post('/register',
  userValidationRules(),
  handleValidationErrors,
  AuthController.register
);

router.post('/login', AuthController.login);

router.put('/password',
  authenticateToken,
  passwordValidationRules(),
  handleValidationErrors,
  AuthController.updatePassword
);

export default router;