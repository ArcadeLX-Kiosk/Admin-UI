import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, CheckCircle2, XCircle, Truck, Package, PackageCheck, Settings, Play } from 'lucide-react';
import { useOrder } from '../../mock/orderContext';
import { useOrg } from '../../mock/orgContext';
import { useMachine } from '../../mock/machineContext';
import { Button } from '../../components/ui/Button';
import { Card, CardHeader, CardTitle, CardContent } from '../../components/ui/Card';
import { OrderStatusBadge, OrderDirectionBadge } from '../../components/ui/StatusBadges';
import { Modal } from '../../components/ui/Modal';
import { Select } from '../../components/ui/Select';
import { OrderStatus } from '../../types/order';

export function OrderDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { orders, orderEvents, updateOrderStatus, assignMachinesToOrder } = useOrder();
  const { distributors, partners } = useOrg();
  const { machines, assignMachine, updateMachineStatus } = useMachine();
  
  const order = orders.find(o => o.id === id);
  const events = orderEvents.filter(e => e.orderId === id).sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());

  const [isAssignModalOpen, setIsAssignModalOpen] = useState(false);
  const [selectedMachineIds, setSelectedMachineIds] = useState<string[]>([]);
  const [errorMsg, setErrorMsg] = useState('');

  if (!order) {
    return <div className="p-8 text-center text-slate-500">Order not found.</div>;
  }

  const isIncoming = order.requestedToRole === 'company';
  const counterpartyId = isIncoming ? order.requestedBy : order.requestedTo;
  const counterpartyRole = isIncoming ? order.requestedByRole : order.requestedToRole;
  
  const getEntityName = (cId: string, role: string) => {
    if (role === 'company') return 'Company (You)';
    if (role === 'distributor') return distributors.find(d => d.id === cId)?.businessName || cId;
    if (role === 'partner') return partners.find(p => p.id === cId)?.businessName || cId;
    return cId;
  };

  const availableInventoryCount = machines.filter(m => m.status === 'available').length;

  const handleApprove = () => {
    if (availableInventoryCount < order.quantity) {
      alert(`Insufficient available inventory. Only ${availableInventoryCount} machines are currently available. You cannot approve this order.`);
      return;
    }
    updateOrderStatus(order.id, 'approved', 'Company Admin', 'Order approved by Company.');
  };

  const handleReserve = () => {
    // In a real system, this locks the inventory count. Here we just advance the state.
    updateOrderStatus(order.id, 'inventory_reserved', 'Company Admin', 'Inventory reserved.');
  };

  const handleReject = () => {
    updateOrderStatus(order.id, 'rejected', 'Company Admin', 'Order rejected.');
  };

  const handleAssignMachinesSubmit = () => {
    if (selectedMachineIds.length !== order.quantity) {
      setErrorMsg(`You must select exactly ${order.quantity} machines.`);
      return;
    }
    
    // Assign in order context
    assignMachinesToOrder(order.id, selectedMachineIds, 'Company Admin');
    
    // Assign in machine context
    const distId = order.requestedToRole === 'distributor' ? order.requestedTo : (order.requestedByRole === 'distributor' ? order.requestedBy : null);
    const partId = order.requestedToRole === 'partner' ? order.requestedTo : (order.requestedByRole === 'partner' ? order.requestedBy : null);
    
    selectedMachineIds.forEach(mId => {
      if (distId) {
        assignMachine(mId, distId, partId || undefined);
      }
    });

    setIsAssignModalOpen(false);
  };

  const toggleMachineSelection = (mId: string) => {
    if (selectedMachineIds.includes(mId)) {
      setSelectedMachineIds(prev => prev.filter(id => id !== mId));
    } else {
      if (selectedMachineIds.length < order.quantity) {
        setSelectedMachineIds(prev => [...prev, mId]);
      }
    }
  };

  const handleAdvanceState = (nextState: OrderStatus, actionText: string) => {
    updateOrderStatus(order.id, nextState, 'Company Admin', `Marked as ${actionText}.`);
    
    // Also update machine states conceptually if they were assigned
    if (nextState === 'dispatched') {
      order.assignedMachineIds.forEach(mId => updateMachineStatus(mId, 'dispatched'));
    } else if (nextState === 'delivered') {
      order.assignedMachineIds.forEach(mId => updateMachineStatus(mId, 'installed')); // Delivery implies physical dropoff
    } else if (nextState === 'activated' || nextState === 'completed') {
      order.assignedMachineIds.forEach(mId => updateMachineStatus(mId, 'active'));
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="sm" onClick={() => navigate('/company/orders')}>
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
        
        {/* Left Column */}
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
              <CardTitle>Fulfillment / Assignment</CardTitle>
            </CardHeader>
            <CardContent>
              {order.assignedMachineIds.length > 0 ? (
                <div className="space-y-4">
                  <p className="text-sm text-slate-500 mb-2">The following machines are attached to this order:</p>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                    {order.assignedMachineIds.map(mId => {
                      const m = machines.find(mac => mac.id === mId);
                      return (
                        <div key={mId} className="p-3 bg-slate-50 border border-slate-200 rounded-lg flex items-center justify-between cursor-pointer hover:bg-slate-100" onClick={() => navigate(`/company/machines/${mId}`)}>
                          <span className="font-mono text-sm font-medium text-slate-900">{m?.machineCode || mId}</span>
                          <span className="text-xs text-slate-500">{m?.serialNumber}</span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              ) : (
                <div className="text-center py-6 text-slate-500">
                  <Package className="h-8 w-8 mx-auto text-slate-300 mb-3" />
                  <p>No machines assigned yet.</p>
                </div>
              )}
            </CardContent>
          </Card>

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
                      {event.remarks && <p className="text-sm mt-1 text-slate-600">{event.remarks}</p>}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Column: Actions */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Workflow Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              
              {order.status === 'requested' && isIncoming && (
                <>
                  <div className="mb-4 p-3 bg-slate-50 border border-slate-200 rounded-md">
                    <p className="text-xs text-slate-500">Available Inventory</p>
                    <p className={`text-lg font-bold ${availableInventoryCount < order.quantity ? 'text-red-600' : 'text-green-600'}`}>
                      {availableInventoryCount} <span className="text-sm font-normal text-slate-500">machines</span>
                    </p>
                    {availableInventoryCount < order.quantity && (
                      <p className="text-xs text-red-500 mt-1">Insufficient inventory to approve.</p>
                    )}
                  </div>
                  <Button className="w-full" onClick={handleApprove}>Approve Request</Button>
                  <Button className="w-full" variant="danger" onClick={handleReject}>Reject Request</Button>
                </>
              )}

              {(order.status === 'approved' || (order.status === 'requested' && !isIncoming)) && (
                <Button className="w-full" onClick={handleReserve}><PackageCheck className="h-4 w-4 mr-2"/> Reserve Inventory</Button>
              )}

              {order.status === 'inventory_reserved' && (
                <Button className="w-full" onClick={() => setIsAssignModalOpen(true)}><Settings className="h-4 w-4 mr-2"/> Assign Machines</Button>
              )}

              {order.status === 'machines_assigned' && (
                <Button className="w-full" onClick={() => handleAdvanceState('dispatched', 'Dispatched')}><Truck className="h-4 w-4 mr-2"/> Dispatch Order</Button>
              )}

              {order.status === 'dispatched' && (
                <Button className="w-full" onClick={() => handleAdvanceState('delivered', 'Delivered')}><CheckCircle2 className="h-4 w-4 mr-2"/> Mark Delivered</Button>
              )}

              {order.status === 'delivered' && (
                <Button className="w-full" onClick={() => handleAdvanceState('installed', 'Installed')}><CheckCircle2 className="h-4 w-4 mr-2"/> Mark Installed</Button>
              )}

              {order.status === 'installed' && (
                <Button className="w-full" onClick={() => handleAdvanceState('completed', 'Completed & Activated')}><Play className="h-4 w-4 mr-2"/> Activate & Complete</Button>
              )}

              {['completed', 'rejected', 'cancelled'].includes(order.status) && (
                <div className="text-center text-sm text-slate-500 py-4">
                  Order is {order.status}. No further actions.
                </div>
              )}

            </CardContent>
          </Card>
        </div>
      </div>

      <Modal
        isOpen={isAssignModalOpen}
        onClose={() => setIsAssignModalOpen(false)}
        title="Assign Machines to Order"
        footer={
          <>
            <Button variant="outline" onClick={() => setIsAssignModalOpen(false)}>Cancel</Button>
            <Button onClick={handleAssignMachinesSubmit}>Confirm Assignment ({selectedMachineIds.length}/{order.quantity})</Button>
          </>
        }
      >
        <div className="space-y-4">
          <p className="text-sm text-slate-600">Select {order.quantity} machine(s) from available inventory to assign to this order.</p>
          
          {errorMsg && <div className="p-2 bg-red-50 text-red-600 text-sm rounded border border-red-100">{errorMsg}</div>}

          <div className="max-h-64 overflow-y-auto border border-slate-200 rounded-md">
            <table className="w-full text-sm">
              <thead className="bg-slate-50 sticky top-0">
                <tr>
                  <th className="p-2 text-left">Select</th>
                  <th className="p-2 text-left">Machine Code</th>
                  <th className="p-2 text-left">Model</th>
                </tr>
              </thead>
              <tbody>
                {machines.filter(m => m.status === 'available').map(m => (
                  <tr key={m.id} className="border-t border-slate-100 hover:bg-slate-50">
                    <td className="p-2">
                      <input 
                        type="checkbox" 
                        className="rounded text-indigo-600 focus:ring-indigo-500"
                        checked={selectedMachineIds.includes(m.id)}
                        onChange={() => toggleMachineSelection(m.id)}
                        disabled={!selectedMachineIds.includes(m.id) && selectedMachineIds.length >= order.quantity}
                      />
                    </td>
                    <td className="p-2 font-mono font-medium">{m.machineCode}</td>
                    <td className="p-2 text-slate-500">{m.model}</td>
                  </tr>
                ))}
                {machines.filter(m => m.status === 'available').length === 0 && (
                  <tr><td colSpan={3} className="p-4 text-center text-slate-500">No available machines found.</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </Modal>

    </div>
  );
}
