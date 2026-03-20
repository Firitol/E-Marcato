import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { api } from "./api";

interface User {
  id: number;
  email: string;
  firstName: string;
  lastName: string;
  role: string;
  phone?: string;
  avatar?: string;
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  login: (email: string, password: string) => Promise<void>;
  register: (data: any) => Promise<void>;
  logout: () => void;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const savedToken = localStorage.getItem("auth_token");
    if (savedToken) {
      setToken(savedToken);
      
      // Add a timeout to prevent hanging if API is unavailable
      const timeoutId = setTimeout(() => {
        setIsLoading(false);
        localStorage.removeItem("auth_token");
        setToken(null);
      }, 2000); // 2 second timeout for faster page load
      
      api.get("/auth/me")
        .then(u => {
          clearTimeout(timeoutId);
          setUser(u);
          setIsLoading(false);
        })
        .catch(() => {
          clearTimeout(timeoutId);
          localStorage.removeItem("auth_token");
          setToken(null);
          setIsLoading(false);
        });
    } else {
      setIsLoading(false);
    }
  }, []);

  const login = async (email: string, password: string) => {
    const data = await api.post("/auth/login", { email, password });
    localStorage.setItem("auth_token", data.token);
    setToken(data.token);
    setUser(data.user);
  };

  const register = async (formData: any) => {
    const data = await api.post("/auth/register", formData);
    localStorage.setItem("auth_token", data.token);
    setToken(data.token);
    setUser(data.user);
  };

  const logout = () => {
    api.post("/auth/logout", {}).catch(() => {});
    localStorage.removeItem("auth_token");
    setToken(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, token, login, register, logout, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
