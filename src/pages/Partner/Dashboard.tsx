import React from 'react';
import { useAuth } from '../../app/authContext';
import { useMachine } from '../../mock/machineContext';
import { useSettlement } from '../../mock/settlementContext';
import { useNotification } from '../../mock/notificationContext';
import { StatCard } from '../../components/dashboard/StatCard';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/Card';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { MonitorSmartphone, IndianRupee, CheckCircle2, AlertCircle, FileText } from 'lucide-react';

export function PartnerDashboard() {
  const { user } = useAuth();
  const { machines } = useMachine();
  const { partnerSettlements, payments, partnerReceivables } = useSettlement();
  const { notifications } = useNotification();

  // Metrics
  const myMachines = machines.filter(m => m.partnerId === user?.id);
  const activeMachines = myMachines.filter(m => m.status === 'active' || m.status === 'installed').length;
  
  const mySettlements = partnerSettlements.filter(s => s.partnerId === user?.id);
  const totalPartnerEntitlement = mySettlements.reduce((acc, curr) => acc + curr.partnerPayableAmount, 0);
  
  const pendingAmount = partnerReceivables
    .filter(r => r.partnerId === user?.id && r.status === 'payment_pending')
    .reduce((acc, curr) => acc + curr.amount, 0);
  
  const receivedFromDistributor = payments.filter(p => p.recipientId === user?.id && p.status === 'paid').reduce((acc, curr) => acc + curr.amount, 0);
  
  // Revenue Trend (Mock Monthly) - using Partner Entitlement
  const revenueData = [
    { name: 'Jan', entitlement: 125000 },
    { name: 'Feb', entitlement: 142000 },
    { name: 'Mar', entitlement: 161000 },
    { name: 'Apr', entitlement: 159000 },
    { name: 'May', entitlement: 172000 },
    { name: 'Jun', entitlement: 181000 },
    { name: 'Jul', entitlement: 195000 },
    { name: 'Aug', entitlement: totalPartnerEntitlement > 195000 ? totalPartnerEntitlement : 215000 },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Partner Dashboard</h1>
          <p className="text-slate-500">Track your machine earnings and settlement payouts.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Partner Entitlement"
          value={`₹${totalPartnerEntitlement.toLocaleString('en-IN')}`}
          icon={<IndianRupee className="w-6 h-6 text-indigo-600" />}
          description="Your final share of revenue"
        />
        <StatCard
          title="Amount Received"
          value={`₹${receivedFromDistributor.toLocaleString('en-IN')}`}
          icon={<CheckCircle2 className="w-6 h-6 text-emerald-600" />}
          description="Paid by Distributor"
        />
        <StatCard
          title="Pending Settlements"
          value={`₹${pendingAmount.toLocaleString('en-IN')}`}
          icon={<AlertCircle className="w-6 h-6 text-yellow-600" />}
          description="Awaiting Payment"
        />
        <StatCard
          title="Active Machines"
          value={activeMachines.toString()}
          icon={<MonitorSmartphone className="w-6 h-6 text-blue-600" />}
          description={`Out of ${myMachines.length} total`}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Partner Entitlement Trend (2026)</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={revenueData}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} />
                  <YAxis 
                    axisLine={false} 
                    tickLine={false} 
                    tickFormatter={(value) => `₹${(value / 1000).toFixed(0)}k`} 
                  />
                  <Tooltip 
                    formatter={(value: any) => [`₹${value.toLocaleString('en-IN')}`, 'Entitlement']}
                    cursor={{fill: '#f8fafc'}}
                  />
                  <Bar dataKey="entitlement" fill="#0ea5e9" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Notifications</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {notifications.filter(n => n.recipientId === user?.id && !n.isRead).slice(0, 5).map(n => (
                <div key={n.id} className="flex gap-3 items-start p-3 bg-slate-50 rounded-md border border-slate-100">
                  <FileText className="w-5 h-5 text-indigo-600 shrink-0 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-slate-900">{n.title}</p>
                    <p className="text-xs text-slate-500 mt-1">{n.message}</p>
                  </div>
                </div>
              ))}
              {notifications.filter(n => n.recipientId === user?.id && !n.isRead).length === 0 && (
                <div className="text-sm text-slate-500 text-center py-4">No recent notifications</div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

    </div>
  );
}
