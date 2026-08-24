import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Search, Eye } from 'lucide-react';
import { useOrder } from '../../mock/orderContext';
import { useOrg } from '../../mock/orgContext';
import { useAuth } from '../../app/authContext';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Select } from '../../components/ui/Select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../../components/ui/Table';
import { OrderStatusBadge, OrderDirectionBadge } from '../../components/ui/StatusBadges';

export function PartnerOrdersList() {
  const { user } = useAuth();
  const { orders } = useOrder();
  const { distributors } = useOrg();
  const navigate = useNavigate();
  
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  // Partner sees orders where they are involved
  const myOrders = orders.filter(o => 
    (o.requestedByRole === 'partner' && o.requestedBy === user?.id) || 
    (o.requestedToRole === 'partner' && o.requestedTo === user?.id)
  );

  const filteredOrders = myOrders.filter(o => {
    const matchesSearch = o.orderNumber.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = statusFilter === 'all' || o.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const getEntityName = (id: string, role: string) => {
    if (role === 'partner') return 'You';
    if (role === 'distributor') return distributors.find(d => d.id === id)?.businessName || 'Distributor';
    return id;
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">My Orders</h1>
          <p className="text-sm text-slate-500">Track incoming machine orders and your requests.</p>
        </div>
        <Button onClick={() => navigate('/partner/orders/new')}>
          <Plus className="mr-2 h-4 w-4" /> Request Machines
        </Button>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-slate-200">
        <div className="p-4 border-b border-slate-200 flex flex-col md:flex-row gap-4">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <Input 
              placeholder="Search Order Number..." 
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9"
            />
          </div>
          
          <Select 
            className="w-48"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            options={[
              { label: 'All Statuses', value: 'all' },
              { label: 'Requested', value: 'requested' },
              { label: 'Approved', value: 'approved' },
              { label: 'Completed', value: 'completed' },
            ]}
          />
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
                const isIncoming = order.requestedToRole === 'partner';
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
                        onClick={() => navigate(`/partner/orders/${order.id}`)}
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
