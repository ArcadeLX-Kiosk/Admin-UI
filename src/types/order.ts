export type OrderStatus = 
  | 'draft' 
  | 'requested' 
  | 'under_review' 
  | 'approved' 
  | 'inventory_reserved' 
  | 'machines_assigned' 
  | 'dispatched' 
  | 'delivered' 
  | 'installed' 
  | 'activated' 
  | 'completed'
  | 'rejected'
  | 'cancelled';

export type OrderDirection = 
  | 'company_to_distributor'
  | 'distributor_to_company'
  | 'distributor_to_partner'
  | 'partner_to_distributor';

export type OrderSource = 
  | 'portal_request'
  | 'phone_call'
  | 'email'
  | 'meeting'
  | 'manual_entry';

export type OrderType = 
  | 'machine_request'
  | 'machine_allocation'
  | 'machine_replacement'
  | 'additional_machines'
  | 'return_request';

export interface OrderEvent {
  id: string;
  orderId: string;
  status: OrderStatus;
  timestamp: string;
  actor: string;
  remarks?: string;
}

export interface Order {
  id: string;
  orderNumber: string; // ORD-YYYY-NNNNNN
  createdBy: string;
  createdByRole: 'company' | 'distributor' | 'partner';
  requestedBy: string; // ID of the org requesting
  requestedByRole: 'company' | 'distributor' | 'partner';
  requestedTo: string; // ID of the org being requested from
  requestedToRole: 'company' | 'distributor' | 'partner';
  direction: OrderDirection;
  type: OrderType;
  quantity: number;
  assignedMachineIds: string[];
  status: OrderStatus;
  source: OrderSource;
  remarks: string;
  
  // Timestamps
  createdAt: string;
  requestedDate: string;
  approvedAt?: string;
  dispatchedAt?: string;
  deliveredAt?: string;
  installedAt?: string;
  completedAt?: string;
}
