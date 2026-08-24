import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSettlement } from '../../mock/settlementContext';
import { useOrg } from '../../mock/orgContext';
import { useAuth } from '../../app/authContext';
import { Card, CardHeader, CardTitle, CardContent } from '../../components/ui/Card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../../components/ui/Table';
import { Button } from '../../components/ui/Button';
import { SettlementStatusBadge } from '../../components/ui/StatusBadges';
import { Modal } from '../../components/ui/Modal';
import { Select } from '../../components/ui/Select';
import { Eye, Calculator } from 'lucide-react';

const MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

export function DistributorPartnerSettlementsList() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { partnerSettlements, generatePartnerSettlement } = useSettlement();
  const { partners } = useOrg();

  const [isGenerateModalOpen, setIsGenerateModalOpen] = useState(false);
  const [genMonth, setGenMonth] = useState('8');
  const [genYear, setGenYear] = useState('2026');
  const [genPartnerId, setGenPartnerId] = useState('');
  const [genError, setGenError] = useState('');

  const myPartnerSettlements = partnerSettlements.filter(s => s.distributorId === user?.id);
  const myPartners = partners.filter(p => p.distributorId === user?.id);

  const handleGenerate = () => {
    setGenError('');
    if (!genPartnerId) {
      setGenError('Please select a Partner');
      return;
    }
    
    try {
      const settlement = generatePartnerSettlement(user!.id, genPartnerId, parseInt(genMonth), parseInt(genYear));
      if (settlement) {
        setIsGenerateModalOpen(false);
        navigate(`/distributor/partner-settlements/${settlement.id}`);
      }
    } catch (err: any) {
      setGenError(err.message || 'Failed to generate settlement.');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Partner Settlements</h1>
          <p className="text-sm text-slate-500">Manage downstream settlements for your Partners.</p>
        </div>
        <Button onClick={() => setIsGenerateModalOpen(true)} className="bg-indigo-600 hover:bg-indigo-700 text-white">
          <Calculator className="mr-2 h-4 w-4" />
          Generate Partner Settlement
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Partner Settlement Ledger</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Settlement ID</TableHead>
                <TableHead>Period</TableHead>
                <TableHead>Partner</TableHead>
                <TableHead className="text-right">Dist. Retained</TableHead>
                <TableHead className="text-right">Partner Payable</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {myPartnerSettlements.map(s => (
                <TableRow key={s.id}>
                  <TableCell className="font-mono text-sm">{s.settlementNumber}</TableCell>
                  <TableCell>{MONTHS[s.periodMonth - 1]} {s.periodYear}</TableCell>
                  <TableCell className="font-medium text-slate-900">{s.partnerName}</TableCell>
                  <TableCell className="text-right text-indigo-600 font-medium">₹{s.distributorRetainedAmount.toLocaleString()}</TableCell>
                  <TableCell className="text-right font-bold text-slate-900">₹{s.partnerPayableAmount.toLocaleString()}</TableCell>
                  <TableCell><SettlementStatusBadge status={s.status} /></TableCell>
                  <TableCell className="text-right">
                    <Button variant="outline" size="sm" onClick={() => navigate(`/distributor/partner-settlements/${s.id}`)}>
                      <Eye className="h-4 w-4 mr-2" /> View
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
              {myPartnerSettlements.length === 0 && (
                <TableRow><TableCell colSpan={7} className="text-center py-6 text-slate-500">No partner settlements generated yet.</TableCell></TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Modal
        isOpen={isGenerateModalOpen}
        onClose={() => setIsGenerateModalOpen(false)}
        title="Generate Partner Settlement"
        footer={
          <div className="flex justify-end gap-3 w-full">
            <Button variant="outline" onClick={() => setIsGenerateModalOpen(false)}>Cancel</Button>
            <Button onClick={handleGenerate} className="bg-indigo-600 hover:bg-indigo-700 text-white">Generate</Button>
          </div>
        }
      >
        <div className="space-y-4">
          <p className="text-sm text-slate-600">
            Select a partner and period. The system will calculate the downstream settlement based on your active agreement and the revenue already settled by the Company.
          </p>
          
          {genError && (
            <div className="p-3 bg-red-50 text-red-700 text-sm rounded-md border border-red-200">
              {genError}
            </div>
          )}

          <Select
            label="Partner"
            value={genPartnerId}
            onChange={(e) => setGenPartnerId(e.target.value)}
            options={[
              { label: '-- Select Partner --', value: '' },
              ...myPartners.map(p => ({ label: p.businessName, value: p.id }))
            ]}
          />
          <div className="grid grid-cols-2 gap-4">
            <Select
              label="Month"
              value={genMonth}
              onChange={(e) => setGenMonth(e.target.value)}
              options={MONTHS.map((m, i) => ({ label: m, value: (i + 1).toString() }))}
            />
            <Select
              label="Year"
              value={genYear}
              onChange={(e) => setGenYear(e.target.value)}
              options={['2025', '2026'].map(y => ({ label: y, value: y }))}
            />
          </div>
        </div>
      </Modal>
    </div>
  );
}
