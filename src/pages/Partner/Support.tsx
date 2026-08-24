import React, { useState } from 'react';
import { useAuth } from '../../app/authContext';
import { useSupport } from '../../mock/supportContext';
import { Card, CardHeader, CardTitle, CardContent } from '../../components/ui/Card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../../components/ui/Table';
import { Button } from '../../components/ui/Button';
import { Modal } from '../../components/ui/Modal';
import { Select } from '../../components/ui/Select';
import { MessageSquare, Plus } from 'lucide-react';

export function PartnerSupport() {
  const { user } = useAuth();
  const { tickets, createTicket } = useSupport();
  const [isNewModalOpen, setIsNewModalOpen] = useState(false);
  const [subject, setSubject] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState<'machine' | 'settlement' | 'other'>('other');
  const [priority, setPriority] = useState<'low' | 'medium' | 'high'>('medium');

  const myTickets = tickets.filter(t => t.createdBy === user?.id);

  const handleSubmit = () => {
    if (user) {
      createTicket({
        createdBy: user.id,
        createdByName: user.name,
        role: 'partner',
        recipientId: 'distributor', // Escalate to their distributor
        subject,
        description,
        category,
        priority
      });
      setIsNewModalOpen(false);
      setSubject('');
      setDescription('');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Support</h1>
          <p className="text-slate-500">Contact your distributor for assistance.</p>
        </div>
        <Button variant="primary" onClick={() => setIsNewModalOpen(true)}>
          <Plus className="w-4 h-4 mr-2" /> New Ticket
        </Button>
      </div>

      <Card>
        <CardHeader className="bg-slate-50 border-b border-slate-200">
          <CardTitle className="text-lg flex items-center gap-2">
            <MessageSquare className="w-5 h-5 text-indigo-600" />
            My Tickets
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Ticket ID</TableHead>
                <TableHead>Subject</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Date</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {myTickets.map(ticket => (
                <TableRow key={ticket.id}>
                  <TableCell className="font-mono text-sm">{ticket.id}</TableCell>
                  <TableCell className="font-medium text-slate-900">{ticket.subject}</TableCell>
                  <TableCell className="capitalize">{ticket.category.replace('_', ' ')}</TableCell>
                  <TableCell>
                    <span className="capitalize">{ticket.status}</span>
                  </TableCell>
                  <TableCell className="text-slate-500 text-sm">
                    {new Date(ticket.createdAt).toLocaleDateString()}
                  </TableCell>
                </TableRow>
              ))}
              {myTickets.length === 0 && (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-8 text-slate-500">
                    No support tickets found.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Modal
        isOpen={isNewModalOpen}
        onClose={() => setIsNewModalOpen(false)}
        title="Submit Support Request"
        footer={
          <div className="flex justify-end gap-3 w-full">
            <Button variant="outline" onClick={() => setIsNewModalOpen(false)}>Cancel</Button>
            <Button variant="primary" onClick={handleSubmit} disabled={!subject || !description}>Submit</Button>
          </div>
        }
      >
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Subject</label>
            <input 
              type="text" 
              className="w-full rounded-md border-slate-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm px-3 py-2 border" 
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <Select
              label="Category"
              value={category}
              onChange={(e) => setCategory(e.target.value as any)}
              options={[
                { label: 'General Inquiry', value: 'other' },
                { label: 'Machine Issue', value: 'machine' },
                { label: 'Settlement Issue', value: 'settlement' }
              ]}
            />
            <Select
              label="Priority"
              value={priority}
              onChange={(e) => setPriority(e.target.value as any)}
              options={[
                { label: 'Low', value: 'low' },
                { label: 'Medium', value: 'medium' },
                { label: 'High', value: 'high' }
              ]}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Description</label>
            <textarea 
              rows={4}
              className="w-full rounded-md border-slate-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm px-3 py-2 border" 
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>
        </div>
      </Modal>
    </div>
  );
}
