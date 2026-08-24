import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User, Role } from '../types/user';

interface AuthContextType {
  user: User | null;
  loginAsRole: (role: Role) => void;
  logout: () => void;
  hasRole: (role: Role) => boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const MOCK_USERS: Record<Role, User> = {
  company: {
    id: 'comp-1',
    name: 'Admin User',
    email: 'admin@company.demo',
    role: 'company',
    organizationId: 'org-company',
  },
  distributor: {
    id: 'dist-1',
    name: 'Distributor Demo',
    email: 'demo@distributor.demo',
    role: 'distributor',
    organizationId: 'org-dist-1',
  },
  partner: {
    id: 'part-1',
    name: 'Partner Demo',
    email: 'demo@partner.demo',
    role: 'partner',
    organizationId: 'org-part-1',
  },
};

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(() => {
    const savedUser = localStorage.getItem('demo_user');
    return savedUser ? JSON.parse(savedUser) : null;
  });

  const loginAsRole = (role: Role) => {
    const mockUser = MOCK_USERS[role];
    setUser(mockUser);
    localStorage.setItem('demo_user', JSON.stringify(mockUser));
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('demo_user');
  };

  const hasRole = (role: Role) => {
    return user?.role === role;
  };

  return (
    <AuthContext.Provider value={{ user, loginAsRole, logout, hasRole }}>
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
