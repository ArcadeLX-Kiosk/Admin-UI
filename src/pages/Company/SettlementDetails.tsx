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
  const { 
    settlements, advanceStatus, markCompanySettlementPaid,
    partnerSettlements, advancePartnerStatus, markPartnerSettlementPaid 
  } = useSettlement();
  
  const [isPayModalOpen, setIsPayModalOpen] = React.useState(false);
  const [paymentMethod, setPaymentMethod] = React.useState('bank_transfer');
  const [paymentRef, setPaymentRef] = React.useState("TXN-BANK-" + Math.floor(Math.random() * 1000000));

  let settlement: any = settlements.find(s => s.id === id);
  let type: 'distributor' | 'partner' = 'distributor';
  
  if (!settlement) {
    settlement = partnerSettlements.find(s => s.id === id);
    type = 'partner';
  }

  if (!settlement) {
    return <div className="p-8 text-center text-slate-500">Settlement not found.</div>;
  }

  const isLocked = ['approved', 'payment_pending', 'paid', 'closed'].includes(settlement.status);
  
  // Normalize fields between Distributor and Partner settlements
  const isPartner = type === 'partner';
  const recipientName = isPartner ? settlement.partnerName : settlement.distributorName;
  const baseAmount = isPartner ? settlement.partnerPayableAmount : settlement.distributorShareAmount;
  const gstAmount = settlement.gstAmount || (baseAmount * 0.18);
  const totalAmount = settlement.totalAmount || (baseAmount + gstAmount);
  
  const handleApprove = () => {
    if (isPartner) {
      advancePartnerStatus(settlement.id, 'approved');
    } else {
      advanceStatus(settlement.id, 'approved');
    }
  };
  
  const handleVerify = () => {
    if (isPartner) {
      advancePartnerStatus(settlement.id, 'under_review');
    } else {
      advanceStatus(settlement.id, 'under_review');
    }
  };

  const handlePay = () => {
    if (isPartner) {
      markPartnerSettlementPaid(settlement.id, paymentMethod, paymentRef);
    } else {
      markCompanySettlementPaid(settlement.id, paymentMethod, paymentRef);
    }
    setIsPayModalOpen(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="sm" onClick={() => navigate('/company/settlements')}>
          <ArrowLeft className="h-4 w-4 mr-2" /> Back
        </Button>
        <div className="flex-1">
          <h1 className="text-2xl font-bold font-mono text-slate-900">{settlement.settlementNumber}</h1>
          <div className="flex items-center gap-3 mt-1 text-sm text-slate-500">
            <span>{recipientName} ({isPartner ? 'Partner' : 'Distributor'})</span>
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
                <p className="text-sm font-medium text-slate-500 mb-1">Base Entitlement</p>
                <p className="text-2xl font-bold text-slate-900">₹{baseAmount.toLocaleString('en-IN')}</p>
                <p className="text-xs text-slate-500 mt-1">Pre-tax</p>
              </div>
              <div className="p-4 bg-indigo-50 rounded-lg border border-indigo-100">
                <p className="text-sm font-medium text-indigo-700 mb-1">GST (18%)</p>
                <p className="text-2xl font-bold text-indigo-900">₹{gstAmount.toLocaleString('en-IN')}</p>
              </div>
              <div className="p-4 bg-slate-800 rounded-lg border border-slate-700">
                <p className="text-sm font-medium text-slate-400 mb-1">Total Requested</p>
                <p className="text-2xl font-bold text-white">₹{totalAmount.toLocaleString('en-IN')}</p>
              </div>
            </div>

            <h3 className="text-lg font-bold text-slate-900 mb-4">Machine Revenue Breakdown</h3>
            <div className="border border-slate-200 rounded-lg overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Machine Code</TableHead>
                    <TableHead className="text-right">Gross Revenue</TableHead>
                    <TableHead className="text-right">{isPartner ? 'Distributor Retained' : 'Company Share'}</TableHead>
                    <TableHead className="text-right">{isPartner ? 'Partner Share' : 'Distributor Share'}</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {settlement.machineBreakdown.map((mb: any) => (
                    <TableRow key={mb.machineId}>
                      <TableCell className="font-mono font-medium">{mb.machineCode}</TableCell>
                      <TableCell className="text-right font-medium">₹{mb.grossRevenue.toLocaleString('en-IN')}</TableCell>
                      <TableCell className="text-right text-indigo-600">₹{mb.companyShareAmount.toLocaleString('en-IN')}</TableCell>
                      <TableCell className="text-right font-medium">₹{mb.distributorShareAmount.toLocaleString('en-IN')}</TableCell>
                    </TableRow>
                  ))}
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
                {!isPartner ? (
                  <>
                    <div className="flex justify-between text-sm">
                      <span className="text-slate-500">Company Share:</span>
                      <span className="font-bold">{settlement.companySharePercent}%</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-slate-500">Distributor Share:</span>
                      <span className="font-bold">{settlement.distributorSharePercent}%</span>
                    </div>
                  </>
                ) : (
                  <>
                    <div className="flex justify-between text-sm">
                      <span className="text-slate-500">Distributor Share:</span>
                      <span className="font-bold">{settlement.distributorSharePercent}%</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-slate-500">Partner Share:</span>
                      <span className="font-bold">{settlement.partnerSharePercent}%</span>
                    </div>
                  </>
                )}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Actions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {['generated', 'requested'].includes(settlement.status) && (
                  <Button className="w-full" onClick={handleVerify}>
                    Mark Under Review
                  </Button>
                )}
                {['verified', 'under_review'].includes(settlement.status) && (
                  <Button variant="primary" className="w-full bg-purple-600 hover:bg-purple-700 border-none" onClick={handleApprove}>
                    <CheckCircle2 className="mr-2 h-4 w-4" /> Approve & Create Receivable
                  </Button>
                )}
                {settlement.status === 'payment_pending' && (
                  <Button variant="primary" className="w-full bg-green-600 hover:bg-green-700 border-none" onClick={() => setIsPayModalOpen(true)}>
                    <CreditCard className="mr-2 h-4 w-4" /> Pay {isPartner ? 'Partner' : 'Distributor'}
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
        title={"Record Payment to " + recipientName}
        footer={
          <div className="flex justify-end gap-3 w-full">
            <Button variant="outline" onClick={() => setIsPayModalOpen(false)}>Cancel</Button>
            <Button className="bg-green-600 hover:bg-green-700" onClick={handlePay}>Confirm Payment</Button>
          </div>
        }
      >
        <div className="space-y-4">
          <p className="text-sm text-slate-600 mb-4">
            Record a mock payment to <strong>{recipientName}</strong> for settlement <strong>{settlement.settlementNumber}</strong>.
          </p>
          <div className="p-4 bg-slate-50 border border-slate-200 rounded-md mb-4 flex justify-between items-center">
            <span className="font-medium text-slate-700">Total Amount to Pay</span>
            <span className="text-xl font-bold text-slate-900">₹{totalAmount.toLocaleString('en-IN')}</span>
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
