import { Router } from 'express';
import { AuthController } from '../controllers/authController';
import { authenticateToken } from '../middleware/auth';
import { validateRequest, authValidation } from '../middleware/validation';

const router = Router();

// Public routes
router.post('/register', 
  validateRequest(authValidation.register),
  AuthController.register
);

router.post('/login', 
  validateRequest(authValidation.login),
  AuthController.login
);

// Protected routes
router.get('/me', 
  authenticateToken,
  AuthController.getCurrentUser
);

router.post('/change-password',
  authenticateToken,
  AuthController.changePassword
);

router.get('/validate',
  authenticateToken,
  AuthController.validateToken
);

export default router; 