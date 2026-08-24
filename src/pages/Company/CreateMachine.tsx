import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { useMachine } from '../../mock/machineContext';
import { useOrg } from '../../mock/orgContext';
import { Button } from '../../components/ui/Button';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/Card';
import { Input } from '../../components/ui/Input';
import { Select } from '../../components/ui/Select';

export function CreateMachine() {
  const navigate = useNavigate();
  const { addMachine, machines } = useMachine();
  const { distributors, partners } = useOrg();
  
  // Predict next machine code for UI display (mock behavior)
  const year = new Date().getFullYear();
  const existingCount = machines.filter(m => m.machineCode.includes(`KSK-${year}-`)).length;
  const nextNum = (existingCount + 1).toString().padStart(6, '0');
  const predictedCode = `KSK-${year}-${nextNum}`;

  const [formData, setFormData] = useState({
    model: 'Arcade-LX B2C',
    serialNumber: `SN-KSK-${Math.random().toString(36).substring(2, 8).toUpperCase()}`,
    manufactureDate: new Date().toISOString().split('T')[0],
    firmwareVersion: 'v1.0.0',
    warrantyExpiry: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000 * 2).toISOString().split('T')[0],
    location: '',
    hardwareFingerprint: Math.random().toString(16).substring(2, 14),
    status: 'registered',
    distributorId: '',
    partnerId: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    addMachine({
      ...formData,
      status: formData.status as any,
      distributorId: formData.distributorId || null,
      partnerId: formData.partnerId || null,
      activationDate: null,
      qrCode: `qr-placeholder`,
      isOnline: false,
    });
    navigate('/company/machines');
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <div className="space-y-6 max-w-3xl mx-auto">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="sm" onClick={() => navigate(-1)}>
          <ArrowLeft className="h-4 w-4 mr-2" /> Back
        </Button>
        <h1 className="text-2xl font-bold text-slate-900">Add Machine</h1>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Hardware Details</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="p-4 bg-slate-50 border border-slate-200 rounded-lg flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-500">Auto-generated Machine Code</p>
                <p className="text-2xl font-bold font-mono text-slate-900">{predictedCode}</p>
              </div>
              <div className="text-right">
                <p className="text-xs text-slate-500 max-w-[200px]">This code is guaranteed to be unique and cannot be changed.</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Select 
                required 
                label="Machine Model" 
                name="model" 
                value={formData.model} 
                onChange={handleChange}
                options={[
                  { label: 'Arcade-LX B2B', value: 'Arcade-LX B2B' },
                  { label: 'Arcade-LX B2C', value: 'Arcade-LX B2C' },
                  { label: 'Arcade-LX Corporate', value: 'Arcade-LX Corporate' },
                  { label: 'Arcade-LX Kids', value: 'Arcade-LX Kids' },
                  { label: 'Arcade-LX Healthcare', value: 'Arcade-LX Healthcare' },
                ]}
              />
              <Input required label="Serial Number" name="serialNumber" value={formData.serialNumber} onChange={handleChange} />
              <Input required label="Hardware Fingerprint" name="hardwareFingerprint" value={formData.hardwareFingerprint} onChange={handleChange} />
              <Input required label="Firmware Version" name="firmwareVersion" value={formData.firmwareVersion} onChange={handleChange} />
              <Input required label="Manufacture Date" type="date" name="manufactureDate" value={formData.manufactureDate} onChange={handleChange} />
              <Input required label="Warranty Expiry" type="date" name="warrantyExpiry" value={formData.warrantyExpiry} onChange={handleChange} />
            </div>

            <div className="border-t border-slate-100 pt-6">
              <h3 className="text-sm font-medium text-slate-900 mb-4">Initial Setup</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Input required label="Base Location (City)" name="location" value={formData.location} onChange={handleChange} />
                <Select 
                  label="Initial Status" 
                  name="status" 
                  value={formData.status} 
                  onChange={handleChange}
                  options={[
                    { label: 'Registered (In Factory)', value: 'registered' },
                    { label: 'Available (Company Inventory)', value: 'available' },
                  ]}
                />
                
                {/* Advanced optional assignment on creation */}
                <div className="md:col-span-2 pt-4 border-t border-slate-100">
                  <p className="text-sm text-slate-500 mb-4">Optional: Immediate Assignment</p>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <Select 
                      label="Assign to Distributor" 
                      name="distributorId" 
                      value={formData.distributorId} 
                      onChange={handleChange}
                      options={[
                        { label: '-- None --', value: '' },
                        ...distributors.map(d => ({ label: d.businessName, value: d.id }))
                      ]}
                    />
                    <Select 
                      label="Assign to Partner (Optional)" 
                      name="partnerId" 
                      value={formData.partnerId} 
                      onChange={handleChange}
                      disabled={!formData.distributorId}
                      options={[
                        { label: '-- None --', value: '' },
                        ...partners
                          .filter(p => p.distributorId === formData.distributorId)
                          .map(p => ({ label: p.businessName, value: p.id }))
                      ]}
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-3 border-t border-slate-100 pt-6">
              <Button type="button" variant="outline" onClick={() => navigate(-1)}>Cancel</Button>
              <Button type="submit">Register Machine</Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
