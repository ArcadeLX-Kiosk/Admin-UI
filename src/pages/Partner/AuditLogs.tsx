import React, { useState } from 'react';
import { useAuth } from '../../app/authContext';
import { useAudit } from '../../mock/auditContext';
import { Card, CardHeader, CardTitle, CardContent } from '../../components/ui/Card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../../components/ui/Table';
import { Activity, Search } from 'lucide-react';

export function PartnerAuditLogs() {
  const { user } = useAuth();
  const { auditLogs: logs } = useAudit();
  const [searchTerm, setSearchTerm] = useState('');

  const myLogs = logs.filter(log => log.partnerId === user?.id || log.actorId === user?.id);

  const filteredLogs = myLogs.filter(log => 
    log.action.toLowerCase().includes(searchTerm.toLowerCase()) ||
    log.actorName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    log.entityType.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Activity Logs</h1>
          <p className="text-slate-500">History of your account actions and settlements.</p>
        </div>
      </div>

      <Card>
        <CardHeader className="bg-slate-50 border-b border-slate-200">
          <div className="flex justify-between items-center">
            <CardTitle className="text-lg flex items-center gap-2">
              <Activity className="w-5 h-5 text-indigo-600" />
              Recent Activity
            </CardTitle>
            <div className="relative w-64">
              <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
              <input 
                type="text" 
                placeholder="Search logs..." 
                className="pl-9 pr-4 py-2 w-full border border-slate-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Timestamp</TableHead>
                <TableHead>Actor</TableHead>
                <TableHead>Action</TableHead>
                <TableHead>Entity</TableHead>
                <TableHead>Reference</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredLogs.map(log => (
                <TableRow key={log.id}>
                  <TableCell className="text-sm text-slate-600">
                    {new Date(log.timestamp).toLocaleString()}
                  </TableCell>
                  <TableCell>
                    <div className="font-medium text-slate-900">{log.actorName}</div>
                    <div className="text-xs text-slate-500 capitalize">{log.actorRole}</div>
                  </TableCell>
                  <TableCell className="font-medium text-indigo-600">{log.action}</TableCell>
                  <TableCell>
                    <div className="text-sm capitalize">{log.entityType}</div>
                    <div className="text-xs text-slate-500 font-mono">{log.entityId}</div>
                  </TableCell>
                  <TableCell className="text-xs font-mono text-slate-500">{log.entityId}</TableCell>
                  <TableCell>
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                      Completed
                    </span>
                  </TableCell>
                </TableRow>
              ))}
              {filteredLogs.length === 0 && (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-8 text-slate-500">
                    No matching activity logs found.
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
