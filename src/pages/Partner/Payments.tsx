import React from 'react';
import { useSettlement } from '../../mock/settlementContext';
import { useAuth } from '../../app/authContext';
import { useOrg } from '../../mock/orgContext';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/Card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../../components/ui/Table';

export function PartnerPaymentsList() {
  const { user } = useAuth();
  const { payments, partnerSettlements } = useSettlement();
  const { distributors } = useOrg();

  // Incoming (from distributor)
  const incomingPayments = payments.filter(p => p.recipientId === user?.id);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Payment History</h1>
        <p className="text-sm text-slate-500">Log of all payments received from your Distributor.</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Received Payments</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Payment Ref</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>From</TableHead>
                <TableHead>Settlement</TableHead>
                <TableHead>Method</TableHead>
                <TableHead className="text-right">Amount</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {incomingPayments.map(pay => {
                const distributor = distributors.find(d => d.id === pay.senderId);
                const settlement = partnerSettlements.find(s => s.id === pay.settlementId);
                const date = new Date(pay.paidAt).toLocaleDateString();
                
                return (
                  <TableRow key={pay.id}>
                    <TableCell className="font-mono text-sm">{pay.transactionReference}</TableCell>
                    <TableCell className="text-sm">{date}</TableCell>
                    <TableCell className="font-medium">{distributor?.businessName || 'Unknown'}</TableCell>
                    <TableCell className="font-mono text-sm">{settlement?.settlementNumber}</TableCell>
                    <TableCell className="text-sm capitalize">{pay.paymentMethod.replace('_', ' ')}</TableCell>
                    <TableCell className="text-right font-bold text-emerald-700">₹{pay.amount.toLocaleString()}</TableCell>
                    <TableCell>
                      <span className="px-2 py-1 bg-green-50 text-green-700 border border-green-200 rounded-full text-xs font-medium capitalize">
                        {pay.status}
                      </span>
                    </TableCell>
                  </TableRow>
                );
              })}
              {incomingPayments.length === 0 && (
                <TableRow><TableCell colSpan={7} className="text-center py-6 text-slate-500">No payments received yet.</TableCell></TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
