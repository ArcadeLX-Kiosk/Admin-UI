import React from 'react';
import { useOrg } from '../../mock/orgContext';
import { useMachine } from '../../mock/machineContext';
import { useOrder } from '../../mock/orderContext';
import { useSettlement } from '../../mock/settlementContext';
import { useRevenue } from '../../mock/revenueContext';
import { useNotification } from '../../mock/notificationContext';
import { StatCard } from '../../components/dashboard/StatCard';
import { Card, CardHeader, CardTitle, CardContent } from '../../components/ui/Card';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';
import { Building2, MonitorSmartphone, IndianRupee, Wallet, FileText, CheckCircle2, TrendingUp, AlertCircle, ShoppingCart } from 'lucide-react';

export function CompanyDashboard() {
  const { distributors } = useOrg();
  const { machines } = useMachine();
  const { orders } = useOrder();
  const { settlements, payments, receivables } = useSettlement();
  const { transactions } = useRevenue();
  const { notifications } = useNotification();

  // Metrics
  const totalGrossRevenue = machines.reduce((acc, curr) => acc + (curr.totalRevenue || 0), 0);
  const activeMachines = machines.filter(m => m.status === 'active' || m.status === 'installed').length;
  const activeDistributors = distributors.filter(d => d.status === 'active').length;
  
  const pendingOrders = orders.filter(o => o.status === 'requested').length;
  const pendingSettlements = settlements.filter((s: any) => s.status === 'payment_pending').length;
  
  const totalReceivables = receivables.filter(r => r.status === 'payment_pending').reduce((acc, curr) => acc + curr.amount, 0);
  
  const totalDistributorEntitlement = settlements.filter(s => s.status === 'approved' || s.status === 'paid').reduce((acc: any, curr: any) => acc + curr.distributorShareAmount, 0);
  
  const companyRetainedRevenue = settlements.reduce((acc: any, curr: any) => acc + curr.companyShareAmount, 0);

  // Revenue Trend (Mock Monthly)
  const revenueData = [
    { name: 'Jan', revenue: 1200000 },
    { name: 'Feb', revenue: 1500000 },
    { name: 'Mar', revenue: 2100000 },
    { name: 'Apr', revenue: 1900000 },
    { name: 'May', revenue: 2800000 },
    { name: 'Jun', revenue: 3100000 },
    { name: 'Jul', revenue: 3500000 },
    { name: 'Aug', revenue: totalGrossRevenue > 3500000 ? totalGrossRevenue : 4100000 },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Executive Overview</h1>
          <p className="text-slate-500">Business performance across all distributors and machines.</p>
        </div>
      </div>

      {/* KPI Row 1 */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Machine Gross Revenue"
          value={`₹${totalGrossRevenue.toLocaleString('en-IN')}`}
          icon={<IndianRupee className="w-6 h-6 text-indigo-600" />}
          trend={{ value: 12.5, isPositive: true }}
        />
        <StatCard
          title="Company Retained"
          value={`₹${companyRetainedRevenue.toLocaleString('en-IN')}`}
          icon={<Wallet className="w-6 h-6 text-emerald-600" />}
          description="Revenue after Distributor splits"
        />
        <StatCard
          title="Active Machines"
          value={activeMachines.toString()}
          icon={<MonitorSmartphone className="w-6 h-6 text-blue-600" />}
          description={`Out of ${machines.length} total machines`}
        />
        <StatCard
          title="Active Distributors"
          value={activeDistributors.toString()}
          icon={<Building2 className="w-6 h-6 text-purple-600" />}
        />
      </div>

      {/* KPI Row 2 */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Pending Orders"
          value={pendingOrders.toString()}
          icon={<ShoppingCart className="w-6 h-6 text-orange-600" />}
        />
        <StatCard
          title="Distributor Receivables"
          value={`₹${totalReceivables.toLocaleString('en-IN')}`}
          icon={<FileText className="w-6 h-6 text-red-600" />}
          description="Pending payments from Company"
        />
        <StatCard
          title="Pending Settlements"
          value={pendingSettlements.toString()}
          icon={<AlertCircle className="w-6 h-6 text-yellow-600" />}
        />
        <StatCard
          title="Completed Payments"
          value={payments.filter(p => p.status === 'paid').length.toString()}
          icon={<CheckCircle2 className="w-6 h-6 text-green-600" />}
        />
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Gross Revenue Trend (2026)</CardTitle>
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
                    tickFormatter={(value) => `₹${(value / 100000).toFixed(1)}L`} 
                  />
                  <Tooltip 
                    formatter={(value: any) => [`₹${value.toLocaleString('en-IN')}`, 'Revenue']}
                    cursor={{fill: '#f8fafc'}}
                  />
                  <Bar dataKey="revenue" fill="#4f46e5" radius={[4, 4, 0, 0]} />
                </BarChart>
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
              {notifications.filter(n => !n.isRead).slice(0, 5).map(n => (
                <div key={n.id} className="flex gap-3 items-start p-3 bg-slate-50 rounded-md border border-slate-100">
                  <AlertCircle className="w-5 h-5 text-indigo-600 shrink-0 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-slate-900">{n.title}</p>
                    <p className="text-xs text-slate-500 mt-1">{n.message}</p>
                  </div>
                </div>
              ))}
              {notifications.filter(n => !n.isRead).length === 0 && (
                <div className="text-sm text-slate-500 text-center py-4">No pending alerts</div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

    </div>
  );
}
