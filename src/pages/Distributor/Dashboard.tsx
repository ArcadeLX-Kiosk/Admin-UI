import React from 'react';
import { useAuth } from '../../app/authContext';
import { useOrg } from '../../mock/orgContext';
import { useMachine } from '../../mock/machineContext';
import { useOrder } from '../../mock/orderContext';
import { useSettlement } from '../../mock/settlementContext';
import { useNotification } from '../../mock/notificationContext';
import { StatCard } from '../../components/dashboard/StatCard';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/Card';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Users, MonitorSmartphone, IndianRupee, Wallet, FileText, CheckCircle2, AlertCircle } from 'lucide-react';

export function DistributorDashboard() {
  const { user } = useAuth();
  const { partners } = useOrg();
  const { machines } = useMachine();
  const { settlements, partnerSettlements, payments } = useSettlement();
  const { notifications } = useNotification();

  // Metrics
  const myMachines = machines.filter(m => m.distributorId === user?.id);
  const activeMachines = myMachines.filter(m => m.status === 'active' || m.status === 'installed').length;
  const myPartners = partners.filter(p => p.distributorId === user?.id).length;
  
  const totalGrossRevenue = myMachines.reduce((acc: any, curr: any) => acc + (curr.totalRevenue || 0), 0);
  
  const mySettlements = settlements.filter(s => s.distributorId === user?.id);
  const totalEntitlement = mySettlements.reduce((acc, curr) => acc + curr.distributorShareAmount, 0);
  
  const pendingCompanySettlements = mySettlements.filter(s => s.status === 'payment_pending').length;
  
  const receivedFromCompany = payments.filter(p => p.recipientId === user?.id && p.status === 'paid').reduce((acc, curr) => acc + curr.amount, 0);
  
  const pendingPartnerSettlements = partnerSettlements.filter(s => s.distributorId === user?.id && s.status === 'payment_pending').length;
  
  const myPartnerSettlements = partnerSettlements.filter(s => s.distributorId === user?.id);
  const paidToPartners = payments.filter(p => p.senderId === user?.id && p.status === 'paid').reduce((acc, curr) => acc + curr.amount, 0);
  
  // Downstream retained (approximate based on settlements)
  const distRetainedDownstream = myPartnerSettlements.reduce((acc, curr) => acc + curr.distributorRetainedAmount, 0);

  // Revenue Trend (Mock Monthly) - using Distributor Entitlement as the metric
  const revenueData = [
    { name: 'Jan', entitlement: 450000 },
    { name: 'Feb', entitlement: 520000 },
    { name: 'Mar', entitlement: 610000 },
    { name: 'Apr', entitlement: 590000 },
    { name: 'May', entitlement: 720000 },
    { name: 'Jun', entitlement: 810000 },
    { name: 'Jul', entitlement: 950000 },
    { name: 'Aug', entitlement: totalEntitlement > 950000 ? totalEntitlement : 1150000 },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Distributor Dashboard</h1>
          <p className="text-slate-500">Track your entitlements, machine performance, and partner payouts.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Distributor Entitlement"
          value={`₹${totalEntitlement.toLocaleString('en-IN')}`}
          icon={<IndianRupee className="w-6 h-6 text-indigo-600" />}
          description="Your share from Company"
        />
        <StatCard
          title="Distributor Retained"
          value={`₹${distRetainedDownstream.toLocaleString('en-IN')}`}
          icon={<Wallet className="w-6 h-6 text-emerald-600" />}
          description="Retained after Partner splits"
        />
        <StatCard
          title="Active Machines"
          value={activeMachines.toString()}
          icon={<MonitorSmartphone className="w-6 h-6 text-blue-600" />}
          description={`Out of ${myMachines.length} total machines`}
        />
        <StatCard
          title="Active Partners"
          value={myPartners.toString()}
          icon={<Users className="w-6 h-6 text-purple-600" />}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Received from Company"
          value={`₹${receivedFromCompany.toLocaleString('en-IN')}`}
          icon={<CheckCircle2 className="w-6 h-6 text-green-600" />}
        />
        <StatCard
          title="Pending Company Settlement"
          value={pendingCompanySettlements.toString()}
          icon={<AlertCircle className="w-6 h-6 text-yellow-600" />}
        />
        <StatCard
          title="Paid to Partners"
          value={`₹${paidToPartners.toLocaleString('en-IN')}`}
          icon={<FileText className="w-6 h-6 text-slate-600" />}
        />
        <StatCard
          title="Pending Partner Settlements"
          value={pendingPartnerSettlements.toString()}
          icon={<AlertCircle className="w-6 h-6 text-orange-600" />}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Distributor Entitlement Trend (2026)</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={revenueData}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} />
                  <YAxis 
                    axisLine={false} 
                    tickLine={false} 
                    tickFormatter={(value) => `₹${(value / 100000).toFixed(1)}L`} 
                  />
                  <Tooltip 
                    formatter={(value: any) => [`₹${value.toLocaleString('en-IN')}`, 'Entitlement']}
                    cursor={{fill: '#f8fafc'}}
                  />
                  <Line type="monotone" dataKey="entitlement" stroke="#4f46e5" strokeWidth={3} dot={{r: 4, fill: '#4f46e5'}} activeDot={{r: 6}} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Operational Alerts</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {notifications.filter(n => n.recipientId === user?.id && !n.isRead).slice(0, 5).map(n => (
                <div key={n.id} className="flex gap-3 items-start p-3 bg-slate-50 rounded-md border border-slate-100">
                  <AlertCircle className="w-5 h-5 text-indigo-600 shrink-0 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-slate-900">{n.title}</p>
                    <p className="text-xs text-slate-500 mt-1">{n.message}</p>
                  </div>
                </div>
              ))}
              {notifications.filter(n => n.recipientId === user?.id && !n.isRead).length === 0 && (
                <div className="text-sm text-slate-500 text-center py-4">No pending alerts</div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

    </div>
  );
}
