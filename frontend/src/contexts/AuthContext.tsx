import React, { createContext, useContext, useState, useEffect } from 'react';
import { authAPI } from '../services/api';

interface User {
  _id: string;
  name: string;
  email: string;
  role: 'user' | 'counselor' | 'admin';
  specialization?: string;
  status?: string;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  error: string | null;
  login: (email: string, password: string, userType: string) => Promise<void>;
  signup: (name: string, email: string, password: string, userType: string, specialization?: string, level?: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      fetchUserProfile();
    } else {
      setLoading(false);
    }
  }, []);

  const fetchUserProfile = async () => {
    try {
      const response = await authAPI.getProfile();
      setUser(response.data);
    } catch (err: any) {
      console.error('Error fetching user profile:', err);
      localStorage.removeItem('token');
      setError(err.response?.data?.message || 'Failed to fetch user profile');
    } finally {
      setLoading(false);
    }
  };

  const login = async (email: string, password: string, userType: string) => {
    try {
      setError(null);
      setLoading(true);
      const response = await authAPI.login(email, password, userType);
      const { token, user } = response.data;
      localStorage.setItem('token', token);
      setUser(user);
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || 'Login failed';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const signup = async (name: string, email: string, password: string, userType: string, specialization?: string, level?: string) => {
    try {
      setError(null);
      setLoading(true);
      const response = await authAPI.signup(name, email, password, userType, specialization, level);
      const { token, user } = response.data;
      localStorage.setItem('token', token);
      setUser(user);
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || 'Signup failed';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
    setError(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, error, login, signup, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}; 