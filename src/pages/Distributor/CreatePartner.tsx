import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { useOrg } from '../../mock/orgContext';
import { useAuth } from '../../app/authContext';
import { Button } from '../../components/ui/Button';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/Card';
import { Input } from '../../components/ui/Input';

export function CreatePartner() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { addPartner } = useOrg();
  const [formData, setFormData] = useState({
    businessName: '',
    contactPerson: '',
    email: '',
    phone: '',
    gstNumber: '',
    address: '',
    city: '',
    state: '',
    postalCode: '',
    country: 'India',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    addPartner({
      ...formData,
      distributorId: user.id, // Set the distributor ID to the logged-in user
      status: 'active',
    });
    // In a real app, we'd toast here.
    navigate('/distributor/partners');
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <div className="space-y-6 max-w-3xl mx-auto">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="sm" onClick={() => navigate(-1)}>
          <ArrowLeft className="h-4 w-4 mr-2" /> Back
        </Button>
        <h1 className="text-2xl font-bold text-slate-900">Add Partner</h1>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Partner Information</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Input required label="Business Name" name="businessName" value={formData.businessName} onChange={handleChange} />
              <Input required label="GST Number" name="gstNumber" value={formData.gstNumber} onChange={handleChange} />
              <Input required label="Contact Person" name="contactPerson" value={formData.contactPerson} onChange={handleChange} />
              <Input required label="Email Address" type="email" name="email" value={formData.email} onChange={handleChange} />
              <Input required label="Phone Number" name="phone" value={formData.phone} onChange={handleChange} />
            </div>

            <div className="border-t border-slate-100 pt-6">
              <h3 className="text-sm font-medium text-slate-900 mb-4">Address Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="md:col-span-2">
                  <Input required label="Street Address" name="address" value={formData.address} onChange={handleChange} />
                </div>
                <Input required label="City" name="city" value={formData.city} onChange={handleChange} />
                <Input required label="State" name="state" value={formData.state} onChange={handleChange} />
                <Input required label="Postal Code" name="postalCode" value={formData.postalCode} onChange={handleChange} />
                <Input required label="Country" name="country" value={formData.country} onChange={handleChange} disabled />
              </div>
            </div>

            <div className="flex justify-end gap-3 border-t border-slate-100 pt-6">
              <Button type="button" variant="outline" onClick={() => navigate(-1)}>Cancel</Button>
              <Button type="submit">Save Partner</Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
