import axios, { AxiosInstance, AxiosResponse } from 'axios';

// API response types
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  details?: string[];
}

export interface User {
  id: string;
  username: string;
  email: string;
  firstName: string;
  lastName: string;
}

export interface AuthResponse {
  user: User;
  token: string;
}

export interface Match {
  id: string;
  date: string;
  type: 'TOURNAMENT' | 'FRIENDLY';
  phase?: 'OCTAVOS' | 'CUARTOS' | 'SEMIFINAL' | 'FINAL';
  status: 'IN_PROGRESS' | 'COMPLETED';
  createdAt: string;
  players: MatchPlayer[];
  events: MatchEvent[];
  playerStats: PlayerStats[];
  tournament?: Tournament;
}

export interface MatchPlayer {
  id: string;
  matchId: string;
  userId: string;
  team: number;
  position: number;
  user: User;
}

export interface MatchEvent {
  id: string;
  matchId: string;
  playerId: string;
  eventType: string;
  timestamp: string;
  observerId: string;
  player: User;
}

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

export interface Tournament {
  id: string;
  name: string;
  startDate: string;
  endDate?: string;
  status: string;
  createdAt: string;
}

// API service class
class ApiService {
  private api: AxiosInstance;
  private token: string | null = null;

  constructor() {
    this.api = axios.create({
      baseURL: process.env.REACT_APP_API_URL || 'http://localhost:3001/api',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    // Load token from localStorage
    this.token = localStorage.getItem('token');
    if (this.token) {
      this.setAuthToken(this.token);
    }

    // Add request interceptor to include token
    this.api.interceptors.request.use(
      (config) => {
        if (this.token) {
          config.headers.Authorization = `Bearer ${this.token}`;
        }
        // Log request data for debugging
        if (config.method === 'post' && config.url === '/matches') {
          console.log('Request interceptor - URL:', config.url);
          console.log('Request interceptor - Data:', config.data);
          console.log('Request interceptor - Headers:', config.headers);
        }
        return config;
      },
      (error) => {
        return Promise.reject(error);
      }
    );

    // Add response interceptor to handle token expiration
    this.api.interceptors.response.use(
      (response) => response,
      (error) => {
        if (error.response?.status === 401) {
          this.clearAuthToken();
          window.location.href = '/login';
        }
        return Promise.reject(error);
      }
    );
  }

  // Token management
  setAuthToken(token: string) {
    this.token = token;
    localStorage.setItem('token', token);
    this.api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  }

  clearAuthToken() {
    this.token = null;
    localStorage.removeItem('token');
    delete this.api.defaults.headers.common['Authorization'];
  }

  getAuthToken(): string | null {
    return this.token;
  }

  // Health check
  async healthCheck(): Promise<ApiResponse> {
    try {
      const response = await this.api.get<ApiResponse>('/health');
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  // Auth methods
  async register(data: {
    username: string;
    email: string;
    password: string;
    firstName: string;
    lastName: string;
  }): Promise<ApiResponse<AuthResponse>> {
    try {
      const response = await this.api.post<ApiResponse<AuthResponse>>('/auth/register', data);
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async login(data: { email: string; password: string }): Promise<ApiResponse<AuthResponse>> {
    try {
      console.log('ApiService - Login attempt for:', data.email);
      const response = await this.api.post<ApiResponse<AuthResponse>>('/auth/login', data);
      console.log('ApiService - Login response:', response.data);
      
      if (response.data.success && response.data.data?.token) {
        console.log('ApiService - Setting auth token');
        this.setAuthToken(response.data.data.token);
      }
      
      return response.data;
    } catch (error) {
      console.error('ApiService - Login error:', error);
      throw this.handleError(error);
    }
  }

  async getCurrentUser(): Promise<ApiResponse<{ user: User & { playerStats: PlayerStats[]; matchPlayers: any[] } }>> {
    try {
      const response = await this.api.get<ApiResponse<{ user: User & { playerStats: PlayerStats[]; matchPlayers: any[] } }>>('/auth/me');
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async changePassword(data: { currentPassword: string; newPassword: string }): Promise<ApiResponse> {
    try {
      const response = await this.api.post<ApiResponse>('/auth/change-password', data);
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  // Match methods
  async getAllMatches(): Promise<ApiResponse<Match[]>> {
    try {
      const response = await this.api.get<ApiResponse<Match[]>>('/matches');
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async getMatch(id: string): Promise<ApiResponse<Match>> {
    try {
      const response = await this.api.get<ApiResponse<Match>>(`/matches/${id}`);
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async getMatchesByStatus(status: string): Promise<ApiResponse<Match[]>> {
    try {
      const response = await this.api.get<ApiResponse<Match[]>>(`/matches/status/${status}`);
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async getMatchesByType(type: string): Promise<ApiResponse<Match[]>> {
    try {
      const response = await this.api.get<ApiResponse<Match[]>>(`/matches/type/${type}`);
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async createMatch(data: {
    type: 'TOURNAMENT' | 'FRIENDLY';
    phase?: string;
    playerIds: string[];
    tournamentId?: string;
  }): Promise<ApiResponse<Match>> {
    try {
      console.log('API Service - Sending data to /matches:', data);
      console.log('API Service - Data type:', typeof data);
      console.log('API Service - Data keys:', Object.keys(data));
      const response = await this.api.post<ApiResponse<Match>>('/matches', data);
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async updateMatch(id: string, data: { status?: string; phase?: string }): Promise<ApiResponse<Match>> {
    try {
      const response = await this.api.put<ApiResponse<Match>>(`/matches/${id}`, data);
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async completeMatch(id: string): Promise<ApiResponse<Match>> {
    try {
      const response = await this.api.patch<ApiResponse<Match>>(`/matches/${id}/complete`);
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async deleteMatch(id: string): Promise<ApiResponse> {
    try {
      const response = await this.api.delete<ApiResponse>(`/matches/${id}`);
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  // Event methods
  async recordEvent(data: {
    matchId: string;
    playerId: string;
    eventType: string;
    additionalData?: any;
  }): Promise<ApiResponse<any>> {
    try {
      const response = await this.api.post<ApiResponse<any>>('/events', data);
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async getMatchEvents(matchId: string): Promise<ApiResponse<MatchEvent[]>> {
    try {
      const response = await this.api.get<ApiResponse<MatchEvent[]>>(`/events/match/${matchId}`);
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async getPlayerStats(matchId: string): Promise<ApiResponse<PlayerStats[]>> {
    try {
      const response = await this.api.get<ApiResponse<PlayerStats[]>>(`/events/stats/${matchId}`);
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async calculateMatchStats(matchId: string): Promise<ApiResponse<any[]>> {
    try {
      const response = await this.api.get<ApiResponse<any[]>>(`/events/calculate/${matchId}`);
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  // Error handling
  private handleError(error: any): Error {
    console.log('handleError - Full error object:', error);
    console.log('handleError - Response data:', error.response?.data);
    
    if (error.response?.data) {
      const errorMessage = error.response.data.error || 'An error occurred';
      const details = error.response.data.details;
      
      if (details && Array.isArray(details)) {
        return new Error(`${errorMessage}: ${details.join(', ')}`);
      }
      
      return new Error(errorMessage);
    }
    return new Error(error.message || 'Network error');
  }
}

// Export singleton instance
export const apiService = new ApiService();
export default apiService;
// Make apiService available globally for testing
(window as any).apiService = apiService;
