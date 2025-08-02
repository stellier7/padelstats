import prisma from '../services/databaseService';
import { MatchType, MatchStatus, TournamentPhase, EventType } from '@prisma/client';

// User queries
export const userQueries = {
  // Get user by email
  findByEmail: (email: string) => {
    return prisma.user.findUnique({
      where: { email }
    });
  },

  // Get user by username
  findByUsername: (username: string) => {
    return prisma.user.findUnique({
      where: { username }
    });
  },

  // Get user by ID
  findById: (userId: string) => {
    return prisma.user.findUnique({
      where: { id: userId }
    });
  },

  // Get user with all related data
  findByIdWithStats: (userId: string) => {
    return prisma.user.findUnique({
      where: { id: userId },
      include: {
        playerStats: {
          include: {
            match: true
          }
        },
        matchPlayers: {
          include: {
            match: true
          }
        }
      }
    });
  },

  // Get all users
  findAll: () => {
    return prisma.user.findMany({
      select: {
        id: true,
        username: true,
        email: true,
        firstName: true,
        lastName: true,
        createdAt: true
      }
    });
  },

  // Create new user
  create: (data: {
    username: string;
    email: string;
    password: string;
    firstName: string;
    lastName: string;
  }) => {
    return prisma.user.create({
      data
    });
  },

  // Update user password
  updatePassword: (userId: string, hashedPassword: string) => {
    return prisma.user.update({
      where: { id: userId },
      data: { password: hashedPassword }
    });
  }
};

// Match queries
export const matchQueries = {
  // Get match by ID
  findById: (matchId: string) => {
    return prisma.match.findUnique({
      where: { id: matchId }
    });
  },

  // Get match with all related data
  findByIdWithDetails: (matchId: string) => {
    return prisma.match.findUnique({
      where: { id: matchId },
      include: {
        players: {
          include: {
            user: {
              select: {
                id: true,
                username: true,
                firstName: true,
                lastName: true
              }
            }
          }
        },
        events: {
          include: {
            player: {
              select: {
                id: true,
                username: true,
                firstName: true,
                lastName: true
              }
            }
          },
          orderBy: {
            timestamp: 'asc'
          }
        },
        playerStats: {
          include: {
            user: {
              select: {
                id: true,
                username: true,
                firstName: true,
                lastName: true
              }
            }
          }
        },
        tournament: true
      }
    });
  },

  // Get all matches
  findAll: () => {
    return prisma.match.findMany({
      include: {
        players: {
          include: {
            user: {
              select: {
                id: true,
                username: true,
                firstName: true,
                lastName: true
              }
            }
          }
        },
        tournament: true
      },
      orderBy: {
        createdAt: 'desc'
      }
    });
  },

  // Get matches by status
  findByStatus: (status: MatchStatus) => {
    return prisma.match.findMany({
      where: { status },
      include: {
        players: {
          include: {
            user: {
              select: {
                id: true,
                username: true,
                firstName: true,
                lastName: true
              }
            }
          }
        },
        tournament: true
      },
      orderBy: {
        createdAt: 'desc'
      }
    });
  },

  // Get matches by type
  findByType: (type: MatchType) => {
    return prisma.match.findMany({
      where: { type },
      include: {
        players: {
          include: {
            user: {
              select: {
                id: true,
                username: true,
                firstName: true,
                lastName: true
              }
            }
          }
        },
        tournament: true
      },
      orderBy: {
        createdAt: 'desc'
      }
    });
  },

  // Create new match
  create: (data: {
    type: MatchType;
    phase?: TournamentPhase;
    tournamentId?: string;
    status: MatchStatus;
  }) => {
    return prisma.match.create({
      data
    });
  },

  // Update match
  update: (matchId: string, data: {
    status?: MatchStatus;
    phase?: TournamentPhase;
  }) => {
    return prisma.match.update({
      where: { id: matchId },
      data
    });
  },

  // Delete match
  delete: (matchId: string) => {
    return prisma.match.delete({
      where: { id: matchId }
    });
  },

  // Add player to match
  addPlayer: (matchId: string, userId: string, team: number, position: number) => {
    return prisma.matchPlayer.create({
      data: {
        matchId,
        userId,
        team,
        position
      }
    });
  }
};

// Statistics queries
export const statsQueries = {
  // Get player stats for a specific match
  getPlayerStatsForMatch: (userId: string, matchId: string) => {
    return prisma.playerStats.findUnique({
      where: {
        userId_matchId: {
          userId,
          matchId
        }
      },
      include: {
        user: {
          select: {
            id: true,
            username: true,
            firstName: true,
            lastName: true
          }
        }
      }
    });
  },

  // Get all statistics for a match
  getMatchStats: (matchId: string) => {
    return prisma.playerStats.findMany({
      where: { matchId },
      include: {
        user: {
          select: {
            id: true,
            username: true,
            firstName: true,
            lastName: true
          }
        }
      }
    });
  },

  // Get player's overall statistics
  getPlayerOverallStats: (userId: string) => {
    return prisma.playerStats.findMany({
      where: { userId },
      include: {
        match: {
          include: {
            tournament: true
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    });
  },

  // Create new player stats
  create: (data: {
    userId: string;
    matchId: string;
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
  }) => {
    return prisma.playerStats.create({
      data
    });
  },

  // Update player stats
  update: (statsId: string, data: any) => {
    return prisma.playerStats.update({
      where: { id: statsId },
      data
    });
  },

  // Find by player and match
  findByPlayerAndMatch: (userId: string, matchId: string) => {
    return prisma.playerStats.findUnique({
      where: {
        userId_matchId: {
          userId,
          matchId
        }
      }
    });
  }
};

// Event queries
export const eventQueries = {
  // Get events for a match
  getMatchEvents: (matchId: string) => {
    return prisma.matchEvent.findMany({
      where: { matchId },
      include: {
        player: {
          select: {
            id: true,
            username: true,
            firstName: true,
            lastName: true
          }
        }
      },
      orderBy: {
        timestamp: 'asc'
      }
    });
  },

  // Get events by player
  getPlayerEvents: (playerId: string, matchId?: string) => {
    return prisma.matchEvent.findMany({
      where: {
        playerId,
        ...(matchId && { matchId })
      },
      include: {
        match: true,
        player: {
          select: {
            id: true,
            username: true,
            firstName: true,
            lastName: true
          }
        }
      },
      orderBy: {
        timestamp: 'desc'
      }
    });
  },

  // Create new event
  create: (data: {
    matchId: string;
    playerId: string;
    eventType: EventType;
    observerId: string;
    additionalData?: any;
  }) => {
    return prisma.matchEvent.create({
      data: {
        ...data,
        timestamp: new Date()
      }
    });
  },

  // Get events by match ID (alias for getMatchEvents)
  findByMatchId: (matchId: string) => {
    return prisma.matchEvent.findMany({
      where: { matchId },
      include: {
        player: {
          select: {
            id: true,
            username: true,
            firstName: true,
            lastName: true
          }
        }
      },
      orderBy: {
        timestamp: 'asc'
      }
    });
  }
};
