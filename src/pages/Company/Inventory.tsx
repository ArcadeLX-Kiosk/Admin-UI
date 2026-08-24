import React from 'react';
import { useMachine } from '../../mock/machineContext';
import { StatCard } from '../../components/dashboard/StatCard';
import { MonitorSmartphone, Package, PackageCheck, AlertCircle, Wrench, RefreshCw, Archive } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '../../components/ui/Card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../../components/ui/Table';
import { MachineStatusBadge } from '../../components/ui/StatusBadges';
import { useOrg } from '../../mock/orgContext';

export function InventoryDashboard() {
  const { machines } = useMachine();
  const { distributors } = useOrg();

  const total = machines.length;
  const available = machines.filter(m => m.status === 'available').length;
  const reserved = machines.filter(m => m.status === 'reserved').length;
  const assigned = machines.filter(m => m.status.includes('assigned') || m.status === 'active' || m.status === 'dispatched' || m.status === 'installed').length;
  const maintenance = machines.filter(m => m.status === 'maintenance').length;
  const returned = machines.filter(m => m.status === 'returned').length;
  const retired = machines.filter(m => m.status === 'retired').length;

  const companyInventory = machines.filter(m => !m.distributorId && m.status !== 'retired');
  
  // Aggregate distributor assignment counts
  const distributorInventory = distributors.map(d => {
    const distMachines = machines.filter(m => m.distributorId === d.id);
    const assignedToPartner = distMachines.filter(m => m.partnerId !== null).length;
    return {
      distributor: d,
      total: distMachines.length,
      assignedToPartner,
      retained: distMachines.length - assignedToPartner,
    };
  }).filter(d => d.total > 0);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Inventory Management</h1>
        <p className="text-sm text-slate-500">Overview of all physical machine assets across the network.</p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4">
        <StatCard title="Total" value={total} icon={MonitorSmartphone} />
        <StatCard title="Available" value={available} icon={PackageCheck} />
        <StatCard title="Reserved" value={reserved} icon={Package} />
        <StatCard title="Assigned/Active" value={assigned} icon={AlertCircle} />
        <StatCard title="Maintenance" value={maintenance} icon={Wrench} />
        <StatCard title="Returned" value={returned} icon={RefreshCw} />
        <StatCard title="Retired" value={retired} icon={Archive} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Company Inventory (Unassigned)</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Machine Code</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Location</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {companyInventory.slice(0, 5).map(m => (
                  <TableRow key={m.id}>
                    <TableCell className="font-mono text-xs">{m.machineCode}</TableCell>
                    <TableCell><MachineStatusBadge status={m.status} /></TableCell>
                    <TableCell className="text-sm">{m.location}</TableCell>
                  </TableRow>
                ))}
                {companyInventory.length > 5 && (
                  <TableRow>
                    <TableCell colSpan={3} className="text-center text-xs text-slate-500 py-2">
                      + {companyInventory.length - 5} more machines
                    </TableCell>
                  </TableRow>
                )}
                {companyInventory.length === 0 && (
                  <TableRow><TableCell colSpan={3} className="text-center text-slate-500">No unassigned machines.</TableCell></TableRow>
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Distributor Deployments</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Distributor</TableHead>
                  <TableHead className="text-right">Total Held</TableHead>
                  <TableHead className="text-right">Deployed to Partner</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {distributorInventory.map(di => (
                  <TableRow key={di.distributor.id}>
                    <TableCell className="font-medium text-sm">{di.distributor.businessName}</TableCell>
                    <TableCell className="text-right text-sm">{di.total}</TableCell>
                    <TableCell className="text-right text-sm text-slate-500">{di.assignedToPartner}</TableCell>
                  </TableRow>
                ))}
                {distributorInventory.length === 0 && (
                  <TableRow><TableCell colSpan={3} className="text-center text-slate-500">No active deployments.</TableCell></TableRow>
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
