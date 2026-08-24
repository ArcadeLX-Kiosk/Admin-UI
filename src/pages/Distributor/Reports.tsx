import React, { useState } from 'react';
import { useAuth } from '../../app/authContext';
import { Card, CardHeader, CardTitle, CardContent } from '../../components/ui/Card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../../components/ui/Table';
import { Button } from '../../components/ui/Button';
import { Select } from '../../components/ui/Select';
import { Download, FileText } from 'lucide-react';
import { useMachine } from '../../mock/machineContext';
import { useSettlement } from '../../mock/settlementContext';

export function DistributorReports() {
  const { user } = useAuth();
  const [reportType, setReportType] = useState('revenue');
  const [month, setMonth] = useState('8');
  
  const { machines } = useMachine();
  const { partnerSettlements } = useSettlement();
  
  const myMachines = machines.filter(m => m.distributorId === user?.id);
  const mySettlements = partnerSettlements.filter(s => s.distributorId === user?.id);


  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Reports</h1>
          <p className="text-slate-500">Analytics for your downstream partner network.</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" className="opacity-50 cursor-not-allowed" title="Planned for v1.1"><FileText className="w-4 h-4 mr-2" /> Export PDF</Button>
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
                { label: 'Partner Settlement Report', value: 'partner_settlement' },
                { label: 'Machine Revenue Report', value: 'revenue' },
              ]}
            />
            <Select 
              label="Month"
              value={month}
              onChange={(e) => setMonth(e.target.value)}
              options={[
                { label: 'August 2026', value: '8' },
                { label: 'July 2026', value: '7' },
              ]}
            />
            <div className="flex items-end">
              <Button variant="outline" className="w-full">Generate</Button>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          {reportType === 'partner_settlement' && (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Settlement Number</TableHead>
                  <TableHead>Partner</TableHead>
                  <TableHead className="text-right">Distributor Entitlement</TableHead>
                  <TableHead className="text-right">Distributor Retained</TableHead>
                  <TableHead className="text-right">Partner Entitlement</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {mySettlements.map((s) => (
                  <TableRow key={s.id}>
                    <TableCell className="font-medium text-indigo-600">{s.settlementNumber}</TableCell>
                    <TableCell>{s.partnerName}</TableCell>
                    <TableCell className="text-right text-slate-500">₹{s.eligibleRevenue.toLocaleString()}</TableCell>
                    <TableCell className="text-right text-emerald-600 font-medium">₹{s.distributorRetainedAmount.toLocaleString()}</TableCell>
                    <TableCell className="text-right font-bold text-slate-900">₹{s.partnerPayableAmount.toLocaleString()}</TableCell>
                  </TableRow>
                ))}
                {mySettlements.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center py-8 text-slate-500">
                      No partner settlements found.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          )}

          {reportType === 'revenue' && (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Machine Code</TableHead>
                  <TableHead>Partner</TableHead>
                  <TableHead className="text-right">Gross Revenue (YTD)</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {myMachines.slice(0, 10).map((m: any) => (
                  <TableRow key={m.id}>
                    <TableCell className="font-mono text-sm">{m.machineCode}</TableCell>
                    <TableCell>{m.model}</TableCell>
                    <TableCell className="text-right font-medium">₹{(m.totalRevenue || 0).toLocaleString('en-IN')}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
