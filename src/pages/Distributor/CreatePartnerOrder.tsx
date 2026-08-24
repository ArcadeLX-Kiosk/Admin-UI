import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { useOrder } from '../../mock/orderContext';
import { useOrg } from '../../mock/orgContext';
import { useAuth } from '../../app/authContext';
import { Button } from '../../components/ui/Button';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/Card';
import { Input } from '../../components/ui/Input';
import { Select } from '../../components/ui/Select';
import { OrderType, OrderSource } from '../../types/order';

export function DistributorCreatePartnerOrder() {
  const navigate = useNavigate();
  const { addOrder, orders } = useOrder();
  const { partners } = useOrg();
  const { user } = useAuth();
  
  const myPartners = partners.filter(p => p.distributorId === user?.id);

  const year = new Date().getFullYear();
  const count = orders.filter(o => o.orderNumber.includes(`ORD-${year}-`)).length + 1;
  const predictedCode = `ORD-${year}-${count.toString().padStart(6, '0')}`;

  const [formData, setFormData] = useState({
    partnerId: '',
    quantity: '2',
    type: 'machine_allocation' as OrderType,
    source: 'phone_call' as OrderSource,
    remarks: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !formData.partnerId) return;

    addOrder({
      createdBy: user.id,
      createdByRole: 'distributor',
      requestedBy: user.id,
      requestedByRole: 'distributor',
      requestedTo: formData.partnerId,
      requestedToRole: 'partner',
      direction: 'distributor_to_partner',
      type: formData.type,
      quantity: Number(formData.quantity),
      source: formData.source,
      remarks: formData.remarks,
      requestedDate: new Date().toISOString(),
    });

    navigate('/distributor/orders');
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <div className="space-y-6 max-w-3xl mx-auto">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="sm" onClick={() => navigate(-1)}>
          <ArrowLeft className="h-4 w-4 mr-2" /> Back
        </Button>
        <h1 className="text-2xl font-bold text-slate-900">Create Partner Order</h1>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Order Details</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="p-4 bg-slate-50 border border-slate-200 rounded-lg flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-500">Auto-generated Order Number</p>
                <p className="text-2xl font-bold font-mono text-slate-900">{predictedCode}</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Select 
                required 
                label="Partner" 
                name="partnerId" 
                value={formData.partnerId} 
                onChange={handleChange}
                options={[
                  { label: '-- Select Partner --', value: '' },
                  ...myPartners.map(p => ({ label: p.businessName, value: p.id }))
                ]}
              />

              <Input 
                required 
                label="Quantity" 
                type="number" 
                name="quantity" 
                min="1"
                value={formData.quantity} 
                onChange={handleChange} 
              />
              
              <Select 
                required 
                label="Order Type" 
                name="type" 
                value={formData.type} 
                onChange={handleChange}
                options={[
                  { label: 'Machine Allocation', value: 'machine_allocation' },
                  { label: 'Machine Replacement', value: 'machine_replacement' },
                ]}
              />

              <Select 
                required 
                label="Source" 
                name="source" 
                value={formData.source} 
                onChange={handleChange}
                options={[
                  { label: 'Phone Call', value: 'phone_call' },
                  { label: 'Email', value: 'email' },
                  { label: 'Meeting', value: 'meeting' },
                  { label: 'Manual Entry', value: 'manual_entry' },
                ]}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Remarks</label>
              <textarea 
                className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                rows={3}
                name="remarks"
                value={formData.remarks}
                onChange={handleChange}
                placeholder="Optional notes..."
              />
            </div>

            <div className="flex justify-end gap-3 border-t border-slate-100 pt-6">
              <Button type="button" variant="outline" onClick={() => navigate(-1)}>Cancel</Button>
              <Button type="submit">Create Order</Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
