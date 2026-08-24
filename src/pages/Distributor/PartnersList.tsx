import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Search, Eye } from 'lucide-react';
import { useOrg } from '../../mock/orgContext';
import { useAuth } from '../../app/authContext';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Select } from '../../components/ui/Select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../../components/ui/Table';
import { OrgStatusBadge } from '../../components/ui/StatusBadges';

export function PartnersList() {
  const { partners } = useOrg();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  // ONLY SHOW PARTNERS BELONGING TO THIS DISTRIBUTOR
  const myPartners = partners.filter(p => p.distributorId === user?.id);

  const filteredPartners = myPartners.filter(part => {
    const matchesSearch = 
      part.businessName.toLowerCase().includes(search.toLowerCase()) || 
      part.contactPerson.toLowerCase().includes(search.toLowerCase()) ||
      part.email.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = statusFilter === 'all' || part.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Partners</h1>
          <p className="text-sm text-slate-500">Manage your partner network.</p>
        </div>
        <Button onClick={() => navigate('/distributor/partners/new')}>
          <Plus className="mr-2 h-4 w-4" /> Add Partner
        </Button>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-slate-200">
        <div className="p-4 border-b border-slate-200 flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <Input 
              placeholder="Search partners..." 
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9"
            />
          </div>
          <Select 
            className="w-48"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            options={[
              { label: 'All Status', value: 'all' },
              { label: 'Active', value: 'active' },
              { label: 'Inactive', value: 'inactive' },
            ]}
          />
        </div>

        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Partner</TableHead>
              <TableHead>Contact</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Machines</TableHead>
              <TableHead className="text-right">Monthly Revenue</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredPartners.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center h-32 text-slate-500">
                  No partners found.
                </TableCell>
              </TableRow>
            ) : (
              filteredPartners.map(part => (
                <TableRow key={part.id}>
                  <TableCell className="font-medium text-slate-900">{part.businessName}</TableCell>
                  <TableCell>
                    <div className="text-sm">{part.contactPerson}</div>
                    <div className="text-xs text-slate-500">{part.email}</div>
                  </TableCell>
                  <TableCell>
                    <OrgStatusBadge status={part.status} />
                  </TableCell>
                  <TableCell className="text-right">{part.totalMachines}</TableCell>
                  <TableCell className="text-right">₹{part.monthlyRevenue.toLocaleString('en-IN')}</TableCell>
                  <TableCell className="text-right">
                    <Button 
                      variant="ghost" 
                      size="sm"
                      onClick={() => navigate(`/distributor/partners/${part.id}`)}
                    >
                      <Eye className="h-4 w-4 mr-2" /> View
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
