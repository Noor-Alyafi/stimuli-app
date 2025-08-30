import { useState, useEffect, createContext, useContext, ReactNode } from 'react';
import { StaticAuthService } from '../lib/staticAuth';
import { StoredUser } from '../lib/localStorage';
import { useToast } from './use-toast';

interface AuthContextType {
  user: StoredUser | null;
  isLoading: boolean;
  login: (username: string, password: string) => Promise<void>;
  register: (userData: any) => Promise<void>;
  logout: () => void;
  refreshUser: () => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<StoredUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  const refreshUser = () => {
    const currentUser = StaticAuthService.getCurrentUser();
    setUser(currentUser);
  };

  useEffect(() => {
    refreshUser();
    setIsLoading(false);
  }, []);

  const login = async (username: string, password: string) => {
    try {
      const loggedInUser = await StaticAuthService.login({ username, password });
      setUser(loggedInUser);
      toast({
        title: "Login successful",
        description: `Welcome back, ${loggedInUser.username}!`,
      });
    } catch (error: any) {
      toast({
        title: "Login failed",
        description: error.message,
        variant: "destructive",
      });
      throw error;
    }
  };

  const register = async (userData: any) => {
    try {
      const newUser = await StaticAuthService.register(userData);
      setUser(newUser);
      toast({
        title: "Registration successful",
        description: `Welcome to Stimuli, ${newUser.username}!`,
      });
    } catch (error: any) {
      toast({
        title: "Registration failed",
        description: error.message,
        variant: "destructive",
      });
      throw error;
    }
  };

  const logout = () => {
    StaticAuthService.logout();
    setUser(null);
    toast({
      title: "Logged out",
      description: "See you next time!",
    });
  };

  return (
    <AuthContext.Provider value={{
      user,
      isLoading,
      login,
      register,
      logout,
      refreshUser,
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useStaticAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useStaticAuth must be used within an AuthProvider');
  }
  return context;
}