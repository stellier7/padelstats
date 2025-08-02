import { Request, Response } from 'express';
import { EventService } from '../services/eventService';

export class EventController {
  static async recordEvent(req: Request, res: Response) {
    try {
      const { matchId, playerId, eventType, additionalData } = req.body;

      if (!req.user) {
        return res.status(401).json({
          success: false,
          error: 'User not authenticated'
        });
      }

      const result = await EventService.recordEvent({
        matchId,
        playerId,
        eventType,
        observerId: req.user.id,
        additionalData
      });

      if (!result.success) {
        return res.status(400).json(result);
      }

      return res.status(201).json(result);

    } catch (error) {
      console.error('Record event controller error:', error);
      return res.status(500).json({
        success: false,
        error: 'Internal server error'
      });
    }
  }

  static async getMatchEvents(req: Request, res: Response) {
    try {
      const { matchId } = req.params;

      const result = await EventService.getMatchEvents(matchId);

      if (!result.success) {
        return res.status(404).json(result);
      }

      return res.status(200).json(result);

    } catch (error) {
      console.error('Get match events controller error:', error);
      return res.status(500).json({
        success: false,
        error: 'Internal server error'
      });
    }
  }

  static async getPlayerStats(req: Request, res: Response) {
    try {
      const { matchId } = req.params;

      const result = await EventService.getPlayerStats(matchId);

      if (!result.success) {
        return res.status(404).json(result);
      }

      return res.status(200).json(result);

    } catch (error) {
      console.error('Get player stats controller error:', error);
      return res.status(500).json({
        success: false,
        error: 'Internal server error'
      });
    }
  }

  static async calculateMatchStats(req: Request, res: Response) {
    try {
      const { matchId } = req.params;

      const result = await EventService.calculateMatchStats(matchId);

      if (!result.success) {
        return res.status(404).json(result);
      }

      return res.status(200).json(result);

    } catch (error) {
      console.error('Calculate match stats controller error:', error);
      return res.status(500).json({
        success: false,
        error: 'Internal server error'
      });
    }
  }
}
