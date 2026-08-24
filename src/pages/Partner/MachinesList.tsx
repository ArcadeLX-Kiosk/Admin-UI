import React, { useState } from 'react';
import { Search } from 'lucide-react';
import { useMachine } from '../../mock/machineContext';
import { useAuth } from '../../app/authContext';
import { Input } from '../../components/ui/Input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../../components/ui/Table';
import { MachineStatusBadge } from '../../components/ui/StatusBadges';
import { StatCard } from '../../components/dashboard/StatCard';
import { MonitorSmartphone, Wrench, CheckCircle2 } from 'lucide-react';

export function PartnerMachines() {
  const { user } = useAuth();
  const { machines } = useMachine();
  const [search, setSearch] = useState('');

  // FILTER: Only show machines assigned to this partner
  const myMachines = machines.filter(m => m.partnerId === user?.id);

  const active = myMachines.filter(m => m.status === 'active' || m.status === 'installed').length;
  const maintenance = myMachines.filter(m => m.status === 'maintenance').length;

  const filteredMachines = myMachines.filter(m => 
    m.machineCode.toLowerCase().includes(search.toLowerCase()) || 
    m.serialNumber.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Deployed Machines</h1>
        <p className="text-sm text-slate-500">View machines currently deployed at your locations.</p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        <StatCard title="Total Deployed" value={myMachines.length} icon={MonitorSmartphone} />
        <StatCard title="Active / Installed" value={active} icon={CheckCircle2} />
        <StatCard title="In Maintenance" value={maintenance} icon={Wrench} />
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-slate-200">
        <div className="p-4 border-b border-slate-200">
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <Input 
              placeholder="Search by Code or Serial..." 
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9"
            />
          </div>
        </div>

        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Machine Code</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Location</TableHead>
              <TableHead>Firmware</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredMachines.length === 0 ? (
              <TableRow>
                <TableCell colSpan={4} className="text-center h-32 text-slate-500">
                  No machines found.
                </TableCell>
              </TableRow>
            ) : (
              filteredMachines.map(machine => (
                <TableRow key={machine.id}>
                  <TableCell>
                    <div className="font-semibold text-slate-900 font-mono">{machine.machineCode}</div>
                    <div className="text-xs text-slate-500">{machine.serialNumber}</div>
                  </TableCell>
                  <TableCell>
                    <MachineStatusBadge status={machine.status} />
                  </TableCell>
                  <TableCell className="text-sm">{machine.location}</TableCell>
                  <TableCell className="text-sm font-mono">{machine.firmwareVersion}</TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
