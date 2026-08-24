import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Search, Eye } from 'lucide-react';
import { useOrg } from '../../mock/orgContext';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Select } from '../../components/ui/Select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../../components/ui/Table';
import { OrgStatusBadge } from '../../components/ui/StatusBadges';

export function DistributorsList() {
  const { distributors } = useOrg();
  const navigate = useNavigate();
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  const filteredDistributors = distributors.filter(dist => {
    const matchesSearch = 
      dist.businessName.toLowerCase().includes(search.toLowerCase()) || 
      dist.contactPerson.toLowerCase().includes(search.toLowerCase()) ||
      dist.email.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = statusFilter === 'all' || dist.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Distributors</h1>
          <p className="text-sm text-slate-500">Manage your company's distributor network.</p>
        </div>
        <Button onClick={() => navigate('/company/distributors/new')}>
          <Plus className="mr-2 h-4 w-4" /> Add Distributor
        </Button>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-slate-200">
        <div className="p-4 border-b border-slate-200 flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <Input 
              placeholder="Search distributors..." 
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
              <TableHead>Distributor</TableHead>
              <TableHead>Contact</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Machines</TableHead>
              <TableHead className="text-right">Monthly Revenue</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredDistributors.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center h-32 text-slate-500">
                  No distributors found.
                </TableCell>
              </TableRow>
            ) : (
              filteredDistributors.map(dist => (
                <TableRow key={dist.id}>
                  <TableCell className="font-medium text-slate-900">{dist.businessName}</TableCell>
                  <TableCell>
                    <div className="text-sm">{dist.contactPerson}</div>
                    <div className="text-xs text-slate-500">{dist.email}</div>
                  </TableCell>
                  <TableCell>
                    <OrgStatusBadge status={dist.status} />
                  </TableCell>
                  <TableCell className="text-right">{dist.totalMachines}</TableCell>
                  <TableCell className="text-right">₹{dist.monthlyRevenue.toLocaleString('en-IN')}</TableCell>
                  <TableCell className="text-right">
                    <Button 
                      variant="ghost" 
                      size="sm"
                      onClick={() => navigate(`/company/distributors/${dist.id}`)}
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
