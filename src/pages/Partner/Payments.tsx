import React from 'react';
import { ArrowDownLeft, FileText, Calendar } from 'lucide-react';
import { useSettlement } from '../../mock/settlementContext';
import { useAuth } from '../../app/authContext';
import { Card, CardHeader, CardTitle, CardContent } from '../../components/ui/Card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../../components/ui/Table';

export function PartnerPaymentsList() {
  const { user } = useAuth();
  const { payments } = useSettlement();
  
  // Sender should be 'company'
  const receivedPayments = payments.filter(p => p.recipientId === user?.id && p.status === 'paid');

  const totalReceived = receivedPayments.reduce((acc, curr) => acc + curr.amount, 0);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Payments</h1>
        <p className="text-sm text-slate-500">Track all incoming payments from the Company.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-lg flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-emerald-100 rounded-full">
              <ArrowDownLeft className="h-5 w-5 text-emerald-600" />
            </div>
            <div>
              <p className="text-sm font-medium text-emerald-900">Total Received</p>
              <p className="text-xs text-emerald-700">From Company settlements</p>
            </div>
          </div>
          <div className="text-right">
            <p className="text-2xl font-bold text-emerald-900">₹{totalReceived.toLocaleString('en-IN')}</p>
          </div>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Payments Received from Company</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Payment ID</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Settlement Ref</TableHead>
                <TableHead>Method</TableHead>
                <TableHead>Transaction Ref</TableHead>
                <TableHead className="text-right">Amount</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {receivedPayments.map(p => (
                <TableRow key={p.id}>
                  <TableCell className="font-mono font-medium text-slate-900 text-xs">{p.id}</TableCell>
                  <TableCell className="text-sm">
                    <div className="flex items-center text-slate-500">
                      <Calendar className="h-3 w-3 mr-1" />
                      {new Date(p.paidAt).toLocaleDateString()}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center text-indigo-600 font-medium text-sm">
                      <FileText className="h-3 w-3 mr-1" />
                      {p.settlementId.split('-').slice(-2).join('-')}
                    </div>
                  </TableCell>
                  <TableCell className="capitalize text-sm">{p.paymentMethod.replace('_', ' ')}</TableCell>
                  <TableCell className="font-mono text-xs text-slate-500">{p.transactionReference}</TableCell>
                  <TableCell className="text-right font-bold text-emerald-600">₹{p.amount.toLocaleString('en-IN')}</TableCell>
                </TableRow>
              ))}
              {receivedPayments.length === 0 && (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-8 text-slate-500">
                    No payments received yet.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
