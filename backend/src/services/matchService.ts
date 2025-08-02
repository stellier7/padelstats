import { matchQueries, userQueries } from '../utils/databaseQueries';
import { MatchType, MatchStatus, TournamentPhase } from '@prisma/client';

export interface CreateMatchData {
  type: MatchType;
  phase?: TournamentPhase;
  playerIds: string[];
  tournamentId?: string;
}

export interface UpdateMatchData {
  status?: MatchStatus;
  phase?: TournamentPhase;
}

export interface MatchResponse {
  success: boolean;
  data?: any;
  error?: string;
}

export class MatchService {
  static async createMatch(data: CreateMatchData): Promise<MatchResponse> {
    try {
      // Validate that all players exist
      const players = await Promise.all(
        data.playerIds.map(id => userQueries.findById(id))
      );

      const validPlayers = players.filter(p => p !== null);
      if (validPlayers.length !== 4) {
        return {
          success: false,
          error: 'All 4 players must be valid users'
        };
      }

      // Create match
      const match = await matchQueries.create({
        type: data.type,
        phase: data.phase,
        tournamentId: data.tournamentId,
        status: 'IN_PROGRESS'
      });

      if (!match) {
        return {
          success: false,
          error: 'Failed to create match'
        };
      }

      // Add players to match
      const matchPlayers = await Promise.all([
        // Team 1
        matchQueries.addPlayer(match.id, data.playerIds[0], 1, 1),
        matchQueries.addPlayer(match.id, data.playerIds[1], 1, 2),
        // Team 2
        matchQueries.addPlayer(match.id, data.playerIds[2], 2, 1),
        matchQueries.addPlayer(match.id, data.playerIds[3], 2, 2)
      ]);

      // Get match with all details
      const matchWithDetails = await matchQueries.findByIdWithDetails(match.id);

      return {
        success: true,
        data: matchWithDetails
      };

    } catch (error) {
      console.error('Create match error:', error);
      return {
        success: false,
        error: 'Failed to create match'
      };
    }
  }

  static async getMatch(matchId: string): Promise<MatchResponse> {
    try {
      const match = await matchQueries.findByIdWithDetails(matchId);

      if (!match) {
        return {
          success: false,
          error: 'Match not found'
        };
      }

      return {
        success: true,
        data: match
      };

    } catch (error) {
      console.error('Get match error:', error);
      return {
        success: false,
        error: 'Failed to get match'
      };
    }
  }

  static async getAllMatches(): Promise<MatchResponse> {
    try {
      const matches = await matchQueries.findAll();

      return {
        success: true,
        data: matches
      };

    } catch (error) {
      console.error('Get all matches error:', error);
      return {
        success: false,
        error: 'Failed to get matches'
      };
    }
  }

  static async getMatchesByStatus(status: MatchStatus): Promise<MatchResponse> {
    try {
      const matches = await matchQueries.findByStatus(status);

      return {
        success: true,
        data: matches
      };

    } catch (error) {
      console.error('Get matches by status error:', error);
      return {
        success: false,
        error: 'Failed to get matches'
      };
    }
  }

  static async getMatchesByType(type: MatchType): Promise<MatchResponse> {
    try {
      const matches = await matchQueries.findByType(type);

      return {
        success: true,
        data: matches
      };

    } catch (error) {
      console.error('Get matches by type error:', error);
      return {
        success: false,
        error: 'Failed to get matches'
      };
    }
  }

  static async updateMatch(matchId: string, data: UpdateMatchData): Promise<MatchResponse> {
    try {
      const match = await matchQueries.findById(matchId);

      if (!match) {
        return {
          success: false,
          error: 'Match not found'
        };
      }

      const updatedMatch = await matchQueries.update(matchId, data);

      return {
        success: true,
        data: updatedMatch
      };

    } catch (error) {
      console.error('Update match error:', error);
      return {
        success: false,
        error: 'Failed to update match'
      };
    }
  }

  static async completeMatch(matchId: string): Promise<MatchResponse> {
    try {
      const match = await matchQueries.findById(matchId);

      if (!match) {
        return {
          success: false,
          error: 'Match not found'
        };
      }

      if (match.status === 'COMPLETED') {
        return {
          success: false,
          error: 'Match is already completed'
        };
      }

      const updatedMatch = await matchQueries.update(matchId, {
        status: 'COMPLETED'
      });

      return {
        success: true,
        data: updatedMatch
      };

    } catch (error) {
      console.error('Complete match error:', error);
      return {
        success: false,
        error: 'Failed to complete match'
      };
    }
  }

  static async deleteMatch(matchId: string): Promise<MatchResponse> {
    try {
      const match = await matchQueries.findById(matchId);

      if (!match) {
        return {
          success: false,
          error: 'Match not found'
        };
      }

      await matchQueries.delete(matchId);

      return {
        success: true,
        data: { message: 'Match deleted successfully' }
      };

    } catch (error) {
      console.error('Delete match error:', error);
      return {
        success: false,
        error: 'Failed to delete match'
      };
    }
  }
} 