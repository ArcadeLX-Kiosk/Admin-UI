import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { useOrder } from '../../mock/orderContext';
import { useAuth } from '../../app/authContext';
import { Button } from '../../components/ui/Button';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/Card';
import { Input } from '../../components/ui/Input';
import { Select } from '../../components/ui/Select';
import { OrderType, OrderSource } from '../../types/order';

export function PartnerCreateRequest() {
  const navigate = useNavigate();
  const { addOrder, orders } = useOrder();
  const { user } = useAuth();
  
  const year = new Date().getFullYear();
  const count = orders.filter(o => o.orderNumber.includes(`ORD-${year}-`)).length + 1;
  const predictedCode = `ORD-${year}-${count.toString().padStart(6, '0')}`;

  const [formData, setFormData] = useState({
    quantity: '3',
    type: 'machine_request' as OrderType,
    source: 'portal_request' as OrderSource,
    remarks: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    addOrder({
      createdBy: user.id,
      createdByRole: 'partner',
      requestedBy: user.id,
      requestedByRole: 'partner',
      requestedTo: 'dist-1', // Assuming this partner belongs to dist-1 for demo simplicity. Ideally we lookup user.distributorId.
      requestedToRole: 'distributor',
      direction: 'partner_to_distributor',
      type: formData.type,
      quantity: Number(formData.quantity),
      source: formData.source,
      remarks: formData.remarks,
      requestedDate: new Date().toISOString(),
    });

    navigate('/partner/orders');
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
        <h1 className="text-2xl font-bold text-slate-900">Request Machines</h1>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Request Details</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="p-4 bg-slate-50 border border-slate-200 rounded-lg flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-500">Auto-generated Request Number</p>
                <p className="text-2xl font-bold font-mono text-slate-900">{predictedCode}</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
                label="Request Type" 
                name="type" 
                value={formData.type} 
                onChange={handleChange}
                options={[
                  { label: 'Machine Request', value: 'machine_request' },
                  { label: 'Additional Machines', value: 'additional_machines' },
                  { label: 'Machine Replacement', value: 'machine_replacement' },
                ]}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Business Reason</label>
              <textarea 
                className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                rows={3}
                name="remarks"
                value={formData.remarks}
                onChange={handleChange}
                placeholder="Why do you need more machines?"
              />
            </div>

            <div className="flex justify-end gap-3 border-t border-slate-100 pt-6">
              <Button type="button" variant="outline" onClick={() => navigate(-1)}>Cancel</Button>
              <Button type="submit">Submit Request</Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
