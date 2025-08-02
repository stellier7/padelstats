import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User, apiService } from '../services/api';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (data: {
    username: string;
    email: string;
    password: string;
    firstName: string;
    lastName: string;
  }) => Promise<void>;
  logout: () => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initializeAuth = async () => {
      try {
        const token = apiService.getAuthToken();
        console.log('AuthContext - Token found:', !!token);
        if (token) {
          console.log('AuthContext - Attempting to get current user...');
          const response = await apiService.getCurrentUser();
          console.log('AuthContext - Current user response:', response);
          if (response.success && response.data) {
            console.log('AuthContext - Setting user:', response.data.user);
            setUser(response.data.user);
          } else {
            console.log('AuthContext - Clearing token due to failed response');
            apiService.clearAuthToken();
          }
        } else {
          console.log('AuthContext - No token found');
        }
      } catch (error) {
        console.error('AuthContext - Auth initialization error:', error);
        apiService.clearAuthToken();
      } finally {
        setLoading(false);
      }
    };

    initializeAuth();
  }, []);

  const login = async (email: string, password: string) => {
    try {
      setLoading(true);
      console.log('AuthContext - Attempting login for:', email);
      const response = await apiService.login({ email, password });
      console.log('AuthContext - Login response:', response);
      if (response.success && response.data) {
        console.log('AuthContext - Login successful, setting user:', response.data.user);
        setUser(response.data.user);
      } else {
        throw new Error(response.error || 'Login failed');
      }
    } catch (error) {
      console.error('AuthContext - Login error:', error);
      setLoading(false);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const register = async (data: {
    username: string;
    email: string;
    password: string;
    firstName: string;
    lastName: string;
  }) => {
    try {
      setLoading(true);
      const response = await apiService.register(data);
      if (response.success && response.data) {
        setUser(response.data.user);
      } else {
        throw new Error(response.error || 'Registration failed');
      }
    } catch (error) {
      setLoading(false);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    apiService.clearAuthToken();
    setUser(null);
  };

  const value: AuthContextType = {
    user,
    loading,
    login,
    register,
    logout,
    isAuthenticated: !!user,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}; 