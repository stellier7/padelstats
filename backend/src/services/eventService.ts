import { eventQueries, matchQueries, statsQueries } from '../utils/databaseQueries';
import { EventType } from '@prisma/client';

export interface CreateEventData {
  matchId: string;
  playerId: string;
  eventType: EventType;
  observerId: string;
  additionalData?: {
    serveType?: 'FIRST' | 'SECOND';
    pointType?: 'WON' | 'LOST';
    errorType?: 'UNFORCED' | 'FORCED' | 'NET' | 'RETURN' | 'SMASH' | 'LOB';
    exit34?: boolean;
    returnPoint?: boolean;
  };
}

export interface EventResponse {
  success: boolean;
  data?: any;
  error?: string;
}

export interface MatchStats {
  playerId: string;
  playerName: string;
  firstServePercentage: number;
  pointsWonFirstServe: number;
  pointsWonSecondServe: number;
  unforcedErrors: number;
  forcedErrors: number;
  netErrors: number;
  returnErrors: number;
  smashErrors: number;
  lobErrors: number;
  pointsWonExit34: number;
  pointsLostExit34: number;
  pointsWonReturn: number;
  totalPoints: number;
  totalServes: number;
}

export class EventService {
  static async recordEvent(data: CreateEventData): Promise<EventResponse> {
    try {
      // Verify match exists and is in progress
      const match = await matchQueries.findById(data.matchId);
      if (!match) {
        return {
          success: false,
          error: 'Match not found'
        };
      }

      if (match.status === 'COMPLETED') {
        return {
          success: false,
          error: 'Cannot record events for completed match'
        };
      }

      // Create the event
      const event = await eventQueries.create({
        matchId: data.matchId,
        playerId: data.playerId,
        eventType: data.eventType,
        observerId: data.observerId,
        additionalData: data.additionalData
      });

      if (!event) {
        return {
          success: false,
          error: 'Failed to create event'
        };
      }

      // Update player statistics based on event type
      await this.updatePlayerStats(data.matchId, data.playerId, data.eventType, data.additionalData);

      return {
        success: true,
        data: event
      };

    } catch (error) {
      console.error('Record event error:', error);
      return {
        success: false,
        error: 'Failed to record event'
      };
    }
  }

  static async getMatchEvents(matchId: string): Promise<EventResponse> {
    try {
      const events = await eventQueries.findByMatchId(matchId);
      return {
        success: true,
        data: events
      };
    } catch (error) {
      console.error('Get match events error:', error);
      return {
        success: false,
        error: 'Failed to get match events'
      };
    }
  }

  static async getPlayerStats(matchId: string): Promise<EventResponse> {
    try {
      const stats = await statsQueries.getMatchStats(matchId);
      return {
        success: true,
        data: stats
      };
    } catch (error) {
      console.error('Get player stats error:', error);
      return {
        success: false,
        error: 'Failed to get player stats'
      };
    }
  }

  static async calculateMatchStats(matchId: string): Promise<EventResponse> {
    try {
      const events = await eventQueries.findByMatchId(matchId);
      const match = await matchQueries.findByIdWithDetails(matchId);

      if (!match) {
        return {
          success: false,
          error: 'Match not found'
        };
      }

      const playerStats: { [key: string]: MatchStats } = {};

      // Initialize stats for all players
      match.players.forEach(player => {
        playerStats[player.userId] = {
          playerId: player.userId,
          playerName: `${player.user.firstName} ${player.user.lastName}`,
          firstServePercentage: 0,
          pointsWonFirstServe: 0,
          pointsWonSecondServe: 0,
          unforcedErrors: 0,
          forcedErrors: 0,
          netErrors: 0,
          returnErrors: 0,
          smashErrors: 0,
          lobErrors: 0,
          pointsWonExit34: 0,
          pointsLostExit34: 0,
          pointsWonReturn: 0,
          totalPoints: 0,
          totalServes: 0
        };
      });

      // Calculate stats from events
      events.forEach(event => {
        const stats = playerStats[event.playerId];
        if (!stats) return;

        const additionalData = event.additionalData as any;

        switch (event.eventType) {
          case 'FIRST_SERVE_IN':
            stats.totalServes++;
            stats.firstServePercentage = (stats.totalServes / stats.totalServes) * 100;
            break;
          case 'SECOND_SERVE_IN':
            stats.totalServes++;
            break;
          case 'POINT_WON':
            stats.totalPoints++;
            if (additionalData?.serveType === 'FIRST') {
              stats.pointsWonFirstServe++;
            } else if (additionalData?.serveType === 'SECOND') {
              stats.pointsWonSecondServe++;
            }
            if (additionalData?.exit34) {
              stats.pointsWonExit34++;
            }
            if (additionalData?.returnPoint) {
              stats.pointsWonReturn++;
            }
            break;
          case 'POINT_LOST':
            stats.totalPoints++;
            if (additionalData?.exit34) {
              stats.pointsLostExit34++;
            }
            break;
          case 'UNFORCED_ERROR':
            stats.unforcedErrors++;
            break;
          case 'FORCED_ERROR':
            stats.forcedErrors++;
            break;
          case 'NET_ERROR':
            stats.netErrors++;
            break;
          case 'RETURN_ERROR':
            stats.returnErrors++;
            break;
          case 'SMASH_ERROR':
            stats.smashErrors++;
            break;
          case 'LOB_ERROR':
            stats.lobErrors++;
            break;
        }
      });

      return {
        success: true,
        data: Object.values(playerStats)
      };

    } catch (error) {
      console.error('Calculate match stats error:', error);
      return {
        success: false,
        error: 'Failed to calculate match stats'
      };
    }
  }

  private static async updatePlayerStats(
    matchId: string,
    playerId: string,
    eventType: EventType,
    additionalData?: any
  ) {
    try {
      // Get or create player stats
      let playerStats = await statsQueries.findByPlayerAndMatch(playerId, matchId);
      
      if (!playerStats) {
        playerStats = await statsQueries.create({
          userId: playerId,
          matchId: matchId,
          firstServePercentage: 0,
          pointsWonFirstServe: 0,
          pointsWonSecondServe: 0,
          unforcedErrors: 0,
          forcedErrors: 0,
          netErrors: 0,
          returnErrors: 0,
          smashErrors: 0,
          lobErrors: 0,
          pointsWonExit34: 0,
          pointsLostExit34: 0,
          pointsWonReturn: 0
        });
      }

      // Update stats based on event type
      const updates: any = {};

      switch (eventType) {
        case 'FIRST_SERVE_IN':
          updates.firstServePercentage = playerStats.firstServePercentage + 1;
          break;
        case 'POINT_WON':
          if (additionalData?.serveType === 'FIRST') {
            updates.pointsWonFirstServe = playerStats.pointsWonFirstServe + 1;
          } else if (additionalData?.serveType === 'SECOND') {
            updates.pointsWonSecondServe = playerStats.pointsWonSecondServe + 1;
          }
          if (additionalData?.exit34) {
            updates.pointsWonExit34 = playerStats.pointsWonExit34 + 1;
          }
          if (additionalData?.returnPoint) {
            updates.pointsWonReturn = playerStats.pointsWonReturn + 1;
          }
          break;
        case 'POINT_LOST':
          if (additionalData?.exit34) {
            updates.pointsLostExit34 = playerStats.pointsLostExit34 + 1;
          }
          break;
        case 'UNFORCED_ERROR':
          updates.unforcedErrors = playerStats.unforcedErrors + 1;
          break;
        case 'FORCED_ERROR':
          updates.forcedErrors = playerStats.forcedErrors + 1;
          break;
        case 'NET_ERROR':
          updates.netErrors = playerStats.netErrors + 1;
          break;
        case 'RETURN_ERROR':
          updates.returnErrors = playerStats.returnErrors + 1;
          break;
        case 'SMASH_ERROR':
          updates.smashErrors = playerStats.smashErrors + 1;
          break;
        case 'LOB_ERROR':
          updates.lobErrors = playerStats.lobErrors + 1;
          break;
      }

      if (Object.keys(updates).length > 0) {
        await statsQueries.update(playerStats.id, updates);
      }

    } catch (error) {
      console.error('Update player stats error:', error);
    }
  }
}
