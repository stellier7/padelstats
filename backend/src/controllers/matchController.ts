import { Request, Response } from 'express';
import { MatchService } from '../services/matchService';
import { MatchType, MatchStatus } from '@prisma/client';

export class MatchController {
  static async createMatch(req: Request, res: Response) {
    try {
      const { type, phase, playerIds, tournamentId } = req.body;

      const result = await MatchService.createMatch({
        type,
        phase,
        playerIds,
        tournamentId
      });

      if (!result.success) {
        return res.status(400).json(result);
      }

      return res.status(201).json(result);

    } catch (error) {
      console.error('Create match controller error:', error);
      return res.status(500).json({
        success: false,
        error: 'Internal server error'
      });
    }
  }

  static async getMatch(req: Request, res: Response) {
    try {
      const { id } = req.params;

      const result = await MatchService.getMatch(id);

      if (!result.success) {
        return res.status(404).json(result);
      }

      return res.status(200).json(result);

    } catch (error) {
      console.error('Get match controller error:', error);
      return res.status(500).json({
        success: false,
        error: 'Internal server error'
      });
    }
  }

  static async getAllMatches(req: Request, res: Response) {
    try {
      const result = await MatchService.getAllMatches();

      if (!result.success) {
        return res.status(500).json(result);
      }

      return res.status(200).json(result);

    } catch (error) {
      console.error('Get all matches controller error:', error);
      return res.status(500).json({
        success: false,
        error: 'Internal server error'
      });
    }
  }

  static async getMatchesByStatus(req: Request, res: Response) {
    try {
      const { status } = req.params;

      if (!Object.values(MatchStatus).includes(status as MatchStatus)) {
        return res.status(400).json({
          success: false,
          error: 'Invalid match status'
        });
      }

      const result = await MatchService.getMatchesByStatus(status as MatchStatus);

      if (!result.success) {
        return res.status(500).json(result);
      }

      return res.status(200).json(result);

    } catch (error) {
      console.error('Get matches by status controller error:', error);
      return res.status(500).json({
        success: false,
        error: 'Internal server error'
      });
    }
  }

  static async getMatchesByType(req: Request, res: Response) {
    try {
      const { type } = req.params;

      if (!Object.values(MatchType).includes(type as MatchType)) {
        return res.status(400).json({
          success: false,
          error: 'Invalid match type'
        });
      }

      const result = await MatchService.getMatchesByType(type as MatchType);

      if (!result.success) {
        return res.status(500).json(result);
      }

      return res.status(200).json(result);

    } catch (error) {
      console.error('Get matches by type controller error:', error);
      return res.status(500).json({
        success: false,
        error: 'Internal server error'
      });
    }
  }

  static async updateMatch(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const { status, phase } = req.body;

      const result = await MatchService.updateMatch(id, {
        status,
        phase
      });

      if (!result.success) {
        return res.status(400).json(result);
      }

      return res.status(200).json(result);

    } catch (error) {
      console.error('Update match controller error:', error);
      return res.status(500).json({
        success: false,
        error: 'Internal server error'
      });
    }
  }

  static async completeMatch(req: Request, res: Response) {
    try {
      const { id } = req.params;

      const result = await MatchService.completeMatch(id);

      if (!result.success) {
        return res.status(400).json(result);
      }

      return res.status(200).json(result);

    } catch (error) {
      console.error('Complete match controller error:', error);
      return res.status(500).json({
        success: false,
        error: 'Internal server error'
      });
    }
  }

  static async deleteMatch(req: Request, res: Response) {
    try {
      const { id } = req.params;

      const result = await MatchService.deleteMatch(id);

      if (!result.success) {
        return res.status(404).json(result);
      }

      return res.status(200).json(result);

    } catch (error) {
      console.error('Delete match controller error:', error);
      return res.status(500).json({
        success: false,
        error: 'Internal server error'
      });
    }
  }
} 