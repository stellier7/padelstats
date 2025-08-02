// User Types
export interface User {
  id: string;
  username: string;
  email: string;
  firstName: string;
  lastName: string;
  createdAt: string;
}

export interface AuthUser extends User {
  token: string;
}

// Match Types
export enum MatchType {
  TOURNAMENT = 'TOURNAMENT',
  FRIENDLY = 'FRIENDLY'
}

export enum TournamentPhase {
  OCTAVOS = 'OCTAVOS',
  CUARTOS = 'CUARTOS',
  SEMIFINAL = 'SEMIFINAL',
  FINAL = 'FINAL'
}

export enum MatchStatus {
  IN_PROGRESS = 'IN_PROGRESS',
  COMPLETED = 'COMPLETED'
}

export interface Match {
  id: string;
  date: string;
  type: MatchType;
  phase?: TournamentPhase;
  status: MatchStatus;
  createdAt: string;
  players: MatchPlayer[];
  events: MatchEvent[];
  playerStats: PlayerStats[];
}

export interface MatchPlayer {
  id: string;
  matchId: string;
  userId: string;
  team: number; // 1 or 2
  position: number; // 1 or 2 (within team)
  user: User;
}

// Event Types
export enum EventType {
  FIRST_SERVE_IN = 'FIRST_SERVE_IN',
  FIRST_SERVE_OUT = 'FIRST_SERVE_OUT',
  POINT_WON_FIRST_SERVE = 'POINT_WON_FIRST_SERVE',
  SECOND_SERVE_IN = 'SECOND_SERVE_IN',
  SECOND_SERVE_OUT = 'SECOND_SERVE_OUT',
  UNFORCED_ERROR = 'UNFORCED_ERROR',
  FORCED_ERROR = 'FORCED_ERROR',
  NET_ERROR = 'NET_ERROR',
  RETURN_ERROR = 'RETURN_ERROR',
  SMASH_ERROR = 'SMASH_ERROR',
  LOB_ERROR = 'LOB_ERROR',
  POINT_WON = 'POINT_WON',
  POINT_LOST = 'POINT_LOST',
  EXIT_BY_3 = 'EXIT_BY_3',
  EXIT_BY_4 = 'EXIT_BY_4',
  POINT_WON_EXIT_3_4 = 'POINT_WON_EXIT_3_4',
  POINT_WON_RETURN = 'POINT_WON_RETURN'
}

export interface MatchEvent {
  id: string;
  matchId: string;
  playerId: string;
  eventType: EventType;
  timestamp: string;
  observerId: string;
  player: User;
}

// Statistics Types
export interface PlayerStats {
  id: string;
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
  createdAt: string;
  user: User;
}

// Tournament Types
export enum TournamentStatus {
  UPCOMING = 'UPCOMING',
  IN_PROGRESS = 'IN_PROGRESS',
  COMPLETED = 'COMPLETED',
  CANCELLED = 'CANCELLED'
}

export interface Tournament {
  id: string;
  name: string;
  startDate: string;
  endDate?: string;
  status: TournamentStatus;
  createdAt: string;
  matches: Match[];
}

// API Response Types
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  username: string;
  email: string;
  password: string;
  firstName: string;
  lastName: string;
}

export interface CreateMatchRequest {
  type: MatchType;
  phase?: TournamentPhase;
  playerIds: string[];
}

// Socket Types
export interface SocketEvent {
  type: string;
  data: any;
}

export interface MatchEventRequest {
  matchId: string;
  playerId: string;
  eventType: EventType;
} 