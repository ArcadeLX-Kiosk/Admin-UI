import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '../../components/ui/Card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../../components/ui/Table';
import { Button } from '../../components/ui/Button';
import { Select } from '../../components/ui/Select';
import { Download, Printer, FileText } from 'lucide-react';
import { useMachine } from '../../mock/machineContext';
import { useSettlement } from '../../mock/settlementContext';
import { PieChart, Pie } from 'recharts';

export function CompanyReports() {
  const [reportType, setReportType] = useState('revenue');
  const [month, setMonth] = useState('8'); // Default to August 2026 for demo
  
  const { machines } = useMachine();
  const { settlements } = useSettlement();


  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Reports</h1>
          <p className="text-slate-500">Generate and export platform analytics.</p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" className="opacity-50 cursor-not-allowed" title="Planned for v1.1"><Printer className="w-4 h-4 mr-2" /> Print</Button>
          <Button variant="primary" className="opacity-50 cursor-not-allowed" title="Planned for v1.1"><Download className="w-4 h-4 mr-2" /> Export CSV</Button>
        </div>
      </div>

      <Card>
        <CardHeader className="bg-slate-50 border-b border-slate-200 pb-4">
          <CardTitle className="text-lg mb-4">Report Builder</CardTitle>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Select 
              label="Report Type"
              value={reportType}
              onChange={(e) => setReportType(e.target.value)}
              options={[
                { label: 'Machine Revenue Report', value: 'revenue' },
                { label: 'Settlement Report', value: 'settlement' },
                { label: 'Inventory Report', value: 'inventory' }
              ]}
            />
            <Select 
              label="Month"
              value={month}
              onChange={(e) => setMonth(e.target.value)}
              options={[
                { label: 'August 2026', value: '8' },
                { label: 'July 2026', value: '7' },
                { label: 'June 2026', value: '6' },
              ]}
            />
            <div className="flex items-end">
              <Button variant="outline" className="w-full">Generate</Button>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          {reportType === 'revenue' && (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Machine Code</TableHead>
                  <TableHead>Model</TableHead>
                  <TableHead>Location</TableHead>
                  <TableHead className="text-right">Gross Revenue (YTD)</TableHead>
                  <TableHead className="text-right">Transactions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {machines.slice(0, 10).map((m: any) => (
                  <TableRow key={m.id}>
                    <TableCell className="font-mono text-sm">{m.machineCode}</TableCell>
                    <TableCell>{m.model}</TableCell>
                    <TableCell>{m.location}, {m.city}</TableCell>
                    <TableCell className="text-right font-medium">₹{(m.totalRevenue || 0).toLocaleString()}</TableCell>
                    <TableCell className="text-right">{(m.totalTransactions || 0).toLocaleString()}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}

          {reportType === 'settlement' && (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Settlement Number</TableHead>
                  <TableHead>Distributor</TableHead>
                  <TableHead>Month</TableHead>
                  <TableHead className="text-right">Gross Revenue</TableHead>
                  <TableHead className="text-right">Company Retained</TableHead>
                  <TableHead className="text-right">Distributor Entitlement</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {settlements.map((s: any) => (
                  <TableRow key={s.id}>
                    <TableCell className="font-medium text-indigo-600">{s.settlementNumber}</TableCell>
                    <TableCell>{s.distributorName}</TableCell>
                    <TableCell>{s.periodMonth}/{s.periodYear}</TableCell>
                    <TableCell className="text-right text-slate-500">₹{s.grossRevenue.toLocaleString()}</TableCell>
                    <TableCell className="text-right text-emerald-600 font-medium">₹{s.companyShareAmount.toLocaleString()}</TableCell>
                    <TableCell className="text-right font-bold text-slate-900">₹{s.distributorShareAmount.toLocaleString()}</TableCell>
                  </TableRow>
                ))}
                {settlements.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-8 text-slate-500 flex flex-col items-center">
                      <FileText className="w-8 h-8 mb-2 text-slate-300" />
                      No settlements found for this period.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          )}

          {reportType === 'inventory' && (
            <div className="p-8 text-center text-slate-500">
              Inventory Report Preview Placeholder
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
