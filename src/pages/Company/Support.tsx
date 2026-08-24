import React, { useState } from 'react';
import { useSupport } from '../../mock/supportContext';
import { Card, CardHeader, CardTitle, CardContent } from '../../components/ui/Card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../../components/ui/Table';
import { Button } from '../../components/ui/Button';
import { Headphones, CheckCircle2, AlertCircle } from 'lucide-react';
import { Modal } from '../../components/ui/Modal';

export function CompanySupport() {
  const { tickets, updateTicketStatus } = useSupport();
  const [selectedTicket, setSelectedTicket] = useState<string | null>(null);

  const pendingTickets = tickets.filter(t => t.status !== 'resolved' && t.status !== 'closed');
  const resolvedTickets = tickets.filter(t => t.status === 'resolved' || t.status === 'closed');

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Support Center</h1>
          <p className="text-slate-500">Manage support requests from Distributors and Partners.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2 space-y-6">
          <Card>
            <CardHeader className="bg-slate-50 border-b border-slate-200">
              <CardTitle className="text-lg">Active Tickets ({pendingTickets.length})</CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Ticket ID</TableHead>
                    <TableHead>Sender</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead>Priority</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {pendingTickets.map(ticket => (
                    <TableRow key={ticket.id}>
                      <TableCell className="font-mono text-sm">{ticket.id}</TableCell>
                      <TableCell>
                        <div className="font-medium text-slate-900">{ticket.createdByName}</div>
                        <div className="text-xs text-slate-500 capitalize">{ticket.role}</div>
                      </TableCell>
                      <TableCell className="capitalize">{ticket.category.replace('_', ' ')}</TableCell>
                      <TableCell>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          ticket.priority === 'high' ? 'bg-red-100 text-red-800' : 
                          ticket.priority === 'medium' ? 'bg-yellow-100 text-yellow-800' : 
                          'bg-green-100 text-green-800'
                        }`}>
                          {ticket.priority}
                        </span>
                      </TableCell>
                      <TableCell>
                        <span className="capitalize text-slate-600">{ticket.status.replace('_', ' ')}</span>
                      </TableCell>
                      <TableCell className="text-right">
                        <Button variant="outline" size="sm" onClick={() => setSelectedTicket(ticket.id)}>View</Button>
                      </TableCell>
                    </TableRow>
                  ))}
                  {pendingTickets.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center py-8 text-slate-500">
                        No active support tickets.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Support Metrics</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center p-3 bg-red-50 rounded-md border border-red-100">
                <AlertCircle className="w-5 h-5 text-red-600 mr-3" />
                <div>
                  <p className="text-sm font-medium text-red-900">High Priority</p>
                  <p className="text-2xl font-bold text-red-700">{pendingTickets.filter(t => t.priority === 'high').length}</p>
                </div>
              </div>
              <div className="flex items-center p-3 bg-slate-50 rounded-md border border-slate-200">
                <Headphones className="w-5 h-5 text-indigo-600 mr-3" />
                <div>
                  <p className="text-sm font-medium text-slate-900">Open Tickets</p>
                  <p className="text-2xl font-bold text-slate-700">{pendingTickets.length}</p>
                </div>
              </div>
              <div className="flex items-center p-3 bg-emerald-50 rounded-md border border-emerald-100">
                <CheckCircle2 className="w-5 h-5 text-emerald-600 mr-3" />
                <div>
                  <p className="text-sm font-medium text-emerald-900">Resolved</p>
                  <p className="text-2xl font-bold text-emerald-700">{resolvedTickets.length}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      <Modal
        isOpen={!!selectedTicket}
        onClose={() => setSelectedTicket(null)}
        title={`Ticket ${selectedTicket}`}
        footer={
          <div className="flex justify-end gap-3 w-full">
            <Button variant="outline" onClick={() => setSelectedTicket(null)}>Close</Button>
            {selectedTicket && tickets.find(t => t.id === selectedTicket)?.status !== 'resolved' && (
              <Button 
                variant="primary" 
                className="bg-green-600 hover:bg-green-700" 
                onClick={() => {
                  updateTicketStatus(selectedTicket, 'resolved');
                  setSelectedTicket(null);
                }}
              >
                Mark as Resolved
              </Button>
            )}
          </div>
        }
      >
        {selectedTicket && (
          <div className="space-y-4">
            {(() => {
              const ticket = tickets.find(t => t.id === selectedTicket);
              if (!ticket) return null;
              return (
                <>
                  <div className="bg-slate-50 p-4 rounded-md border border-slate-200">
                    <h3 className="font-bold text-lg text-slate-900 mb-2">{ticket.subject}</h3>
                    <p className="text-slate-700 whitespace-pre-wrap">{ticket.description}</p>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-xs text-slate-500">Sender</p>
                      <p className="font-medium">{ticket.createdByName} ({ticket.role})</p>
                    </div>
                    <div>
                      <p className="text-xs text-slate-500">Created At</p>
                      <p className="font-medium">{new Date(ticket.createdAt).toLocaleString()}</p>
                    </div>
                  </div>
                </>
              );
            })()}
          </div>
        )}
      </Modal>
    </div>
  );
}
