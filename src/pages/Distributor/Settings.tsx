import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';

export function DistributorSettings() {
  return (
    <div className="space-y-6 max-w-4xl">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Settings</h1>
          <p className="text-slate-500">Manage your distributor preferences.</p>
        </div>
        <Button variant="primary">Save Changes</Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Business Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Business Name</label>
            <input type="text" className="w-full max-w-md rounded-md border-slate-300 shadow-sm px-3 py-2 border" defaultValue="Demo Distributor" />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Contact Email</label>
            <input type="email" className="w-full max-w-md rounded-md border-slate-300 shadow-sm px-3 py-2 border" defaultValue="admin@distributor.demo" />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Notification Preferences</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between py-3 border-b border-slate-100">
            <div>
              <p className="font-medium text-slate-900">Email Notifications</p>
              <p className="text-sm text-slate-500">Receive email alerts for new settlements and payments.</p>
            </div>
            <div className="relative inline-block w-10 mr-2 align-middle select-none transition duration-200 ease-in">
              <input type="checkbox" name="toggle" id="toggle1" defaultChecked className="toggle-checkbox absolute block w-6 h-6 rounded-full bg-white border-4 appearance-none cursor-pointer border-slate-300" />
              <label htmlFor="toggle1" className="toggle-label block overflow-hidden h-6 rounded-full bg-slate-300 cursor-pointer"></label>
            </div>
          </div>
          <div className="flex items-center justify-between py-3">
            <div>
              <p className="font-medium text-slate-900">SMS Alerts</p>
              <p className="text-sm text-slate-500">Receive SMS alerts for critical machine offline events.</p>
            </div>
            <div className="relative inline-block w-10 mr-2 align-middle select-none transition duration-200 ease-in">
              <input type="checkbox" name="toggle" id="toggle2" className="toggle-checkbox absolute block w-6 h-6 rounded-full bg-white border-4 appearance-none cursor-pointer border-slate-300" />
              <label htmlFor="toggle2" className="toggle-label block overflow-hidden h-6 rounded-full bg-slate-300 cursor-pointer"></label>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
