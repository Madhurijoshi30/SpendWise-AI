import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { authAPI } from '../services/api';

interface User {
  _id: string;
  name: string;
  email: string;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  register: (name: string, email: string, password: string) => Promise<User>;
  login: (email: string, password: string) => Promise<User>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      authAPI
        .getMe()
        .then((res) => setUser(res.data))
        .catch(() => {
          localStorage.removeItem('token');
          setUser(null);
        })
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, []);

  const register = async (name: string, email: string, password: string) => {
    const res = await authAPI.register(name, email, password);
    localStorage.setItem('token', res.data.token);
    setUser(res.data);
    return res.data;
  };

  const login = async (email: string, password: string) => {
  try {
    const res = await authAPI.login(email, password);
    
    // This blocks will only run if the status code is 200 (Success)
    localStorage.setItem('token', res.data.token);
    setUser(res.data);
    return res.data;
    
  } catch (error) {
    // 💡 CRUCIAL: This safely throws the server rejection up into your 
    // Login page's catch block without crashing the React engine!
    throw error;
  }
};


  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, register, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};
