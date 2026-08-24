import React, { createContext, useContext, useState, ReactNode } from 'react';
import { SupportTicket, SupportReply } from '../types/support';

interface SupportContextType {
  tickets: SupportTicket[];
  replies: SupportReply[];
  createTicket: (ticket: Omit<SupportTicket, 'id' | 'createdAt' | 'updatedAt' | 'status'>) => void;
  addReply: (reply: Omit<SupportReply, 'id' | 'createdAt'>) => void;
  updateTicketStatus: (id: string, status: SupportTicket['status']) => void;
}

const SupportContext = createContext<SupportContextType | undefined>(undefined);

export function SupportProvider({ children }: { children: ReactNode }) {
  const [tickets, setTickets] = useState<SupportTicket[]>([]);
  const [replies, setReplies] = useState<SupportReply[]>([]);

  const createTicket = (t: Omit<SupportTicket, 'id' | 'createdAt' | 'updatedAt' | 'status'>) => {
    const newTicket: SupportTicket = {
      ...t,
      id: `TKT-${Math.random().toString(36).substr(2, 9)}`,
      status: 'open',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    setTickets(prev => [newTicket, ...prev]);
  };

  const addReply = (r: Omit<SupportReply, 'id' | 'createdAt'>) => {
    const newReply: SupportReply = {
      ...r,
      id: `REP-${Math.random().toString(36).substr(2, 9)}`,
      createdAt: new Date().toISOString(),
    };
    setReplies(prev => [...prev, newReply]);
    setTickets(prev => prev.map(t => t.id === r.ticketId ? { ...t, updatedAt: new Date().toISOString() } : t));
  };

  const updateTicketStatus = (id: string, status: SupportTicket['status']) => {
    setTickets(prev => prev.map(t => t.id === id ? { ...t, status, updatedAt: new Date().toISOString() } : t));
  };

  return (
    <SupportContext.Provider value={{ tickets, replies, createTicket, addReply, updateTicketStatus }}>
      {children}
    </SupportContext.Provider>
  );
}

export function useSupport() {
  const context = useContext(SupportContext);
  if (context === undefined) {
    throw new Error('useSupport must be used within a SupportProvider');
  }
  return context;
}
