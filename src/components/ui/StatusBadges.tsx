import React from 'react';
import { Badge } from '../ui/Badge';
import { AgreementStatus } from '../../types/organization';
import { MachineStatus } from '../../types/machine';
import { OrderStatus, OrderDirection } from '../../types/order';

export function AgreementStatusBadge({ status }: { status: AgreementStatus }) {
  switch (status) {
    case 'active':
      return <Badge variant="success">Active</Badge>;
    case 'draft':
      return <Badge variant="neutral">Draft</Badge>;
    case 'expired':
      return <Badge variant="warning">Expired</Badge>;
    case 'terminated':
      return <Badge variant="danger">Terminated</Badge>;
    default:
      return <Badge>{status}</Badge>;
  }
}

export function OrgStatusBadge({ status }: { status: 'active' | 'inactive' }) {
  return status === 'active' 
    ? <Badge variant="success">Active</Badge> 
    : <Badge variant="neutral">Inactive</Badge>;
}

export function MachineStatusBadge({ status }: { status: MachineStatus }) {
  const map: Record<MachineStatus, { variant: 'default' | 'success' | 'warning' | 'danger' | 'neutral', label: string }> = {
    'manufactured': { variant: 'neutral', label: 'Manufactured' },
    'registered': { variant: 'neutral', label: 'Registered' },
    'available': { variant: 'success', label: 'Available' },
    'reserved': { variant: 'warning', label: 'Reserved' },
    'assigned_to_distributor': { variant: 'default', label: 'Assigned to Distributor' },
    'assigned_to_partner': { variant: 'default', label: 'Assigned to Partner' },
    'dispatched': { variant: 'warning', label: 'Dispatched' },
    'installed': { variant: 'success', label: 'Installed' },
    'activated': { variant: 'success', label: 'Activated' },
    'active': { variant: 'success', label: 'Active' },
    'maintenance': { variant: 'warning', label: 'Maintenance' },
    'returned': { variant: 'neutral', label: 'Returned' },
    'retired': { variant: 'danger', label: 'Retired' },
  };

  const config = map[status];
  if (!config) return <Badge>{status}</Badge>;

  return <Badge variant={config.variant}>{config.label}</Badge>;
}
export function OrderStatusBadge({ status }: { status: OrderStatus }) {
  const map: Record<OrderStatus, { variant: 'default' | 'success' | 'warning' | 'danger' | 'neutral', label: string }> = {
    'draft': { variant: 'neutral', label: 'Draft' },
    'requested': { variant: 'warning', label: 'Requested' },
    'under_review': { variant: 'warning', label: 'Under Review' },
    'approved': { variant: 'success', label: 'Approved' },
    'inventory_reserved': { variant: 'success', label: 'Inventory Reserved' },
    'machines_assigned': { variant: 'success', label: 'Machines Assigned' },
    'dispatched': { variant: 'success', label: 'Dispatched' },
    'delivered': { variant: 'success', label: 'Delivered' },
    'installed': { variant: 'success', label: 'Installed' },
    'activated': { variant: 'success', label: 'Activated' },
    'completed': { variant: 'success', label: 'Completed' },
    'rejected': { variant: 'danger', label: 'Rejected' },
    'cancelled': { variant: 'neutral', label: 'Cancelled' },
  };

  const config = map[status];
  if (!config) return <Badge>{status}</Badge>;

  return <Badge variant={config.variant}>{config.label}</Badge>;
}

export function OrderDirectionBadge({ direction }: { direction: OrderDirection }) {
  const map: Record<OrderDirection, string> = {
    'company_to_distributor': 'Company → Distributor',
    'distributor_to_company': 'Distributor → Company',
    'distributor_to_partner': 'Distributor → Partner',
    'partner_to_distributor': 'Partner → Distributor',
  };

  return <Badge variant="neutral" className="font-mono text-[10px]">{map[direction]}</Badge>;
}

export function SettlementStatusBadge({ status }: { status: string }) {
  const styles: Record<string, string> = {
    draft: 'bg-slate-100 text-slate-700 border-slate-200',
    generated: 'bg-blue-50 text-blue-700 border-blue-200',
    verified: 'bg-indigo-50 text-indigo-700 border-indigo-200',
    approved: 'bg-purple-50 text-purple-700 border-purple-200',
    payment_pending: 'bg-orange-50 text-orange-700 border-orange-200',
    paid: 'bg-green-50 text-green-700 border-green-200',
    closed: 'bg-slate-100 text-slate-700 border-slate-200',
    rejected: 'bg-red-50 text-red-700 border-red-200',
    cancelled: 'bg-red-50 text-red-700 border-red-200',
    payment_failed: 'bg-red-50 text-red-700 border-red-200',
  };

  const style = styles[status] || 'bg-slate-100 text-slate-700 border-slate-200';

  return (
    <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium border ${style} capitalize inline-flex items-center`}>
      {status.replace('_', ' ')}
    </span>
  );
}
