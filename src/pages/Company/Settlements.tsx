import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Eye } from 'lucide-react';
import { useSettlement } from '../../mock/settlementContext';
import { Button } from '../../components/ui/Button';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/Card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../../components/ui/Table';
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
  const { settlements, partnerSettlements } = useSettlement();

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Settlement Requests</h1>
          <p className="text-sm text-slate-500">Review and pay settlement requests from Distributors and Partners.</p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Distributor Settlement Requests</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Request ID</TableHead>
                <TableHead>Period</TableHead>
                <TableHead>Distributor</TableHead>
                <TableHead className="text-right">Base Amount</TableHead>
                <TableHead className="text-right">GST (18%)</TableHead>
                <TableHead className="text-right">Total Requested</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {settlements.map(s => {
                const base = s.distributorShareAmount;
                const gst = s.gstAmount || (base * 0.18);
                const total = s.totalAmount || (base + gst);
                
                return (
                  <TableRow key={s.id}>
                    <TableCell className="font-mono font-medium text-slate-900">{s.settlementNumber}</TableCell>
                    <TableCell className="text-sm">{MONTHS.find(m => m.value === s.periodMonth)?.label} {s.periodYear}</TableCell>
                    <TableCell className="font-medium">{s.distributorName}</TableCell>
                    <TableCell className="text-right font-medium">₹{base.toLocaleString('en-IN')}</TableCell>
                    <TableCell className="text-right text-slate-500 text-sm">₹{gst.toLocaleString('en-IN')}</TableCell>
                    <TableCell className="text-right font-medium text-slate-900">₹{total.toLocaleString('en-IN')}</TableCell>
                    <TableCell>
                      <SettlementStatusBadge status={s.status} />
                    </TableCell>
                    <TableCell className="text-right">
                      <Button variant="ghost" size="sm" onClick={() => navigate('/company/settlements/' + s.id)}>
                        <Eye className="h-4 w-4 mr-2" /> View
                      </Button>
                    </TableCell>
                  </TableRow>
                );
              })}
              {settlements.length === 0 && (
                <TableRow><TableCell colSpan={8} className="text-center py-6 text-slate-500">No distributor requests yet.</TableCell></TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Partner Settlement Requests</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Request ID</TableHead>
                <TableHead>Period</TableHead>
                <TableHead>Partner</TableHead>
                <TableHead className="text-right">Base Amount</TableHead>
                <TableHead className="text-right">GST (18%)</TableHead>
                <TableHead className="text-right">Total Requested</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {partnerSettlements.map(s => {
                const base = s.partnerPayableAmount;
                const gst = s.gstAmount || (base * 0.18);
                const total = s.totalAmount || (base + gst);
                
                return (
                  <TableRow key={s.id}>
                    <TableCell className="font-mono font-medium text-slate-900">{s.settlementNumber}</TableCell>
                    <TableCell className="text-sm">{MONTHS.find(m => m.value === s.periodMonth)?.label} {s.periodYear}</TableCell>
                    <TableCell className="font-medium">{s.partnerName}</TableCell>
                    <TableCell className="text-right font-medium">₹{base.toLocaleString('en-IN')}</TableCell>
                    <TableCell className="text-right text-slate-500 text-sm">₹{gst.toLocaleString('en-IN')}</TableCell>
                    <TableCell className="text-right font-medium text-slate-900">₹{total.toLocaleString('en-IN')}</TableCell>
                    <TableCell>
                      <SettlementStatusBadge status={s.status} />
                    </TableCell>
                    <TableCell className="text-right">
                      {/* There is no Company view for partner settlements yet. We should just show it here.
                          Wait, how does Company view it? We can reuse the view page, but it's specific to CompanyDistributorSettlement. 
                          I will just add an action here or build a basic modal. */}
                    </TableCell>
                  </TableRow>
                );
              })}
              {partnerSettlements.length === 0 && (
                <TableRow><TableCell colSpan={8} className="text-center py-6 text-slate-500">No partner requests yet.</TableCell></TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
