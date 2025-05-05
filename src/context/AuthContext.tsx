
import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { User, UserRole } from "@/types";
import { toast } from "sonner";

// Mock users for demo purposes
const MOCK_USERS: User[] = [
  {
    id: "user-1",
    name: "John Doe",
    email: "admin@example.com",
    role: "admin" as UserRole,
    avatar: "https://i.pravatar.cc/150?img=1"
  },
  {
    id: "user-2",
    name: "Jane Smith",
    email: "manager@example.com",
    role: "manager" as UserRole,
    avatar: "https://i.pravatar.cc/150?img=2"
  },
  {
    id: "user-3",
    name: "Bob Johnson",
    email: "user@example.com",
    role: "user" as UserRole,
    avatar: "https://i.pravatar.cc/150?img=3"
  }
];

interface AuthContextType {
  user: User | null;
  users: User[];
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  register: (name: string, email: string, password: string) => Promise<boolean>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [users] = useState<User[]>(MOCK_USERS);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check for saved user in localStorage on mount
    const savedUser = localStorage.getItem("user");
    
    if (savedUser) {
      try {
        setUser(JSON.parse(savedUser));
      } catch (error) {
        console.error("Failed to parse saved user:", error);
        localStorage.removeItem("user");
      }
    }
    
    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    // In a real app, this would make an API call
    setIsLoading(true);

    try {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Find user with matching email
      const foundUser = users.find(u => u.email.toLowerCase() === email.toLowerCase());
      
      if (foundUser && password === "password") { // Demo password check
        setUser(foundUser);
        localStorage.setItem("user", JSON.stringify(foundUser));
        toast.success(`Welcome back, ${foundUser.name}!`);
        return true;
      } else {
        toast.error("Invalid email or password");
        return false;
      }
    } catch (error) {
      console.error("Login error:", error);
      toast.error("An error occurred during login");
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (name: string, email: string, password: string): Promise<boolean> => {
    // In a real app, this would make an API call
    setIsLoading(true);

    try {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Check if email already exists
      if (users.some(u => u.email.toLowerCase() === email.toLowerCase())) {
        toast.error("Email already registered");
        return false;
      }
      
      // In a real app, we would persist this new user
      const newUser: User = {
        id: `user-${users.length + 1}`,
        name,
        email,
        role: "user", // Default role for new users
        avatar: `https://i.pravatar.cc/150?img=${users.length + 4}`
      };
      
      // For demo purposes, set as current user
      setUser(newUser);
      localStorage.setItem("user", JSON.stringify(newUser));
      toast.success(`Welcome, ${name}!`);
      return true;
    } catch (error) {
      console.error("Registration error:", error);
      toast.error("An error occurred during registration");
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("user");
    toast.info("You've been logged out");
  };

  return (
    <AuthContext.Provider 
      value={{ 
        user, 
        users,
        isAuthenticated: !!user,
        isLoading, 
        login, 
        register, 
        logout 
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
