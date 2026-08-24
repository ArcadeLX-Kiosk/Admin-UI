import React, { createContext, useContext, useState, ReactNode } from 'react';
import { Machine, MachineAssignmentEvent, MachineTimelineEvent, MachineStatus } from '../types/machine';
import { MOCK_MACHINES } from './machineData';

interface MachineContextType {
  machines: Machine[];
  assignments: MachineAssignmentEvent[];
  timelines: MachineTimelineEvent[];

  addMachine: (machine: Omit<Machine, 'id' | 'createdAt' | 'updatedAt' | 'machineCode'>) => void;
  updateMachineStatus: (id: string, status: MachineStatus) => void;
  assignMachine: (machineId: string, distributorId: string, partnerId?: string) => void;
  addTimelineEvent: (machineId: string, event: string, actor: string, note?: string) => void;
}

const MachineContext = createContext<MachineContextType | undefined>(undefined);

export function MachineProvider({ children }: { children: ReactNode }) {
  const [machines, setMachines] = useState<Machine[]>(MOCK_MACHINES as unknown as Machine[]);
  const [assignments, setAssignments] = useState<MachineAssignmentEvent[]>([]);
  const [timelines, setTimelines] = useState<MachineTimelineEvent[]>([]);

  const addMachine = (data: Omit<Machine, 'id' | 'createdAt' | 'updatedAt' | 'machineCode'>) => {
    // Generate sequential KSK-YYYY-NNNNNN
    const year = new Date().getFullYear();
    const existingCount = machines.filter(m => m.machineCode.includes(`KSK-${year}-`)).length;
    const nextNum = (existingCount + 1).toString().padStart(6, '0');
    const machineCode = `KSK-${year}-${nextNum}`;

    const newMachine: Machine = {
      ...data,
      id: `uuid-m-${Date.now()}`,
      machineCode,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    setMachines([...machines, newMachine]);
    addTimelineEvent(newMachine.id, 'Machine Registered', 'System', 'Initial registration in Company Inventory');
  };

  const updateMachineStatus = (id: string, status: MachineStatus) => {
    setMachines(prev => prev.map(m => m.id === id ? { ...m, status, updatedAt: new Date().toISOString() } : m));
    addTimelineEvent(id, `Status changed to ${status}`, 'System');
  };

  const assignMachine = (machineId: string, distributorId: string, partnerId?: string) => {
    // Complete previous active assignment
    setAssignments(prev => prev.map(a =>
      a.machineId === machineId && a.status === 'active'
        ? { ...a, status: 'completed', returnedAt: new Date().toISOString() }
        : a
    ));

    // Create new assignment
    const newAssignment: MachineAssignmentEvent = {
      id: `assign-${Date.now()}`,
      machineId,
      distributorId,
      partnerId,
      assignedAt: new Date().toISOString(),
      status: 'active',
    };
    setAssignments(prev => [...prev, newAssignment]);

    // Update machine
    const newStatus = partnerId ? 'assigned_to_partner' : 'assigned_to_distributor';
    setMachines(prev => prev.map(m =>
      m.id === machineId
        ? { ...m, distributorId, partnerId: partnerId || null, status: newStatus, updatedAt: new Date().toISOString() }
        : m
    ));

    addTimelineEvent(machineId, 'Machine Assigned', 'Company Admin', `Assigned to Distributor: ${distributorId}${partnerId ? ` and Partner: ${partnerId}` : ''}`);
  };

  const addTimelineEvent = (machineId: string, event: string, actor: string, note?: string) => {
    const newEvent: MachineTimelineEvent = {
      id: `tl-${Date.now()}-${Math.random()}`,
      machineId,
      event,
      timestamp: new Date().toISOString(),
      actor,
      note,
    };
    setTimelines(prev => [...prev, newEvent]);
  };

  return (
    <MachineContext.Provider value={{
      machines, assignments, timelines,
      addMachine, updateMachineStatus, assignMachine, addTimelineEvent
    }}>
      {children}
    </MachineContext.Provider>
  );
};

export const useMachine = () => {
  const context = useContext(MachineContext);
  if (context === undefined) {
    throw new Error('useMachine must be used within a MachineProvider');
  }
  return context;
};
