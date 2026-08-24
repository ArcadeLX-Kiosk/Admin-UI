import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Package, Clock } from 'lucide-react';
import { useOrder } from '../../mock/orderContext';
import { useOrg } from '../../mock/orgContext';
import { useMachine } from '../../mock/machineContext';
import { Button } from '../../components/ui/Button';
import { Card, CardHeader, CardTitle, CardContent } from '../../components/ui/Card';
import { OrderStatusBadge, OrderDirectionBadge } from '../../components/ui/StatusBadges';

export function PartnerOrderDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { orders, orderEvents } = useOrder();
  const { distributors } = useOrg();
  const { machines } = useMachine();
  
  const order = orders.find(o => o.id === id);
  const events = orderEvents.filter(e => e.orderId === id).sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());

  if (!order) {
    return <div className="p-8 text-center text-slate-500">Order not found.</div>;
  }

  const getEntityName = (cId: string, role: string) => {
    if (role === 'partner') return 'You';
    if (role === 'distributor') return distributors.find(d => d.id === cId)?.businessName || cId;
    return cId;
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="sm" onClick={() => navigate('/partner/orders')}>
          <ArrowLeft className="h-4 w-4 mr-2" /> Back
        </Button>
        <div className="flex-1">
          <h1 className="text-2xl font-bold font-mono text-slate-900">{order.orderNumber}</h1>
          <div className="flex items-center gap-3 mt-1 text-sm text-slate-500">
            <span className="capitalize">{order.type.replace('_', ' ')}</span>
            <span>•</span>
            <OrderDirectionBadge direction={order.direction} />
            <span>•</span>
            <OrderStatusBadge status={order.status} />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        <div className="space-y-6 xl:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Order Summary</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                <div>
                  <p className="text-xs text-slate-500 mb-1">Requested By</p>
                  <p className="font-medium">{getEntityName(order.requestedBy, order.requestedByRole)}</p>
                </div>
                <div>
                  <p className="text-xs text-slate-500 mb-1">Requested To</p>
                  <p className="font-medium">{getEntityName(order.requestedTo, order.requestedToRole)}</p>
                </div>
                <div>
                  <p className="text-xs text-slate-500 mb-1">Quantity</p>
                  <p className="font-bold text-lg">{order.quantity} <span className="text-sm font-normal text-slate-500">machines</span></p>
                </div>
                <div>
                  <p className="text-xs text-slate-500 mb-1">Source</p>
                  <p className="font-medium capitalize">{order.source.replace('_', ' ')}</p>
                </div>
              </div>
              {order.remarks && (
                <div className="mt-6 p-4 bg-slate-50 rounded-md border border-slate-100">
                  <p className="text-xs font-semibold text-slate-500 mb-1">Remarks</p>
                  <p className="text-sm text-slate-700">{order.remarks}</p>
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Assigned Machines</CardTitle>
            </CardHeader>
            <CardContent>
              {order.assignedMachineIds.length > 0 ? (
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {order.assignedMachineIds.map(mId => {
                    const m = machines.find(mac => mac.id === mId);
                    return (
                      <div key={mId} className="p-3 bg-slate-50 border border-slate-200 rounded-lg flex items-center justify-between">
                        <span className="font-mono text-sm font-medium text-slate-900">{m?.machineCode || mId}</span>
                        <span className="text-xs text-slate-500">{m?.serialNumber}</span>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="text-center py-6 text-slate-500">
                  <Package className="h-8 w-8 mx-auto text-slate-300 mb-3" />
                  <p>No machines assigned yet. Waiting on Distributor.</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Timeline</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="relative border-l border-slate-200 ml-3 space-y-6">
                {events.map((event) => (
                  <div key={event.id} className="relative pl-6">
                    <div className="absolute -left-1.5 top-1.5 w-3 h-3 bg-white border-2 border-indigo-500 rounded-full" />
                    <div>
                      <p className="text-sm font-bold text-slate-900 capitalize">{event.status.replace('_', ' ')}</p>
                      <p className="text-xs text-slate-500">{new Date(event.timestamp).toLocaleString()} • {event.actor}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Status Tracking</CardTitle>
            </CardHeader>
            <CardContent>
              {['requested', 'approved', 'inventory_reserved', 'machines_assigned', 'dispatched'].includes(order.status) ? (
                <div className="text-center p-4 bg-blue-50 text-blue-700 rounded-lg border border-blue-100 flex flex-col items-center">
                  <Clock className="h-6 w-6 mb-2" />
                  <span className="text-sm font-medium">Order is in progress.</span>
                  <span className="text-xs mt-1">Your distributor is managing fulfillment.</span>
                </div>
              ) : (
                <div className="text-center text-sm text-slate-500 py-4">
                  Order is {order.status}.
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
