import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Search, Eye, Filter } from 'lucide-react';
import { useMachine } from '../../mock/machineContext';
import { useOrg } from '../../mock/orgContext';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Select } from '../../components/ui/Select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../../components/ui/Table';
import { MachineStatusBadge } from '../../components/ui/StatusBadges';
import { MachineStatus } from '../../types/machine';

export function MachinesList() {
  const { machines } = useMachine();
  const { distributors, partners } = useOrg();
  const navigate = useNavigate();
  
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [distributorFilter, setDistributorFilter] = useState('all');
  const [partnerFilter, setPartnerFilter] = useState('all');

  const filteredMachines = machines.filter(m => {
    const matchesSearch = 
      m.machineCode.toLowerCase().includes(search.toLowerCase()) || 
      m.serialNumber.toLowerCase().includes(search.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || m.status === statusFilter;
    const matchesDistributor = distributorFilter === 'all' || m.distributorId === distributorFilter;
    const matchesPartner = partnerFilter === 'all' || m.partnerId === partnerFilter;
    
    return matchesSearch && matchesStatus && matchesDistributor && matchesPartner;
  });

  const getDistributorName = (id: string | null) => {
    if (!id) return '-';
    return distributors.find(d => d.id === id)?.businessName || id;
  };
  
  const getPartnerName = (id: string | null) => {
    if (!id) return '-';
    return partners.find(p => p.id === id)?.businessName || id;
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Machines</h1>
          <p className="text-sm text-slate-500">Manage and monitor every kiosk in the company's fleet.</p>
        </div>
        <Button onClick={() => navigate('/company/machines/new')}>
          <Plus className="mr-2 h-4 w-4" /> Add Machine
        </Button>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-slate-200">
        <div className="p-4 border-b border-slate-200 flex flex-col md:flex-row gap-4">
          <div className="relative flex-1 min-w-[200px]">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <Input 
              placeholder="Search by Code or Serial..." 
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9"
            />
          </div>
          
          <div className="flex gap-2 overflow-x-auto pb-1 md:pb-0">
            <Select 
              className="w-40 flex-shrink-0"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              options={[
                { label: 'All Statuses', value: 'all' },
                { label: 'Available', value: 'available' },
                { label: 'Assigned (Dist)', value: 'assigned_to_distributor' },
                { label: 'Assigned (Part)', value: 'assigned_to_partner' },
                { label: 'Active', value: 'active' },
                { label: 'Maintenance', value: 'maintenance' },
              ]}
            />
            
            <Select 
              className="w-48 flex-shrink-0"
              value={distributorFilter}
              onChange={(e) => setDistributorFilter(e.target.value)}
              options={[
                { label: 'All Distributors', value: 'all' },
                ...distributors.map(d => ({ label: d.businessName, value: d.id }))
              ]}
            />

            <Select 
              className="w-48 flex-shrink-0"
              value={partnerFilter}
              onChange={(e) => setPartnerFilter(e.target.value)}
              options={[
                { label: 'All Partners', value: 'all' },
                ...partners.map(p => ({ label: p.businessName, value: p.id }))
              ]}
            />
          </div>
        </div>

        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Machine Code</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Assigned To</TableHead>
              <TableHead>Location</TableHead>
              <TableHead>Model / FW</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredMachines.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center h-32 text-slate-500">
                  No machines found.
                </TableCell>
              </TableRow>
            ) : (
              filteredMachines.map(machine => (
                <TableRow key={machine.id}>
                  <TableCell>
                    <div className="font-semibold text-slate-900">{machine.machineCode}</div>
                    <div className="text-xs text-slate-500">{machine.serialNumber}</div>
                  </TableCell>
                  <TableCell>
                    <MachineStatusBadge status={machine.status} />
                  </TableCell>
                  <TableCell>
                    <div className="text-sm font-medium text-slate-700 max-w-[200px] truncate">
                      {machine.distributorId ? getDistributorName(machine.distributorId) : 'Unassigned'}
                    </div>
                    {machine.partnerId && (
                      <div className="text-xs text-slate-500 truncate max-w-[200px]">
                        ↳ {getPartnerName(machine.partnerId)}
                      </div>
                    )}
                  </TableCell>
                  <TableCell className="text-sm">{machine.location}</TableCell>
                  <TableCell>
                    <div className="text-sm">{machine.model}</div>
                    <div className="text-xs text-slate-500">{machine.firmwareVersion}</div>
                  </TableCell>
                  <TableCell className="text-right">
                    <Button 
                      variant="ghost" 
                      size="sm"
                      onClick={() => navigate(`/company/machines/${machine.id}`)}
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
