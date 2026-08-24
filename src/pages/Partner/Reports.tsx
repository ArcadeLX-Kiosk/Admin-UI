import React, { useState } from 'react';
import { useAuth } from '../../app/authContext';
import { Card, CardHeader, CardTitle, CardContent } from '../../components/ui/Card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../../components/ui/Table';
import { Button } from '../../components/ui/Button';
import { Select } from '../../components/ui/Select';
import { Download, FileText } from 'lucide-react';
import { useMachine } from '../../mock/machineContext';
import { useOrg } from '../../mock/orgContext';

export function PartnerReports() {
  const { user } = useAuth();
  const [month, setMonth] = useState('8');
  
  const { machines } = useMachine();
  const { distributorPartnerAgreements, partners } = useOrg();
  
  const myMachines = machines.filter(m => m.partnerId === user?.id);
  const myPartnerData = partners.find(p => p.id === user?.id);
  
  // Get active agreement for share percentages
  const activeAgreement = distributorPartnerAgreements.find(
    a => a.partnerId === user?.id && a.distributorId === myPartnerData?.distributorId && a.status === 'active'
  );
  
  const distSharePct = activeAgreement ? activeAgreement.distributorSharePercent / 100 : 0.3;
  const partSharePct = activeAgreement ? activeAgreement.partnerSharePercent / 100 : 0.7;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Reports</h1>
          <p className="text-slate-500">Analytics for your active machine fleet.</p>
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
              value="revenue"
              onChange={() => {}}
              options={[
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
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Machine Code</TableHead>
                <TableHead>Model Name</TableHead>
                <TableHead className="text-right">Gross Revenue Before Tax</TableHead>
                <TableHead className="text-right">Distributor Share</TableHead>
                <TableHead className="text-right">Partner Share</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {myMachines.map((m: any) => {
                const gross = m.totalRevenue || 0;
                // Note: Since Partner only sees what's assigned to them, 
                // Distributor Share here implies the portion retained by the Distributor
                // out of the eligible revenue allocated to this machine.
                // For a mock report, we'll calculate it simplistically.
                const eligibleRevenue = gross * 0.6; // Assuming 60% of gross went to Distributor
                const distRetained = eligibleRevenue * distSharePct;
                const partnerShare = eligibleRevenue * partSharePct;

                return (
                  <TableRow key={m.id}>
                    <TableCell className="font-mono text-sm">{m.machineCode}</TableCell>
                    <TableCell className="text-sm">{m.model}</TableCell>
                    <TableCell className="text-right font-medium">₹{gross.toLocaleString('en-IN')}</TableCell>
                    <TableCell className="text-right text-emerald-600">₹{distRetained.toLocaleString('en-IN')}</TableCell>
                    <TableCell className="text-right text-indigo-600 font-bold">₹{partnerShare.toLocaleString('en-IN')}</TableCell>
                  </TableRow>
                );
              })}
              {myMachines.length === 0 && (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-8 text-slate-500">
                    No machines assigned to you yet.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
