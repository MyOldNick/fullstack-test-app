import { createContext, useContext, useEffect, useState } from 'react';
import api from '../api';
import axios from 'axios';
import type { User } from '../common/types';

type AuthContextType = {
  authenticated: boolean;
  setAuthenticated: (authenticated: boolean) => void;
  loading: boolean;
  user: User | null;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [authenticated, setAuthenticated] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);

  const checkAuth = async (): Promise<void> => {
    try {
      setLoading(true);
      const response = await api.get('/user');
      if (response.status === 200) {
        setAuthenticated(true);
        setUser(response.data);
      }
    } catch (error) {
      if (axios.isAxiosError(error) && error.response?.status === 401) {
        try {
          const refreshResponse = await api.post('/auth/refresh');
          if (refreshResponse.status === 201) {
            const userResponse = await api.get('/user');
            setAuthenticated(true);
            setUser(userResponse.data);
            return;
          }
        } catch {
          setAuthenticated(false);
          setUser(null);
        }
      } else {
        setAuthenticated(false);
        setUser(null);
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    checkAuth();
  }, []);

  return (
    <AuthContext.Provider value={{ authenticated, setAuthenticated, loading, user }}>
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
