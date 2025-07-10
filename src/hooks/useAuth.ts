import { useState, useEffect, useCallback } from 'react';
import { User, AuthState, LoginCredentials, SignupCredentials } from '../types/auth';
import { authService } from '../services/authService';

export const useAuth = () => {
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    isAuthenticated: false,
    loading: true
  });

  useEffect(() => {
    const user = authService.getCurrentUser();
    setAuthState({
      user,
      isAuthenticated: !!user,
      loading: false
    });
  }, []);

  const login = useCallback(async (credentials: LoginCredentials) => {
    try {
      const user = await authService.login(credentials);
      setAuthState({
        user,
        isAuthenticated: true,
        loading: false
      });
      return user;
    } catch (error) {
      throw error;
    }
  }, []);

  const signup = useCallback(async (credentials: SignupCredentials) => {
    try {
      const user = await authService.signup(credentials);
      setAuthState({
        user,
        isAuthenticated: true,
        loading: false
      });
      return user;
    } catch (error) {
      throw error;
    }
  }, []);

  const logout = useCallback(async () => {
    await authService.logout();
    setAuthState({
      user: null,
      isAuthenticated: false,
      loading: false
    });
  }, []);

  const updateWatchlist = useCallback(async (watchlist: string[]) => {
    if (!authState.user) return;
    
    try {
      const updatedUser = await authService.updateWatchlist(authState.user.id, watchlist);
      setAuthState(prev => ({
        ...prev,
        user: updatedUser
      }));
      return updatedUser;
    } catch (error) {
      throw error;
    }
  }, [authState.user]);

  return {
    ...authState,
    login,
    signup,
    logout,
    updateWatchlist
  };
};