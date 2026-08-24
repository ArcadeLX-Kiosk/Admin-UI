import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, FileText, Lock } from 'lucide-react';
import { useSettlement } from '../../mock/settlementContext';
import { useAuth } from '../../app/authContext';
import { Button } from '../../components/ui/Button';
import { Card, CardHeader, CardTitle, CardContent } from '../../components/ui/Card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../../components/ui/Table';
import { SettlementStatusBadge } from '../../components/ui/StatusBadges';

const MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

export function PartnerSettlementDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { partnerSettlements } = useSettlement();
  
  const settlement = partnerSettlements.find(s => s.id === id && s.partnerId === user?.id);

  if (!settlement) {
    return <div className="p-8 text-center text-slate-500">Settlement not found or access denied.</div>;
  }

  const isLocked = ['approved', 'payment_pending', 'paid', 'closed'].includes(settlement.status);
  
  const base = settlement.partnerPayableAmount;
  const gst = settlement.gstAmount || (base * 0.18);
  const total = settlement.totalAmount || (base + gst);

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="sm" onClick={() => navigate('/partner/settlements')}>
          <ArrowLeft className="h-4 w-4 mr-2" /> Back
        </Button>
        <div className="flex-1">
          <h1 className="text-2xl font-bold font-mono text-slate-900">{settlement.settlementNumber}</h1>
          <div className="flex items-center gap-3 mt-1 text-sm text-slate-500">
            <span>Settlement Request</span>
            <span>•</span>
            <span>{MONTHS[settlement.periodMonth - 1]} {settlement.periodYear}</span>
            <span>•</span>
            <SettlementStatusBadge status={settlement.status} />
          </div>
        </div>
        {isLocked && (
          <div className="flex items-center text-sm font-medium text-slate-500 bg-slate-100 px-3 py-1.5 rounded-full">
            <Lock className="h-4 w-4 mr-2" /> Locked
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        <Card className="xl:col-span-2">
          <CardHeader>
            <CardTitle>Settlement Request Summary</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
              <div className="p-4 bg-slate-50 rounded-lg border border-slate-200">
                <p className="text-sm font-medium text-slate-500 mb-1">Base Entitlement</p>
                <p className="text-2xl font-bold text-slate-900">₹{base.toLocaleString('en-IN')}</p>
                <p className="text-xs text-slate-500 mt-1">Pre-tax Share ({settlement.partnerSharePercent}%)</p>
              </div>
              <div className="p-4 bg-indigo-50 rounded-lg border border-indigo-100">
                <p className="text-sm font-medium text-indigo-700 mb-1">GST (18%)</p>
                <p className="text-2xl font-bold text-indigo-900">₹{gst.toLocaleString('en-IN')}</p>
                <p className="text-xs text-indigo-600 mt-1">Added to invoice</p>
              </div>
              <div className="p-4 bg-slate-800 rounded-lg border border-slate-700">
                <p className="text-sm font-medium text-slate-400 mb-1">Total Requested</p>
                <p className="text-2xl font-bold text-white">₹{total.toLocaleString('en-IN')}</p>
                <p className="text-xs text-slate-400 mt-1">Amount to receive from Company</p>
              </div>
            </div>

            <h3 className="text-lg font-bold text-slate-900 mb-4">Machine Revenue Breakdown</h3>
            <div className="border border-slate-200 rounded-lg overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Machine Code</TableHead>
                    <TableHead className="text-right">Gross Revenue</TableHead>
                    <TableHead className="text-right">Distributor Retained</TableHead>
                    <TableHead className="text-right">My Share</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {settlement.machineBreakdown.map(mb => (
                    <TableRow key={mb.machineId}>
                      <TableCell className="font-mono font-medium">{mb.machineCode}</TableCell>
                      <TableCell className="text-right font-medium">₹{mb.grossRevenue.toLocaleString('en-IN')}</TableCell>
                      <TableCell className="text-right text-slate-500">₹{mb.companyShareAmount.toLocaleString('en-IN')}</TableCell>
                      <TableCell className="text-right text-indigo-600 font-medium">₹{mb.distributorShareAmount.toLocaleString('en-IN')}</TableCell>
                    </TableRow>
                  ))}
                  <TableRow className="bg-slate-50 font-bold">
                    <TableCell>TOTAL</TableCell>
                    <TableCell className="text-right text-slate-900">₹{settlement.machineBreakdown.reduce((a,b)=>a+b.grossRevenue,0).toLocaleString('en-IN')}</TableCell>
                    <TableCell className="text-right text-slate-700">₹{settlement.distributorRetainedAmount.toLocaleString('en-IN')}</TableCell>
                    <TableCell className="text-right text-indigo-700">₹{settlement.partnerPayableAmount.toLocaleString('en-IN')}</TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Agreement Information</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center gap-3 p-3 bg-slate-50 border border-slate-100 rounded-md">
                  <FileText className="h-5 w-5 text-slate-400" />
                  <div>
                    <p className="text-sm font-medium text-slate-900">Applied Agreement Version: {settlement.agreementVersion}</p>
                    <p className="text-xs text-slate-500">Based on active agreement at time of request</p>
                  </div>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-slate-500">Distributor Share:</span>
                  <span className="font-bold">{settlement.distributorSharePercent}%</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-slate-500">My Share:</span>
                  <span className="font-bold">{settlement.partnerSharePercent}%</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Status Tracking</CardTitle>
            </CardHeader>
            <CardContent>
              {['draft', 'requested', 'generated', 'verified', 'under_review'].includes(settlement.status) ? (
                <div className="text-center text-sm text-slate-500 py-4">
                  Settlement request is currently being reviewed by the Company.
                </div>
              ) : settlement.status === 'payment_pending' ? (
                <div className="text-center p-4 bg-orange-50 text-orange-700 rounded-lg border border-orange-100">
                  <span className="text-sm font-medium block mb-1">Payment is Pending</span>
                  <span className="text-xs">The Company has approved this request. Waiting for payment.</span>
                </div>
              ) : settlement.status === 'paid' ? (
                <div className="text-center p-4 bg-green-50 text-green-700 rounded-lg border border-green-100">
                  <span className="text-sm font-medium block mb-1">Settlement Paid</span>
                  <span className="text-xs">Funds have been disbursed by the Company.</span>
                </div>
              ) : (
                <div className="text-center text-sm text-slate-500 py-4 capitalize">
                  Status: {settlement.status.replace('_', ' ')}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
