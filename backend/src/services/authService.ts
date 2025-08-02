import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { userQueries } from '../utils/databaseQueries';
import { JWTPayload } from '../middleware/auth';

export interface RegisterData {
  username: string;
  email: string;
  password: string;
  firstName: string;
  lastName: string;
}

export interface LoginData {
  email: string;
  password: string;
}

export interface AuthResponse {
  success: boolean;
  data?: {
    user: {
      id: string;
      username: string;
      email: string;
      firstName: string;
      lastName: string;
    };
    token: string;
  };
  error?: string;
}

export class AuthService {
  private static readonly JWT_EXPIRES_IN = '7d';
  private static readonly SALT_ROUNDS = 10;

  static async register(data: RegisterData): Promise<AuthResponse> {
    try {
      // Check if user already exists
      const existingUserByEmail = await userQueries.findByEmail(data.email);
      if (existingUserByEmail) {
        return {
          success: false,
          error: 'Email already registered'
        };
      }

      const existingUserByUsername = await userQueries.findByUsername(data.username);
      if (existingUserByUsername) {
        return {
          success: false,
          error: 'Username already taken'
        };
      }

      // Hash password
      const hashedPassword = await bcrypt.hash(data.password, this.SALT_ROUNDS);

      // Create user
      const user = await userQueries.create({
        ...data,
        password: hashedPassword
      });

      if (!user) {
        return {
          success: false,
          error: 'Failed to create user'
        };
      }

      // Generate JWT token
      const token = this.generateToken(user);

      return {
        success: true,
        data: {
          user: {
            id: user.id,
            username: user.username,
            email: user.email,
            firstName: user.firstName,
            lastName: user.lastName
          },
          token
        }
      };

    } catch (error) {
      console.error('Registration error:', error);
      return {
        success: false,
        error: 'Registration failed'
      };
    }
  }

  static async login(data: LoginData): Promise<AuthResponse> {
    try {
      // Find user by email
      const user = await userQueries.findByEmail(data.email);
      if (!user) {
        return {
          success: false,
          error: 'Invalid email or password'
        };
      }

      // Verify password
      const isPasswordValid = await bcrypt.compare(data.password, user.password);
      if (!isPasswordValid) {
        return {
          success: false,
          error: 'Invalid email or password'
        };
      }

      // Generate JWT token
      const token = this.generateToken(user);

      return {
        success: true,
        data: {
          user: {
            id: user.id,
            username: user.username,
            email: user.email,
            firstName: user.firstName,
            lastName: user.lastName
          },
          token
        }
      };

    } catch (error) {
      console.error('Login error:', error);
      return {
        success: false,
        error: 'Login failed'
      };
    }
  }

  static async getCurrentUser(userId: string) {
    try {
      const user = await userQueries.findByIdWithStats(userId);
      if (!user) {
        return {
          success: false,
          error: 'User not found'
        };
      }

      return {
        success: true,
        data: {
          user: {
            id: user.id,
            username: user.username,
            email: user.email,
            firstName: user.firstName,
            lastName: user.lastName,
            playerStats: user.playerStats,
            matchPlayers: user.matchPlayers
          }
        }
      };

    } catch (error) {
      console.error('Get current user error:', error);
      return {
        success: false,
        error: 'Failed to get user data'
      };
    }
  }

  static async changePassword(userId: string, currentPassword: string, newPassword: string) {
    try {
      const user = await userQueries.findByEmail(userId);
      if (!user) {
        return {
          success: false,
          error: 'User not found'
        };
      }

      // Verify current password
      const isCurrentPasswordValid = await bcrypt.compare(currentPassword, user.password);
      if (!isCurrentPasswordValid) {
        return {
          success: false,
          error: 'Current password is incorrect'
        };
      }

      // Hash new password
      const hashedNewPassword = await bcrypt.hash(newPassword, this.SALT_ROUNDS);

      // Update password
      await userQueries.updatePassword(userId, hashedNewPassword);

      return {
        success: true,
        data: {
          message: 'Password updated successfully'
        }
      };

    } catch (error) {
      console.error('Change password error:', error);
      return {
        success: false,
        error: 'Failed to change password'
      };
    }
  }

  private static generateToken(user: any): string {
    const payload: JWTPayload = {
      userId: user.id,
      email: user.email,
      username: user.username
    };

    return jwt.sign(payload, process.env.JWT_SECRET!, {
      expiresIn: this.JWT_EXPIRES_IN
    });
  }

  static verifyToken(token: string): JWTPayload | null {
    try {
      return jwt.verify(token, process.env.JWT_SECRET!) as JWTPayload;
    } catch (error) {
      return null;
    }
  }
} 