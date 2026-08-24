import React, { useState } from 'react';
import { useAuth } from '../../app/authContext';
import { Card, CardHeader, CardTitle, CardContent } from '../../components/ui/Card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../../components/ui/Table';
import { Button } from '../../components/ui/Button';
import { Select } from '../../components/ui/Select';
import { Download, FileText } from 'lucide-react';
import { useMachine } from '../../mock/machineContext';
import { useOrg } from '../../mock/orgContext';

export function DistributorReports() {
  const { user } = useAuth();
  const [partnerFilter, setPartnerFilter] = useState('all');
  const [month, setMonth] = useState('8');
  
  const { machines } = useMachine();
  const { companyDistributorAgreements, partners } = useOrg();
  
  const myMachines = machines.filter(m => m.distributorId === user?.id);
  const myPartners = partners.filter(p => p.distributorId === user?.id);
  
  // Use the active company agreement for calculating shares on the fly for the report
  const activeAgreement = companyDistributorAgreements.find(a => a.distributorId === user?.id && a.status === 'active');
  const compSharePct = activeAgreement ? activeAgreement.companySharePercent / 100 : 0.4;
  const distSharePct = activeAgreement ? activeAgreement.distributorSharePercent / 100 : 0.6;

  const filteredMachines = myMachines.filter(m => {
    if (partnerFilter === 'all') return true;
    if (partnerFilter === 'unassigned') return !m.partnerId;
    return m.partnerId === partnerFilter;
  });

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
              label="Partner Filter"
              value={partnerFilter}
              onChange={(e) => setPartnerFilter(e.target.value)}
              options={[
                { label: 'All Partners', value: 'all' },
                { label: 'Unassigned Machines', value: 'unassigned' },
                ...myPartners.map(p => ({ label: p.businessName, value: p.id }))
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
                <TableHead>Partner Name</TableHead>
                <TableHead>Model Name</TableHead>
                <TableHead className="text-right">Gross Revenue Before Tax</TableHead>
                <TableHead className="text-right">Company Share</TableHead>
                <TableHead className="text-right">Distributor Share</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredMachines.map((m: any) => {
                const partner = partners.find(p => p.id === m.partnerId);
                const gross = m.totalRevenue || 0;
                const cShare = gross * compSharePct;
                const dShare = gross * distSharePct;

                return (
                  <TableRow key={m.id}>
                    <TableCell className="font-mono text-sm font-medium">{m.machineCode}</TableCell>
                    <TableCell>{partner ? partner.businessName : <span className="text-slate-400 italic">Unassigned</span>}</TableCell>
                    <TableCell className="text-sm">{m.model}</TableCell>
                    <TableCell className="text-right font-medium">₹{gross.toLocaleString('en-IN')}</TableCell>
                    <TableCell className="text-right text-slate-500">₹{cShare.toLocaleString('en-IN')}</TableCell>
                    <TableCell className="text-right text-indigo-600 font-medium">₹{dShare.toLocaleString('en-IN')}</TableCell>
                  </TableRow>
                );
              })}
              {filteredMachines.length === 0 && (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-8 text-slate-500">
                    No machines match the selected filter.
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
