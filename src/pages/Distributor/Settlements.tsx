import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Eye, FileText, CheckCircle2, Plus, CreditCard } from 'lucide-react';
import { useSettlement } from '../../mock/settlementContext';
import { useAuth } from '../../app/authContext';
import { useOrg } from '../../mock/orgContext';
import { Button } from '../../components/ui/Button';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/Card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../../components/ui/Table';
import { SettlementStatusBadge } from '../../components/ui/StatusBadges';
import { GeneratePartnerSettlementModal } from '../../components/settlement/GeneratePartnerSettlementModal';
import { PayPartnerModal } from '../../components/settlement/PayPartnerModal';

const MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

export function DistributorSettlementsList() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { settlements, receivables, partnerSettlements, partnerReceivables, advancePartnerStatus } = useSettlement();
  const { partners } = useOrg();
  
  const [isGenerateModalOpen, setIsGenerateModalOpen] = useState(false);
  const [isPayModalOpen, setIsPayModalOpen] = useState(false);
  const [selectedSettlementId, setSelectedSettlementId] = useState<string | null>(null);

  // Filter for this distributor only
  const mySettlements = settlements.filter(s => s.distributorId === user?.id);
  const myReceivables = receivables.filter(r => r.distributorId === user?.id && r.status === 'payment_pending');
  const myPartnerSettlements = partnerSettlements.filter(s => s.distributorId === user?.id);

  const pendingAmount = myReceivables.reduce((acc, curr) => acc + curr.amount, 0);

  const getPartnerName = (id: string) => {
    return partners.find(p => p.id === id)?.businessName || id;
  };

  const handlePayClick = (id: string) => {
    setSelectedSettlementId(id);
    setIsPayModalOpen(true);
  };

  const handleApprovePartnerSettlement = (id: string) => {
    advancePartnerStatus(id, 'approved');
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Settlements</h1>
        <p className="text-sm text-slate-500">Track company settlements and manage payouts to your partners.</p>
      </div>

      {pendingAmount > 0 && (
        <div className="p-4 bg-orange-50 border border-orange-200 rounded-lg flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-orange-100 rounded-full">
              <FileText className="h-5 w-5 text-orange-600" />
            </div>
            <div>
              <p className="text-sm font-medium text-orange-900">Pending Receivables from Company</p>
              <p className="text-xs text-orange-700">You have approved settlements awaiting payment.</p>
            </div>
          </div>
          <div className="text-right">
            <p className="text-2xl font-bold text-orange-900">₹{pendingAmount.toLocaleString()}</p>
          </div>
        </div>
      )}

      {/* Company Settlements */}
      <Card>
        <CardHeader>
          <CardTitle>Company Settlements</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Settlement ID</TableHead>
                <TableHead>Period</TableHead>
                <TableHead className="text-right">Gross Revenue</TableHead>
                <TableHead className="text-right">Company Share</TableHead>
                <TableHead className="text-right">My Share</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {mySettlements.map(s => (
                <TableRow key={s.id}>
                  <TableCell className="font-mono font-medium text-slate-900">{s.settlementNumber}</TableCell>
                  <TableCell className="text-sm">{MONTHS[s.periodMonth - 1]} {s.periodYear}</TableCell>
                  <TableCell className="text-right font-medium text-slate-900">₹{s.grossRevenue.toLocaleString()}</TableCell>
                  <TableCell className="text-right text-slate-500">₹{s.companyShareAmount.toLocaleString()}</TableCell>
                  <TableCell className="text-right text-indigo-600 font-bold">₹{s.distributorShareAmount.toLocaleString()}</TableCell>
                  <TableCell>
                    <SettlementStatusBadge status={s.status} />
                  </TableCell>
                  <TableCell className="text-right">
                    <Button variant="ghost" size="sm" onClick={() => navigate(`/distributor/settlements/${s.id}`)}>
                      <Eye className="h-4 w-4 mr-2" /> View Details
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
              {mySettlements.length === 0 && (
                <TableRow><TableCell colSpan={7} className="text-center py-6 text-slate-500">No company settlements generated yet.</TableCell></TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Partner Settlements */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between border-b border-slate-200 bg-slate-50 rounded-t-xl">
          <CardTitle>Partner Settlements</CardTitle>
          <Button onClick={() => setIsGenerateModalOpen(true)} size="sm">
            <Plus className="mr-2 h-4 w-4" /> Generate Settlement
          </Button>
        </CardHeader>
        <CardContent className="pt-6">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Partner</TableHead>
                <TableHead>Period</TableHead>
                <TableHead className="text-right">Eligible Revenue</TableHead>
                <TableHead className="text-right">My Retained</TableHead>
                <TableHead className="text-right">Partner Payable</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {myPartnerSettlements.map(s => {
                const partnerRec = partnerReceivables.find(r => r.settlementId === s.id);
                const isPayable = (s.status === 'approved' || s.status === 'payment_pending') && partnerRec;

                return (
                  <TableRow key={s.id}>
                    <TableCell className="font-medium text-slate-900">{getPartnerName(s.partnerId)}</TableCell>
                    <TableCell className="text-sm">{MONTHS[s.periodMonth - 1]} {s.periodYear}</TableCell>
                    <TableCell className="text-right font-medium text-slate-900">₹{s.eligibleRevenue.toLocaleString()}</TableCell>
                    <TableCell className="text-right text-emerald-600">₹{s.distributorRetainedAmount.toLocaleString()}</TableCell>
                    <TableCell className="text-right text-indigo-600 font-bold">₹{s.partnerPayableAmount.toLocaleString()}</TableCell>
                    <TableCell>
                      <SettlementStatusBadge status={s.status} />
                    </TableCell>
                    <TableCell className="text-right space-x-2 flex justify-end">
                      {s.status === 'generated' && (
                        <Button variant="outline" size="sm" onClick={() => handleApprovePartnerSettlement(s.id)}>
                          Approve
                        </Button>
                      )}
                      {isPayable && (
                        <Button variant="primary" size="sm" onClick={() => handlePayClick(s.id)}>
                          <CreditCard className="h-4 w-4 mr-2" /> Pay Partner
                        </Button>
                      )}
                    </TableCell>
                  </TableRow>
                );
              })}
              {myPartnerSettlements.length === 0 && (
                <TableRow><TableCell colSpan={7} className="text-center py-6 text-slate-500">No partner settlements generated yet.</TableCell></TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* These components are missing, I'll need to create them next. */}
      {isGenerateModalOpen && (
        <GeneratePartnerSettlementModal 
          isOpen={isGenerateModalOpen} 
          onClose={() => setIsGenerateModalOpen(false)} 
        />
      )}

      {selectedSettlementId && (
        <PayPartnerModal
          isOpen={isPayModalOpen}
          onClose={() => {
            setIsPayModalOpen(false);
            setSelectedSettlementId(null);
          }}
          settlementId={selectedSettlementId}
        />
      )}
    </div>
  );
}
