export type MachineStatus = 
  | 'manufactured' 
  | 'registered' 
  | 'available' 
  | 'reserved' 
  | 'assigned_to_distributor' 
  | 'assigned_to_partner' 
  | 'dispatched' 
  | 'installed' 
  | 'activated' 
  | 'active' 
  | 'maintenance' 
  | 'returned' 
  | 'retired';

export interface MachineAssignmentEvent {
  id: string;
  machineId: string;
  distributorId?: string;
  partnerId?: string;
  assignedAt: string;
  returnedAt?: string;
  status: 'active' | 'completed';
}

export interface MachineTimelineEvent {
  id: string;
  machineId: string;
  event: string;
  timestamp: string;
  actor: string;
  note?: string;
}

export interface Machine {
  id: string; // UUID
  machineCode: string; // KSK-YYYY-NNNNNN
  serialNumber: string;
  qrCode: string;
  model: string;
  hardwareFingerprint: string;
  firmwareVersion: string;
  status: MachineStatus;
  activationDate: string | null;
  manufactureDate: string;
  warrantyExpiry: string;
  location: string;
  distributorId: string | null;
  partnerId: string | null;
  createdAt: string;
  updatedAt: string;
  
  // Informational mock telemetry
  isOnline?: boolean;
  lastSeen?: string;
  ipAddress?: string;
  macAddress?: string;
  temperature?: string;
  
  // Computed values
  totalRevenue?: number;
  totalTransactions?: number;
  city?: string;
}
