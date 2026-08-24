import React from 'react';
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

export function CompanySettlementDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { settlements, advanceStatus, markCompanySettlementPaid } = useSettlement();
  
  const [isPayModalOpen, setIsPayModalOpen] = React.useState(false);
  const [paymentMethod, setPaymentMethod] = React.useState('bank_transfer');
  const [paymentRef, setPaymentRef] = React.useState(`TXN-BANK-${Math.floor(Math.random() * 1000000)}`);

  const settlement = settlements.find(s => s.id === id);

  if (!settlement) {
    return <div className="p-8 text-center text-slate-500">Settlement not found.</div>;
  }

  const isLocked = ['approved', 'payment_pending', 'paid', 'closed'].includes(settlement.status);

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="sm" onClick={() => navigate('/company/settlements')}>
          <ArrowLeft className="h-4 w-4 mr-2" /> Back
        </Button>
        <div className="flex-1">
          <h1 className="text-2xl font-bold font-mono text-slate-900">{settlement.settlementNumber}</h1>
          <div className="flex items-center gap-3 mt-1 text-sm text-slate-500">
            <span>{settlement.distributorName}</span>
            <span>•</span>
            <span>{MONTHS[settlement.periodMonth - 1]} {settlement.periodYear}</span>
            <span>•</span>
            <SettlementStatusBadge status={settlement.status} />
          </div>
        </div>
        {isLocked && (
          <div className="flex items-center text-sm font-medium text-slate-500 bg-slate-100 px-3 py-1.5 rounded-full">
            <Lock className="h-4 w-4 mr-2" /> Approved & Locked
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Settlement Summary</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
              <div className="p-4 bg-slate-50 rounded-lg border border-slate-200">
                <p className="text-sm font-medium text-slate-500 mb-1">Gross Revenue</p>
                <p className="text-2xl font-bold text-slate-900">₹{settlement.grossRevenue.toLocaleString()}</p>
                <p className="text-xs text-slate-500 mt-1">From {settlement.machineBreakdown.length} machines</p>
              </div>
              <div className="p-4 bg-indigo-50 rounded-lg border border-indigo-100">
                <p className="text-sm font-medium text-indigo-700 mb-1">Company Share</p>
                <p className="text-2xl font-bold text-indigo-900">₹{settlement.companyShareAmount.toLocaleString()}</p>
                <p className="text-xs text-indigo-600 mt-1">{settlement.companySharePercent}%</p>
              </div>
              <div className="p-4 bg-slate-800 rounded-lg border border-slate-700">
                <p className="text-sm font-medium text-slate-400 mb-1">Distributor Payable</p>
                <p className="text-2xl font-bold text-white">₹{settlement.distributorShareAmount.toLocaleString()}</p>
                <p className="text-xs text-slate-400 mt-1">{settlement.distributorSharePercent}%</p>
              </div>
            </div>

            <h3 className="text-lg font-bold text-slate-900 mb-4">Machine Revenue Breakdown</h3>
            <div className="border border-slate-200 rounded-lg overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Machine Code</TableHead>
                    <TableHead className="text-right">Gross Revenue</TableHead>
                    <TableHead className="text-right">Company Share</TableHead>
                    <TableHead className="text-right">Distributor Share</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {settlement.machineBreakdown.map(mb => (
                    <TableRow key={mb.machineId}>
                      <TableCell className="font-mono font-medium">{mb.machineCode}</TableCell>
                      <TableCell className="text-right font-medium">₹{mb.grossRevenue.toLocaleString()}</TableCell>
                      <TableCell className="text-right text-indigo-600">₹{mb.companyShareAmount.toLocaleString()}</TableCell>
                      <TableCell className="text-right font-medium">₹{mb.distributorShareAmount.toLocaleString()}</TableCell>
                    </TableRow>
                  ))}
                  <TableRow className="bg-slate-50 font-bold">
                    <TableCell>TOTAL</TableCell>
                    <TableCell className="text-right text-slate-900">₹{settlement.grossRevenue.toLocaleString()}</TableCell>
                    <TableCell className="text-right text-indigo-700">₹{settlement.companyShareAmount.toLocaleString()}</TableCell>
                    <TableCell className="text-right text-slate-900">₹{settlement.distributorShareAmount.toLocaleString()}</TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Agreement Used</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center gap-3 p-3 bg-slate-50 border border-slate-100 rounded-md">
                  <FileText className="h-5 w-5 text-slate-400" />
                  <div>
                    <p className="text-sm font-medium text-slate-900">Version {settlement.agreementVersion}</p>
                    <p className="text-xs text-slate-500">Applied for {MONTHS[settlement.periodMonth - 1]} {settlement.periodYear}</p>
                  </div>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-slate-500">Company Share:</span>
                  <span className="font-bold">{settlement.companySharePercent}%</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-slate-500">Distributor Share:</span>
                  <span className="font-bold">{settlement.distributorSharePercent}%</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Financial Ledger Preview</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-xs text-slate-500 mb-4">Conceptual financial record generation.</p>
              
              <div className="space-y-3 font-mono text-sm">
                <div className="flex justify-between pb-2 border-b border-slate-100">
                  <span className="text-slate-600">Revenue Recognized</span>
                  <span className="text-slate-900 font-bold">₹{settlement.grossRevenue.toLocaleString()}</span>
                </div>
                <div className="flex justify-between pb-2 border-b border-slate-100">
                  <span className="text-slate-600">Company Retained</span>
                  <span className="text-indigo-600 font-bold">₹{settlement.companyShareAmount.toLocaleString()}</span>
                </div>
                <div className="flex justify-between pb-2">
                  <span className="text-slate-600">Distributor Payable</span>
                  <span className="text-orange-600 font-bold">₹{settlement.distributorShareAmount.toLocaleString()}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Actions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {settlement.status === 'generated' && (
                  <Button className="w-full" onClick={() => advanceStatus(settlement.id, 'verified')}>
                    Verify Calculation
                  </Button>
                )}
                {settlement.status === 'verified' && (
                  <Button variant="primary" className="w-full bg-purple-600 hover:bg-purple-700 border-none" onClick={() => advanceStatus(settlement.id, 'approved')}>
                    <CheckCircle2 className="mr-2 h-4 w-4" /> Approve & Create Receivable
                  </Button>
                )}
                {settlement.status === 'payment_pending' && (
                  <Button variant="primary" className="w-full bg-green-600 hover:bg-green-700 border-none" onClick={() => setIsPayModalOpen(true)}>
                    <CreditCard className="mr-2 h-4 w-4" /> Pay Distributor
                  </Button>
                )}
                {isLocked && settlement.status !== 'payment_pending' && (
                  <div className="text-center text-sm text-slate-500 p-3 bg-slate-50 rounded border border-slate-100">
                    No further actions available.<br/>Receivable generated.
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
        title="Record Payment to Distributor"
        footer={
          <div className="flex justify-end gap-3 w-full">
            <Button variant="outline" onClick={() => setIsPayModalOpen(false)}>Cancel</Button>
            <Button className="bg-green-600 hover:bg-green-700" onClick={() => {
              markCompanySettlementPaid(settlement.id, paymentMethod, paymentRef);
              setIsPayModalOpen(false);
            }}>Confirm Payment</Button>
          </div>
        }
      >
        <div className="space-y-4">
          <p className="text-sm text-slate-600 mb-4">
            Record a mock payment to <strong>{settlement.distributorName}</strong> for settlement <strong>{settlement.settlementNumber}</strong>.
          </p>
          <div className="p-4 bg-slate-50 border border-slate-200 rounded-md mb-4 flex justify-between items-center">
            <span className="font-medium text-slate-700">Amount to Pay</span>
            <span className="text-xl font-bold text-slate-900">₹{settlement.distributorShareAmount.toLocaleString()}</span>
          </div>

          <Select
            label="Payment Method"
            value={paymentMethod}
            onChange={(e) => setPaymentMethod(e.target.value)}
            options={[
              { label: 'Bank Transfer (NEFT/RTGS)', value: 'bank_transfer' },
              { label: 'UPI', value: 'upi' },
              { label: 'Cheque', value: 'cheque' }
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
