import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { UserAccount, UserRole } from '../types';
import { apiService } from '../utils/apiService';
import { DEMO_ACCOUNTS } from '../components/AuthScreen';

interface AuthContextType {
  currentUser: UserAccount | null;
  token: string | null;
  isLoading: boolean;
  error: string | null;
  login: (credentials: { email?: string; identifier?: string; password?: string }) => Promise<{ success: boolean; user?: UserAccount; error?: string }>;
  register: (userData: any) => Promise<{ success: boolean; user?: UserAccount; error?: string }>;
  logout: () => Promise<void>;
  setCurrentUser: (user: UserAccount | null) => void;
  clearError: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<UserAccount | null>(null);
  const [token, setToken] = useState<string | null>(apiService.getAuthToken());
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Restore authenticated user session on mount
  useEffect(() => {
    async function restoreSession() {
      setIsLoading(true);
      try {
        const tokenInStorage = apiService.getAuthToken();
        if (tokenInStorage) {
          const fetchedUser = await apiService.getCurrentUser();
          if (fetchedUser) {
            setCurrentUser(fetchedUser);
            setToken(tokenInStorage);
            setIsLoading(false);
            return;
          }
        }
        
        // Fallback check in local storage
        const storedUserJson = localStorage.getItem('genericmed_auth_user');
        if (storedUserJson) {
          const user = JSON.parse(storedUserJson);
          setCurrentUser(user);
        } else {
          // Default demo fallback for instant testing
          setCurrentUser(DEMO_ACCOUNTS.patient);
        }
      } catch (err) {
        console.warn('Error restoring auth session:', err);
        setCurrentUser(DEMO_ACCOUNTS.patient);
      } finally {
        setIsLoading(false);
      }
    }

    restoreSession();
  }, []);

  const login = async (credentials: { email?: string; identifier?: string; password?: string }) => {
    setError(null);
    setIsLoading(true);
    try {
      const result = await apiService.login(credentials);
      if (result.success && result.user) {
        setCurrentUser(result.user);
        setToken(result.token || null);
        try {
          localStorage.setItem('genericmed_auth_user', JSON.stringify(result.user));
        } catch {
          // Fallback
        }
        setIsLoading(false);
        return { success: true, user: result.user };
      } else {
        const errMsg = result.error || 'Login failed. Please check your credentials.';
        setError(errMsg);
        setIsLoading(false);
        return { success: false, error: errMsg };
      }
    } catch (err: any) {
      const errMsg = err.message || 'Network error during authentication.';
      setError(errMsg);
      setIsLoading(false);
      return { success: false, error: errMsg };
    }
  };

  const register = async (userData: any) => {
    setError(null);
    setIsLoading(true);
    try {
      const result = await apiService.register(userData);
      if (result.success && result.user) {
        setCurrentUser(result.user);
        setToken(result.token || null);
        try {
          localStorage.setItem('genericmed_auth_user', JSON.stringify(result.user));
        } catch {
          // Fallback
        }
        setIsLoading(false);
        return { success: true, user: result.user };
      } else {
        const errMsg = result.error || 'Registration failed. Please check form fields.';
        setError(errMsg);
        setIsLoading(false);
        return { success: false, error: errMsg };
      }
    } catch (err: any) {
      const errMsg = err.message || 'Network error during registration.';
      setError(errMsg);
      setIsLoading(false);
      return { success: false, error: errMsg };
    }
  };

  const logout = async () => {
    setIsLoading(true);
    await apiService.logout();
    setCurrentUser(null);
    setToken(null);
    try {
      localStorage.removeItem('genericmed_auth_user');
      localStorage.removeItem('genericmed_auth_token');
    } catch {
      // Fallback
    }
    setIsLoading(false);
  };

  const clearError = () => setError(null);

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        token,
        isLoading,
        error,
        login,
        register,
        logout,
        setCurrentUser,
        clearError,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
