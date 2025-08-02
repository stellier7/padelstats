import { Router } from 'express';
import { EventController } from '../controllers/eventController';
import { authenticateToken } from '../middleware/auth';
import { validateRequest, eventValidation } from '../middleware/validation';

const router = Router();

// All event routes require authentication
router.use(authenticateToken);

// Record new event
router.post('/', 
  validateRequest(eventValidation.create),
  EventController.recordEvent
);

// Get events for a match
router.get('/match/:matchId', EventController.getMatchEvents);

// Get player stats for a match
router.get('/stats/:matchId', EventController.getPlayerStats);

// Calculate live match stats
router.get('/calculate/:matchId', EventController.calculateMatchStats);

export default router;
