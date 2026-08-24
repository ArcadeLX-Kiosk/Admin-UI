import React, { createContext, useContext, useState, ReactNode } from 'react';
import { AuditLogEntry } from '../types/audit';

interface AuditContextType {
  auditLogs: AuditLogEntry[];
  addAuditLog: (log: Omit<AuditLogEntry, 'id' | 'timestamp'>) => void;
}

const AuditContext = createContext<AuditContextType | undefined>(undefined);

export function AuditProvider({ children }: { children: ReactNode }) {
  const [auditLogs, setAuditLogs] = useState<AuditLogEntry[]>([
    {
      id: 'AUDIT-1',
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(),
      actorId: 'company',
      actorName: 'Company Admin',
      actorRole: 'company',
      action: 'Machine Assigned',
      entityType: 'machine',
      entityId: 'KSK-2026-000001',
      distributorId: 'dist-1'
    },
    {
      id: 'AUDIT-2',
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(),
      actorId: 'company',
      actorName: 'Company Admin',
      actorRole: 'company',
      action: 'Agreement Created',
      entityType: 'agreement',
      entityId: 'cda-1-v1',
      distributorId: 'dist-1'
    },
    {
      id: 'AUDIT-3',
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2).toISOString(),
      actorId: 'dist-1',
      actorName: 'Arjun Mehta',
      actorRole: 'distributor',
      action: 'Partner Added',
      entityType: 'organization',
      entityId: 'part-1',
      distributorId: 'dist-1',
      partnerId: 'part-1'
    }
  ]);

  const addAuditLog = (log: Omit<AuditLogEntry, 'id' | 'timestamp'>) => {
    const newLog: AuditLogEntry = {
      ...log,
      id: `AUDIT-${Math.random().toString(36).substr(2, 9)}`,
      timestamp: new Date().toISOString(),
    };
    setAuditLogs(prev => [newLog, ...prev]);
  };

  return (
    <AuditContext.Provider value={{ auditLogs, addAuditLog }}>
      {children}
    </AuditContext.Provider>
  );
}

export function useAudit() {
  const context = useContext(AuditContext);
  if (context === undefined) {
    throw new Error('useAudit must be used within an AuditProvider');
  }
  return context;
}
