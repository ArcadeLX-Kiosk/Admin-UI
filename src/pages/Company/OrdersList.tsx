import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Search, Eye } from 'lucide-react';
import { useOrder } from '../../mock/orderContext';
import { useOrg } from '../../mock/orgContext';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Select } from '../../components/ui/Select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../../components/ui/Table';
import { OrderStatusBadge, OrderDirectionBadge } from '../../components/ui/StatusBadges';

export function CompanyOrdersList() {
  const { orders } = useOrder();
  const { distributors } = useOrg();
  const navigate = useNavigate();
  
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [directionFilter, setDirectionFilter] = useState('all');

  // Company only sees orders where it is involved, or optionally all orders in a global view, 
  // but let's restrict to orders where Company is either requestedBy or requestedTo
  const companyOrders = orders.filter(o => o.requestedByRole === 'company' || o.requestedToRole === 'company');

  const filteredOrders = companyOrders.filter(o => {
    const matchesSearch = o.orderNumber.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = statusFilter === 'all' || o.status === statusFilter;
    const matchesDirection = directionFilter === 'all' || o.direction === directionFilter;
    return matchesSearch && matchesStatus && matchesDirection;
  });

  const getEntityName = (id: string, role: string) => {
    if (role === 'company') return 'Company (You)';
    if (role === 'distributor') return distributors.find(d => d.id === id)?.businessName || id;
    return id;
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Orders & Requests</h1>
          <p className="text-sm text-slate-500">Manage incoming requests and outgoing machine allocations.</p>
        </div>
        <Button onClick={() => navigate('/company/orders/new')}>
          <Plus className="mr-2 h-4 w-4" /> Create Order
        </Button>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-slate-200">
        <div className="p-4 border-b border-slate-200 flex flex-col md:flex-row gap-4">
          <div className="relative flex-1 min-w-[200px]">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <Input 
              placeholder="Search Order Number..." 
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9"
            />
          </div>
          
          <div className="flex gap-2 overflow-x-auto pb-1 md:pb-0">
            <Select 
              className="w-48 flex-shrink-0"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              options={[
                { label: 'All Statuses', value: 'all' },
                { label: 'Requested', value: 'requested' },
                { label: 'Approved', value: 'approved' },
                { label: 'Machines Assigned', value: 'machines_assigned' },
                { label: 'Dispatched', value: 'dispatched' },
                { label: 'Completed', value: 'completed' },
              ]}
            />
            
            <Select 
              className="w-48 flex-shrink-0"
              value={directionFilter}
              onChange={(e) => setDirectionFilter(e.target.value)}
              options={[
                { label: 'All Directions', value: 'all' },
                { label: 'Company → Distributor', value: 'company_to_distributor' },
                { label: 'Distributor → Company', value: 'distributor_to_company' },
              ]}
            />
          </div>
        </div>

        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Order Number</TableHead>
              <TableHead>Direction</TableHead>
              <TableHead>Counterparty</TableHead>
              <TableHead>Qty</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Date</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredOrders.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center h-32 text-slate-500">
                  No orders found.
                </TableCell>
              </TableRow>
            ) : (
              filteredOrders.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()).map(order => {
                const isIncoming = order.requestedToRole === 'company';
                const counterpartyId = isIncoming ? order.requestedBy : order.requestedTo;
                const counterpartyRole = isIncoming ? order.requestedByRole : order.requestedToRole;

                return (
                  <TableRow key={order.id}>
                    <TableCell>
                      <div className="font-semibold font-mono text-slate-900">{order.orderNumber}</div>
                      <div className="text-xs text-slate-500 capitalize">{order.type.replace('_', ' ')}</div>
                    </TableCell>
                    <TableCell>
                      <OrderDirectionBadge direction={order.direction} />
                    </TableCell>
                    <TableCell>
                      <div className="text-sm font-medium text-slate-700">
                        {getEntityName(counterpartyId, counterpartyRole)}
                      </div>
                      <div className="text-xs text-slate-500">
                        {isIncoming ? 'Requested from us' : 'Sent by us'}
                      </div>
                    </TableCell>
                    <TableCell className="font-medium">{order.quantity}</TableCell>
                    <TableCell>
                      <OrderStatusBadge status={order.status} />
                    </TableCell>
                    <TableCell className="text-sm text-slate-500">
                      {new Date(order.createdAt).toLocaleDateString()}
                    </TableCell>
                    <TableCell className="text-right">
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={() => navigate(`/company/orders/${order.id}`)}
                      >
                        <Eye className="h-4 w-4 mr-2" /> View
                      </Button>
                    </TableCell>
                  </TableRow>
                );
              })
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
