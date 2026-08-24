export interface AuditLogEntry {
  id: string;
  timestamp: string;
  actorId: string;
  actorName: string;
  actorRole: 'company' | 'distributor' | 'partner';
  action: string; // e.g. 'Order Approved', 'Machine Assigned'
  entityType: 'order' | 'machine' | 'settlement' | 'payment' | 'agreement' | 'organization';
  entityId: string;
  details?: string;
  // Context ids help filter logs for specific roles (e.g. distributorId, partnerId)
  distributorId?: string; 
  partnerId?: string;
}
