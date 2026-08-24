import React from 'react';
import { useSettlement } from '../../mock/settlementContext';
import { useAuth } from '../../app/authContext';
import { useOrg } from '../../mock/orgContext';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/Card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../../components/ui/Table';

export function DistributorPaymentsList() {
  const { user } = useAuth();
  const { payments, settlements, partnerSettlements } = useSettlement();
  const { partners } = useOrg();

  // Incoming (from company)
  const incomingPayments = payments.filter(p => p.recipientId === user?.id && p.senderId === 'company');
  
  // Outgoing (to partners)
  const outgoingPayments = payments.filter(p => p.senderId === user?.id);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Payment Ledger</h1>
        <p className="text-sm text-slate-500">Track incoming payouts from the Company and outgoing payouts to Partners.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader className="bg-emerald-50 border-b border-emerald-100 rounded-t-xl">
            <CardTitle className="text-emerald-900">Received from Company</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Date</TableHead>
                  <TableHead>Settlement</TableHead>
                  <TableHead className="text-right">Amount</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {incomingPayments.map(pay => {
                  const settlement = settlements.find(s => s.id === pay.settlementId);
                  const date = new Date(pay.paidAt).toLocaleDateString();
                  
                  return (
                    <TableRow key={pay.id}>
                      <TableCell className="text-sm">{date}</TableCell>
                      <TableCell className="font-mono text-sm">{settlement?.settlementNumber}</TableCell>
                      <TableCell className="text-right font-bold text-emerald-700">₹{pay.amount.toLocaleString()}</TableCell>
                    </TableRow>
                  );
                })}
                {incomingPayments.length === 0 && (
                  <TableRow><TableCell colSpan={3} className="text-center py-6 text-slate-500">No incoming payments yet.</TableCell></TableRow>
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="bg-indigo-50 border-b border-indigo-100 rounded-t-xl">
            <CardTitle className="text-indigo-900">Paid to Partners</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Date</TableHead>
                  <TableHead>Partner</TableHead>
                  <TableHead className="text-right">Amount</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {outgoingPayments.map(pay => {
                  const partner = partners.find(p => p.id === pay.recipientId);
                  const settlement = partnerSettlements.find(s => s.id === pay.settlementId);
                  const date = new Date(pay.paidAt).toLocaleDateString();
                  
                  return (
                    <TableRow key={pay.id}>
                      <TableCell className="text-sm">{date}</TableCell>
                      <TableCell className="font-medium text-slate-900">
                        {partner?.businessName || 'Unknown'}
                        <div className="text-xs text-slate-500 font-normal">{settlement?.settlementNumber}</div>
                      </TableCell>
                      <TableCell className="text-right font-bold text-indigo-700">₹{pay.amount.toLocaleString()}</TableCell>
                    </TableRow>
                  );
                })}
                {outgoingPayments.length === 0 && (
                  <TableRow><TableCell colSpan={3} className="text-center py-6 text-slate-500">No outgoing payments yet.</TableCell></TableRow>
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
