import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { IndianRupee, Gamepad2, Calendar, TrendingUp, MonitorSmartphone, Plus, Wallet, CreditCard, Activity } from 'lucide-react';
import { useRevenue } from '../../mock/revenueContext';
import { useMachine } from '../../mock/machineContext';
import { useOrg } from '../../mock/orgContext';
import { Card, CardHeader, CardTitle, CardContent } from '../../components/ui/Card';
import { StatCard } from '../../components/dashboard/StatCard';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../../components/ui/Table';
import { Button } from '../../components/ui/Button';
import { SimulatePlayModal } from '../../components/revenue/SimulatePlayModal';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

export function CompanyRevenueDashboard() {
  const navigate = useNavigate();
  const { transactions, getMachineAggregation } = useRevenue();
  const { machines } = useMachine();
  const { distributors, partners } = useOrg();
  
  const [isSimulateModalOpen, setIsSimulateModalOpen] = useState(false);

  // Global aggregations
  const totalRevenue = transactions.filter(t => t.paymentStatus === 'successful').reduce((acc, curr) => acc + curr.amount, 0);
  
  const now = new Date();
  const todayRevenue = transactions.filter(t => {
    if (t.paymentStatus !== 'successful') return false;
    const d = new Date(t.transactionDate);
    return d.getDate() === now.getDate() && d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear();
  }).reduce((acc, curr) => acc + curr.amount, 0);

  const thisMonthRevenue = transactions.filter(t => {
    if (t.paymentStatus !== 'successful') return false;
    const d = new Date(t.transactionDate);
    return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear();
  }).reduce((acc, curr) => acc + curr.amount, 0);

  const activeRevenueMachines = new Set(transactions.filter(t => t.paymentStatus === 'successful').map(t => t.machineId)).size;

  // Chart data (Mock last 7 days)
  const chartData = Array.from({ length: 7 }).map((_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - (6 - i));
    const dayStr = d.toLocaleDateString('en-US', { weekday: 'short' });
    const dayRev = transactions.filter(t => {
      const td = new Date(t.transactionDate);
      return td.getDate() === d.getDate() && td.getMonth() === d.getMonth() && t.paymentStatus === 'successful';
    }).reduce((acc, curr) => acc + curr.amount, 0);
    return { name: dayStr, revenue: dayRev };
  });

  const getEntityName = (id: string | null, type: 'distributor' | 'partner') => {
    if (!id) return '-';
    if (type === 'distributor') return distributors.find(d => d.id === id)?.businessName || id;
    if (type === 'partner') return partners.find(p => p.id === id)?.businessName || id;
    return id;
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Gross Revenue</h1>
          <p className="text-sm text-slate-500">Track raw revenue generated across the entire kiosk fleet.</p>
        </div>
        <Button onClick={() => setIsSimulateModalOpen(true)}>
          <Plus className="mr-2 h-4 w-4" /> Simulate Play
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard title="Gross Revenue" value={`₹${totalRevenue.toLocaleString('en-IN')}`} icon={<IndianRupee className="w-6 h-6 text-indigo-600" />} trend={{ value: 12, isPositive: true }} />
        <StatCard title="Company Share" value={`₹${Math.round(totalRevenue * 0.4).toLocaleString('en-IN')}`} icon={<Wallet className="w-6 h-6 text-emerald-600" />} trend={{ value: 8, isPositive: true }} />
        <StatCard title="Total Transactions" value={transactions.length.toLocaleString('en-IN')} icon={<CreditCard className="w-6 h-6 text-blue-600" />} trend={{ value: 15, isPositive: true }} />
        <StatCard title="Avg Ticket Size" value={`₹${transactions.length ? Math.round(totalRevenue / transactions.length) : 0}`} icon={<Activity className="w-6 h-6 text-purple-600" />} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Revenue Trend (Last 7 Days)</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={chartData} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748b' }} />
                  <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748b' }} tickFormatter={(val) => `₹${val}`} />
                  <Tooltip formatter={(value) => [`₹${value}`, 'Revenue']} contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
                  <Line type="monotone" dataKey="revenue" stroke="#4f46e5" strokeWidth={3} dot={{ r: 4, fill: '#4f46e5', strokeWidth: 0 }} activeDot={{ r: 6 }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Recent Transactions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {transactions.slice(0, 5).map(tx => (
                <div key={tx.id} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg border border-slate-100">
                  <div className="flex items-center gap-3">
                    <div className="bg-white p-2 rounded-md border border-slate-200">
                      <Gamepad2 className="h-4 w-4 text-indigo-500" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-slate-900">{tx.machineCode}</p>
                      <p className="text-xs text-slate-500">{new Date(tx.transactionDate).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} • {tx.gameName}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className={`text-sm font-bold ${tx.paymentStatus === 'successful' ? 'text-green-600' : 'text-slate-500 line-through'}`}>
                      ₹{tx.amount}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Machine-Wise Revenue</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Machine Code</TableHead>
                <TableHead>Distributor</TableHead>
                <TableHead>Partner</TableHead>
                <TableHead className="text-right">Today</TableHead>
                <TableHead className="text-right">This Month</TableHead>
                <TableHead className="text-right">Total Revenue</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {machines.filter(m => m.status === 'active' || m.status === 'installed').map(m => {
                const agg = getMachineAggregation(m.id);
                if (agg.totalRevenue === 0) return null; // Skip machines with no revenue for cleaner demo
                
                return (
                  <TableRow key={m.id}>
                    <TableCell className="font-mono font-medium text-slate-900">{m.machineCode}</TableCell>
                    <TableCell className="text-sm">{getEntityName(m.distributorId, 'distributor')}</TableCell>
                    <TableCell className="text-sm">{getEntityName(m.partnerId, 'partner')}</TableCell>
                    <TableCell className="text-right font-medium text-slate-700">₹{agg.todayRevenue.toLocaleString()}</TableCell>
                    <TableCell className="text-right font-medium text-slate-700">₹{agg.thisMonthRevenue.toLocaleString()}</TableCell>
                    <TableCell className="text-right font-bold text-slate-900">₹{agg.totalRevenue.toLocaleString()}</TableCell>
                    <TableCell className="text-right">
                      <Button variant="ghost" size="sm" onClick={() => navigate(`/company/machines/${m.id}`)}>
                        Details
                      </Button>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <SimulatePlayModal 
        isOpen={isSimulateModalOpen} 
        onClose={() => setIsSimulateModalOpen(false)} 
      />
    </div>
  );
}
