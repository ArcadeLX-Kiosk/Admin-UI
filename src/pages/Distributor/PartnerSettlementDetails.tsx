import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, FileText, CheckCircle2, Lock, CreditCard } from 'lucide-react';
import { useSettlement } from '../../mock/settlementContext';
import { Button } from '../../components/ui/Button';
import { Card, CardHeader, CardTitle, CardContent } from '../../components/ui/Card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../../components/ui/Table';
import { SettlementStatusBadge } from '../../components/ui/StatusBadges';
import { Modal } from '../../components/ui/Modal';
import { Select } from '../../components/ui/Select';

const MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

export function DistributorPartnerSettlementDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { partnerSettlements, advancePartnerStatus, markPartnerSettlementPaid } = useSettlement();
  
  const [isPayModalOpen, setIsPayModalOpen] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState('upi');
  const [paymentRef, setPaymentRef] = useState(`UPI-${Math.floor(Math.random() * 1000000)}`);

  const settlement = partnerSettlements.find(s => s.id === id);

  if (!settlement) {
    return <div className="p-6 text-center text-slate-500">Settlement not found</div>;
  }

  const isLocked = ['approved', 'payment_pending', 'paid', 'closed'].includes(settlement.status);

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <button 
          onClick={() => navigate('/distributor/partner-settlements')}
          className="p-2 hover:bg-slate-100 rounded-full text-slate-500"
        >
          <ArrowLeft className="h-5 w-5" />
        </button>
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-bold text-slate-900">{settlement.settlementNumber}</h1>
            <SettlementStatusBadge status={settlement.status} />
            {isLocked && (
              <span className="flex items-center text-xs font-medium text-slate-500 bg-slate-100 px-2 py-1 rounded-full">
                <Lock className="w-3 h-3 mr-1" /> Locked
              </span>
            )}
          </div>
          <p className="text-sm text-slate-500">Partner Settlement • {MONTHS[settlement.periodMonth - 1]} {settlement.periodYear}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader className="bg-slate-50 border-b border-slate-200">
              <CardTitle className="text-lg">Machine Breakdown (Financial Cascade)</CardTitle>
              <p className="text-sm text-slate-500 mt-1">
                Showing the explicit flow from Machine Gross Revenue to the final Partner Entitlement.
              </p>
            </CardHeader>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Machine</TableHead>
                    <TableHead className="text-right">Gross Revenue</TableHead>
                    <TableHead className="text-right">Distributor Entitlement</TableHead>
                    <TableHead className="text-right">Partner Entitlement ({settlement.partnerSharePercent}%)</TableHead>
                    <TableHead className="text-right">Dist. Retained ({settlement.distributorSharePercent}%)</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {settlement.machineBreakdown.map(mb => {
                    const partnerShare = mb.distributorShareAmount * (settlement.partnerSharePercent / 100);
                    const distRetained = mb.distributorShareAmount * (settlement.distributorSharePercent / 100);
                    return (
                      <TableRow key={mb.machineId}>
                        <TableCell className="font-mono text-sm">{mb.machineCode}</TableCell>
                        <TableCell className="text-right text-slate-500">₹{mb.grossRevenue?.toLocaleString()}</TableCell>
                        <TableCell className="text-right font-medium text-slate-700">₹{mb.distributorShareAmount.toLocaleString()}</TableCell>
                        <TableCell className="text-right text-slate-900 font-bold">₹{partnerShare.toLocaleString()}</TableCell>
                        <TableCell className="text-right text-indigo-600 font-medium">₹{distRetained.toLocaleString()}</TableCell>
                      </TableRow>
                    );
                  })}
                  <TableRow className="bg-slate-50">
                    <TableCell className="font-bold">Total</TableCell>
                    <TableCell className="text-right font-bold text-slate-500">₹{settlement.machineBreakdown.reduce((acc, mb) => acc + (mb.grossRevenue || 0), 0).toLocaleString()}</TableCell>
                    <TableCell className="text-right font-bold text-slate-700">₹{settlement.eligibleRevenue.toLocaleString()}</TableCell>
                    <TableCell className="text-right font-bold text-slate-900">₹{settlement.partnerPayableAmount.toLocaleString()}</TableCell>
                    <TableCell className="text-right font-bold text-indigo-700">₹{settlement.distributorRetainedAmount.toLocaleString()}</TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Settlement Context</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <p className="text-sm text-slate-500 mb-1">Partner</p>
                <p className="font-medium">{settlement.partnerName}</p>
              </div>
              <div className="pt-4 border-t border-slate-100">
                <p className="text-sm text-slate-500 mb-2">Applied Agreement</p>
                <div className="bg-slate-50 p-3 rounded-md border border-slate-200">
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-slate-500">Version</span>
                    <span className="font-medium">v{settlement.agreementVersion}</span>
                  </div>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-slate-500">Distributor Retains</span>
                    <span className="font-medium text-indigo-600">{settlement.distributorSharePercent}%</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-500">Partner Receives</span>
                    <span className="font-medium text-slate-900">{settlement.partnerSharePercent}%</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Workflow</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {settlement.status === 'generated' && (
                  <Button variant="primary" className="w-full bg-slate-800 hover:bg-slate-900 text-white" onClick={() => advancePartnerStatus(settlement.id, 'verified')}>
                    <FileText className="mr-2 h-4 w-4" /> Mark as Verified
                  </Button>
                )}
                {settlement.status === 'verified' && (
                  <Button variant="primary" className="w-full bg-indigo-600 hover:bg-indigo-700" onClick={() => advancePartnerStatus(settlement.id, 'approved')}>
                    <CheckCircle2 className="mr-2 h-4 w-4" /> Approve & Create Receivable
                  </Button>
                )}
                {settlement.status === 'payment_pending' && (
                  <Button variant="primary" className="w-full bg-green-600 hover:bg-green-700 border-none" onClick={() => setIsPayModalOpen(true)}>
                    <CreditCard className="mr-2 h-4 w-4" /> Pay Partner
                  </Button>
                )}
                {isLocked && settlement.status !== 'payment_pending' && (
                  <div className="text-center text-sm text-slate-500 p-3 bg-slate-50 rounded border border-slate-100">
                    No further actions available.
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      <Modal
        isOpen={isPayModalOpen}
        onClose={() => setIsPayModalOpen(false)}
        title="Record Payment to Partner"
        footer={
          <div className="flex justify-end gap-3 w-full">
            <Button variant="outline" onClick={() => setIsPayModalOpen(false)}>Cancel</Button>
            <Button className="bg-green-600 hover:bg-green-700" onClick={() => {
              markPartnerSettlementPaid(settlement.id, paymentMethod, paymentRef);
              setIsPayModalOpen(false);
            }}>Confirm Payment</Button>
          </div>
        }
      >
        <div className="space-y-4">
          <p className="text-sm text-slate-600 mb-4">
            Record a mock payment to <strong>{settlement.partnerName}</strong> for settlement <strong>{settlement.settlementNumber}</strong>.
          </p>
          <div className="p-4 bg-slate-50 border border-slate-200 rounded-md mb-4 flex justify-between items-center">
            <span className="font-medium text-slate-700">Amount to Pay</span>
            <span className="text-xl font-bold text-slate-900">₹{settlement.partnerPayableAmount.toLocaleString()}</span>
          </div>

          <Select
            label="Payment Method"
            value={paymentMethod}
            onChange={(e) => setPaymentMethod(e.target.value)}
            options={[
              { label: 'UPI', value: 'upi' },
              { label: 'Bank Transfer (IMPS/NEFT)', value: 'bank_transfer' },
              { label: 'Cash', value: 'cash' }
            ]}
          />

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Transaction Reference</label>
            <input 
              type="text" 
              className="w-full rounded-md border-slate-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm px-3 py-2 border" 
              value={paymentRef}
              onChange={(e) => setPaymentRef(e.target.value)}
            />
          </div>
        </div>
      </Modal>
    </div>
  );
}
