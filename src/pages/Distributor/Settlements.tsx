import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Eye, FileText, Plus } from 'lucide-react';
import { useSettlement } from '../../mock/settlementContext';
import { useAuth } from '../../app/authContext';
import { Button } from '../../components/ui/Button';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/Card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../../components/ui/Table';
import { SettlementStatusBadge } from '../../components/ui/StatusBadges';
import { Modal } from '../../components/ui/Modal';
import { Select } from '../../components/ui/Select';

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

export function DistributorSettlementsList() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { settlements, generateSettlement } = useSettlement();
  
  const [isRequestModalOpen, setIsRequestModalOpen] = useState(false);
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1);
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [generateError, setGenerateError] = useState('');

  // Filter for this distributor only
  const mySettlements = settlements.filter(s => s.distributorId === user?.id);

  const handleRequest = () => {
    setGenerateError('');
    if (!user?.id) return;
    
    try {
      const newSettlement = generateSettlement(user.id, selectedMonth, selectedYear);
      if (newSettlement) {
        setIsRequestModalOpen(false);
        // We can just stay on the list
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
          <p className="text-sm text-slate-500">Track and request your settlements from the Company.</p>
        </div>
        <Button onClick={() => setIsRequestModalOpen(true)}>
          <Plus className="mr-2 h-4 w-4" /> Request Settlement
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>My Settlement Requests</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Request ID</TableHead>
                <TableHead>Period</TableHead>
                <TableHead className="text-right">Base Entitlement</TableHead>
                <TableHead className="text-right">GST (18%)</TableHead>
                <TableHead className="text-right">Total Requested</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {mySettlements.map(s => {
                const base = s.distributorShareAmount;
                const gst = s.gstAmount || (base * 0.18);
                const total = s.totalAmount || (base + gst);
                
                return (
                  <TableRow key={s.id}>
                    <TableCell className="font-mono font-medium text-slate-900">{s.settlementNumber}</TableCell>
                    <TableCell className="text-sm">{MONTHS.find(m => m.value === s.periodMonth)?.label} {s.periodYear}</TableCell>
                    <TableCell className="text-right text-slate-500">?{base.toLocaleString('en-IN')}</TableCell>
                    <TableCell className="text-right text-slate-500 text-sm">?{gst.toLocaleString('en-IN')}</TableCell>
                    <TableCell className="text-right text-indigo-600 font-bold">?{total.toLocaleString('en-IN')}</TableCell>
                    <TableCell>
                      <SettlementStatusBadge status={s.status} />
                    </TableCell>
                    <TableCell className="text-right">
                      <Button variant="ghost" size="sm" onClick={() => navigate('/distributor/settlements/' + s.id)}>
                        <Eye className="h-4 w-4 mr-2" /> View
                      </Button>
                    </TableCell>
                  </TableRow>
                );
              })}
              {mySettlements.length === 0 && (
                <TableRow><TableCell colSpan={7} className="text-center py-6 text-slate-500">No settlement requests yet.</TableCell></TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Modal
        isOpen={isRequestModalOpen}
        onClose={() => setIsRequestModalOpen(false)}
        title="Request Monthly Settlement"
        footer={
          <div className="flex justify-end gap-3 w-full">
            <Button variant="outline" onClick={() => setIsRequestModalOpen(false)}>Cancel</Button>
            <Button onClick={handleRequest}>Calculate & Submit Request</Button>
          </div>
        }
      >
        <div className="space-y-4">
          <p className="text-sm text-slate-600 mb-4">
            Calculate your eligible settlement for the selected period and submit a request to the Company. 18% GST will be added automatically.
          </p>

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

