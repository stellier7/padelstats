import { Router } from 'express';
import { MatchController } from '../controllers/matchController';
import { authenticateToken } from '../middleware/auth';
import { validateRequest, matchValidation } from '../middleware/validation';

const router = Router();

// All match routes require authentication
router.use(authenticateToken);

// Create new match
router.post('/', 
  validateRequest(matchValidation.create),
  MatchController.createMatch
);

// Get all matches
router.get('/', MatchController.getAllMatches);

// Get matches by status
router.get('/status/:status', MatchController.getMatchesByStatus);

// Get matches by type
router.get('/type/:type', MatchController.getMatchesByType);

// Get specific match
router.get('/:id', MatchController.getMatch);

// Update match
router.put('/:id',
  validateRequest(matchValidation.update),
  MatchController.updateMatch
);

// Complete match
router.patch('/:id/complete', MatchController.completeMatch);

// Delete match
router.delete('/:id', MatchController.deleteMatch);

export default router; 