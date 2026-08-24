import React, { createContext, useContext, useState, ReactNode } from 'react';
import { AppNotification, NotificationCategory } from '../types/notification';

interface NotificationContextType {
  notifications: AppNotification[];
  addNotification: (notification: Omit<AppNotification, 'id' | 'createdAt' | 'isRead'>) => void;
  markAsRead: (id: string) => void;
  markAllAsRead: (recipientId: string) => void;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export function NotificationProvider({ children }: { children: ReactNode }) {
  const [notifications, setNotifications] = useState<AppNotification[]>([]);

  const addNotification = (n: Omit<AppNotification, 'id' | 'createdAt' | 'isRead'>) => {
    const newNotif: AppNotification = {
      ...n,
      id: `NOTIF-${Math.random().toString(36).substr(2, 9)}`,
      createdAt: new Date().toISOString(),
      isRead: false
    };
    setNotifications(prev => [newNotif, ...prev]);
  };

  const markAsRead = (id: string) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, isRead: true } : n));
  };

  const markAllAsRead = (recipientId: string) => {
    setNotifications(prev => prev.map(n => n.recipientId === recipientId ? { ...n, isRead: true } : n));
  };

  return (
    <NotificationContext.Provider value={{ notifications, addNotification, markAsRead, markAllAsRead }}>
      {children}
    </NotificationContext.Provider>
  );
}

export function useNotification() {
  const context = useContext(NotificationContext);
  if (context === undefined) {
    throw new Error('useNotification must be used within a NotificationProvider');
  }
  return context;
}
