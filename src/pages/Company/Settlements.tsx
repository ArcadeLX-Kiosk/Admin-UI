import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Eye } from 'lucide-react';
import { useSettlement } from '../../mock/settlementContext';
import { useOrg } from '../../mock/orgContext';
import { Button } from '../../components/ui/Button';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/Card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../../components/ui/Table';
import { Modal } from '../../components/ui/Modal';
import { Select } from '../../components/ui/Select';
import { SettlementStatusBadge } from '../../components/ui/StatusBadges';

const MONTHS = [
  { value: 1, label: 'January' },
  { value: 2, label: 'February' },
  { value: 3, label: 'March' },
  { value: 4, label: 'April' },
  { value: 5, label: 'May' },
  { value: 6, label: 'June' },
  { value: 7, label: 'July' },
  { value: 8, label: 'August' },
  { value: 9, label: 'September' },
  { value: 10, label: 'October' },
  { value: 11, label: 'November' },
  { value: 12, label: 'December' },
];

export function CompanySettlementsList() {
  const navigate = useNavigate();
  const { settlements, generateSettlement } = useSettlement();
  const { distributors } = useOrg();
  
  const [isGenerateModalOpen, setIsGenerateModalOpen] = useState(false);
  const [selectedDistributor, setSelectedDistributor] = useState('');
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1);
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [generateError, setGenerateError] = useState('');

  const handleGenerate = () => {
    setGenerateError('');
    if (!selectedDistributor) {
      setGenerateError('Please select a distributor.');
      return;
    }
    
    try {
      const newSettlement = generateSettlement(selectedDistributor, selectedMonth, selectedYear);
      if (newSettlement) {
        setIsGenerateModalOpen(false);
        navigate(`/company/settlements/${newSettlement.id}`);
      }
    } catch (e: any) {
      setGenerateError(e.message);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Settlements</h1>
          <p className="text-sm text-slate-500">Calculate and manage monthly settlements with distributors.</p>
        </div>
        <Button onClick={() => setIsGenerateModalOpen(true)}>
          <Plus className="mr-2 h-4 w-4" /> Generate Settlement
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Distributor Settlements</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Settlement ID</TableHead>
                <TableHead>Period</TableHead>
                <TableHead>Distributor</TableHead>
                <TableHead className="text-right">Gross Revenue</TableHead>
                <TableHead className="text-right">Company Share</TableHead>
                <TableHead className="text-right">Distributor Share</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {settlements.map(s => (
                <TableRow key={s.id}>
                  <TableCell className="font-mono font-medium text-slate-900">{s.settlementNumber}</TableCell>
                  <TableCell className="text-sm">{MONTHS.find(m => m.value === s.periodMonth)?.label} {s.periodYear}</TableCell>
                  <TableCell className="font-medium">{s.distributorName}</TableCell>
                  <TableCell className="text-right font-medium text-slate-900">₹{s.grossRevenue.toLocaleString()}</TableCell>
                  <TableCell className="text-right text-indigo-600 font-medium">₹{s.companyShareAmount.toLocaleString()}</TableCell>
                  <TableCell className="text-right font-medium">₹{s.distributorShareAmount.toLocaleString()}</TableCell>
                  <TableCell>
                    <SettlementStatusBadge status={s.status} />
                  </TableCell>
                  <TableCell className="text-right">
                    <Button variant="ghost" size="sm" onClick={() => navigate(`/company/settlements/${s.id}`)}>
                      <Eye className="h-4 w-4 mr-2" /> View
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
              {settlements.length === 0 && (
                <TableRow><TableCell colSpan={8} className="text-center py-6 text-slate-500">No settlements generated yet.</TableCell></TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Modal
        isOpen={isGenerateModalOpen}
        onClose={() => setIsGenerateModalOpen(false)}
        title="Generate Monthly Settlement"
        footer={
          <div className="flex justify-end gap-3 w-full">
            <Button variant="outline" onClick={() => setIsGenerateModalOpen(false)}>Cancel</Button>
            <Button onClick={handleGenerate}>Calculate & Generate</Button>
          </div>
        }
      >
        <div className="space-y-4">
          <p className="text-sm text-slate-600 mb-4">
            Generates an immutable settlement snapshot based on the active Company ↔ Distributor agreement and raw machine revenue.
          </p>

          <Select 
            label="Distributor"
            required
            value={selectedDistributor}
            onChange={(e) => setSelectedDistributor(e.target.value)}
            options={[
              { label: '-- Select Distributor --', value: '' },
              ...distributors.map(d => ({ label: d.businessName, value: d.id }))
            ]}
          />

          <div className="grid grid-cols-2 gap-4">
            <Select 
              label="Month"
              value={selectedMonth.toString()}
              onChange={(e) => setSelectedMonth(Number(e.target.value))}
              options={MONTHS.map(m => ({ label: m.label, value: m.value.toString() }))}
            />
            <Select 
              label="Year"
              value={selectedYear.toString()}
              onChange={(e) => setSelectedYear(Number(e.target.value))}
              options={[2025, 2026, 2027].map(y => ({ label: y.toString(), value: y.toString() }))}
            />
          </div>

          {generateError && (
            <div className="p-3 bg-red-50 text-red-600 rounded-md text-sm border border-red-200 mt-2">
              {generateError}
            </div>
          )}
        </div>
      </Modal>

    </div>
  );
}
