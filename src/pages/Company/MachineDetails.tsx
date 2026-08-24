import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, MonitorSmartphone, Calendar, ShieldCheck, MapPin, Activity, Settings, Cpu, Server, CheckCircle2, Play } from 'lucide-react';
import { useMachine } from '../../mock/machineContext';
import { useOrg } from '../../mock/orgContext';
import { useRevenue } from '../../mock/revenueContext';
import { Button } from '../../components/ui/Button';
import { Card, CardHeader, CardTitle, CardContent } from '../../components/ui/Card';
import { MachineStatusBadge } from '../../components/ui/StatusBadges';
import { Modal } from '../../components/ui/Modal';
import { Select } from '../../components/ui/Select';
import { SimulatePlayModal } from '../../components/revenue/SimulatePlayModal';

export function MachineDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { machines, assignments, timelines, assignMachine, updateMachineStatus } = useMachine();
  const { distributors, partners } = useOrg();
  const { transactions, getMachineAggregation } = useRevenue();
  
  const machine = machines.find(m => m.id === id);
  const history = assignments.filter(a => a.machineId === id).sort((a, b) => new Date(b.assignedAt).getTime() - new Date(a.assignedAt).getTime());
  const timeline = timelines.filter(t => t.machineId === id).sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());

  const [isAssignModalOpen, setIsAssignModalOpen] = useState(false);
  const [selectedDistributor, setSelectedDistributor] = useState('');
  const [selectedPartner, setSelectedPartner] = useState('');
  const [isSimulateModalOpen, setIsSimulateModalOpen] = useState(false);

  if (!machine) {
    return <div className="p-8 text-center text-slate-500">Machine not found.</div>;
  }

  const agg = getMachineAggregation(machine.machineCode);
  const recentTransactions = transactions.filter(t => t.machineId === machine.id).slice(0, 5);

  const getDistributorName = (dId: string) => distributors.find(d => d.id === dId)?.businessName || dId;
  const getPartnerName = (pId: string) => partners.find(p => p.id === pId)?.businessName || pId;

  const handleAssignSubmit = () => {
    if (!selectedDistributor) return;
    assignMachine(machine.id, selectedDistributor, selectedPartner || undefined);
    setIsAssignModalOpen(false);
  };

  const handleStatusChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const confirmChange = window.confirm(`Change status to ${e.target.value}?`);
    if (confirmChange) {
      updateMachineStatus(machine.id, e.target.value as any);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="sm" onClick={() => navigate('/company/machines')}>
            <ArrowLeft className="h-4 w-4 mr-2" /> Back
          </Button>
          <div>
            <h1 className="text-2xl font-bold font-mono text-slate-900">{machine.machineCode}</h1>
            <div className="flex items-center gap-3 mt-1 text-sm text-slate-500">
              <span className="flex items-center"><MonitorSmartphone className="h-4 w-4 mr-1" /> {machine.model}</span>
              <MachineStatusBadge status={machine.status} />
            </div>
          </div>
        </div>
        <div className="flex gap-2">
          {machine.status !== 'retired' && (
            <Button onClick={() => setIsAssignModalOpen(true)}>Assign Machine</Button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        
        {/* Left Column: Specs & Assignment */}
        <div className="space-y-6 xl:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Asset Overview</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-y-6 gap-x-4">
                <div className="flex gap-3">
                  <div className="p-2 bg-slate-100 rounded-lg h-min"><Settings className="h-5 w-5 text-slate-600" /></div>
                  <div>
                    <p className="text-xs text-slate-500">Serial Number</p>
                    <p className="font-semibold text-slate-900">{machine.serialNumber}</p>
                  </div>
                </div>
                <div className="flex gap-3">
                  <div className="p-2 bg-slate-100 rounded-lg h-min"><Cpu className="h-5 w-5 text-slate-600" /></div>
                  <div>
                    <p className="text-xs text-slate-500">Hardware Fingerprint</p>
                    <p className="font-semibold font-mono text-slate-900">{machine.hardwareFingerprint}</p>
                  </div>
                </div>
                <div className="flex gap-3">
                  <div className="p-2 bg-slate-100 rounded-lg h-min"><Calendar className="h-5 w-5 text-slate-600" /></div>
                  <div>
                    <p className="text-xs text-slate-500">Manufacture Date</p>
                    <p className="font-medium text-slate-900">{new Date(machine.manufactureDate).toLocaleDateString()}</p>
                  </div>
                </div>
                <div className="flex gap-3">
                  <div className="p-2 bg-slate-100 rounded-lg h-min"><ShieldCheck className="h-5 w-5 text-slate-600" /></div>
                  <div>
                    <p className="text-xs text-slate-500">Warranty Expiry</p>
                    <p className="font-medium text-slate-900">{new Date(machine.warrantyExpiry).toLocaleDateString()}</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle>Current Assignment</CardTitle>
            </CardHeader>
            <CardContent>
              {machine.distributorId ? (
                <div className="bg-indigo-50 border border-indigo-100 rounded-lg p-5">
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="text-sm font-medium text-indigo-900 mb-1">Assigned to Distributor</p>
                      <p className="text-lg font-bold text-indigo-700">{getDistributorName(machine.distributorId)}</p>
                      
                      {machine.partnerId && (
                        <div className="mt-4 pl-4 border-l-2 border-indigo-200">
                          <p className="text-xs font-medium text-indigo-800/70 mb-1">Deployed to Partner</p>
                          <p className="text-base font-semibold text-indigo-700">{getPartnerName(machine.partnerId)}</p>
                        </div>
                      )}
                    </div>
                    <div className="text-right">
                      <p className="text-xs text-indigo-800/60 mb-1">Base Location</p>
                      <p className="text-sm font-medium text-indigo-900 flex items-center justify-end"><MapPin className="h-3 w-3 mr-1" /> {machine.location}</p>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="text-center py-8 bg-slate-50 rounded-lg border border-dashed border-slate-300">
                  <p className="text-slate-500 font-medium">Unassigned</p>
                  <p className="text-sm text-slate-400 mt-1">Machine is currently in Company Inventory.</p>
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Assignment History</CardTitle>
            </CardHeader>
            <CardContent>
              {history.length === 0 ? (
                <p className="text-sm text-slate-500">No assignment history.</p>
              ) : (
                <div className="space-y-4">
                  {history.map(record => (
                    <div key={record.id} className="flex justify-between items-center p-3 border border-slate-100 rounded-lg">
                      <div>
                        <p className="text-sm font-medium text-slate-900">
                          {record.distributorId ? getDistributorName(record.distributorId) : 'Company Inventory'}
                        </p>
                        {record.partnerId && (
                          <p className="text-xs text-slate-500">↳ {getPartnerName(record.partnerId)}</p>
                        )}
                      </div>
                      <div className="text-right">
                        <p className="text-xs text-slate-500">
                          {new Date(record.assignedAt).toLocaleDateString()}
                          {record.returnedAt ? ` - ${new Date(record.returnedAt).toLocaleDateString()}` : ' - Present'}
                        </p>
                        <p className="text-xs mt-1">
                          {record.status === 'active' ? (
                            <span className="text-green-600 font-medium">Active</span>
                          ) : (
                            <span className="text-slate-400">Completed</span>
                          )}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Revenue Aggregation</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                <div className="p-4 bg-slate-50 rounded-lg border border-slate-100">
                  <p className="text-xs text-slate-500 mb-1">Total Revenue</p>
                  <p className="text-lg font-bold text-slate-900">₹{agg.totalRevenue.toLocaleString()}</p>
                </div>
                <div className="p-4 bg-slate-50 rounded-lg border border-slate-100">
                  <p className="text-xs text-slate-500 mb-1">This Month</p>
                  <p className="text-lg font-bold text-indigo-600">₹{agg.thisMonthRevenue.toLocaleString()}</p>
                </div>
                <div className="p-4 bg-slate-50 rounded-lg border border-slate-100">
                  <p className="text-xs text-slate-500 mb-1">Today</p>
                  <p className="text-lg font-bold text-green-600">₹{agg.todayRevenue.toLocaleString()}</p>
                </div>
                <div className="p-4 bg-slate-50 rounded-lg border border-slate-100">
                  <p className="text-xs text-slate-500 mb-1">Total Plays</p>
                  <p className="text-lg font-bold text-slate-900">{agg.transactionCount}</p>
                </div>
              </div>

              {recentTransactions.length > 0 && (
                <div>
                  <h4 className="text-sm font-semibold text-slate-900 mb-3">Recent Transactions</h4>
                  <div className="space-y-3">
                    {recentTransactions.map(tx => (
                      <div key={tx.id} className="flex items-center justify-between p-3 bg-slate-50 border border-slate-100 rounded-md">
                        <div>
                          <p className="text-sm font-medium text-slate-900">{tx.gameName}</p>
                          <p className="text-xs text-slate-500">{new Date(tx.transactionDate).toLocaleString()}</p>
                        </div>
                        <div className="text-right">
                          <p className={`text-sm font-bold ${tx.paymentStatus === 'successful' ? 'text-green-600' : 'text-red-500 line-through'}`}>₹{tx.amount}</p>
                          <p className="text-xs text-slate-400 font-mono">{tx.transactionReference}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Right Column: Telemetry & Actions */}
        <div className="space-y-6">
          
          <Card>
            <CardHeader>
              <CardTitle>Manual Actions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <Select 
                  label="Override Status"
                  value={machine.status}
                  onChange={handleStatusChange}
                  options={[
                    { label: 'Available', value: 'available' },
                    { label: 'Reserved', value: 'reserved' },
                    { label: 'Maintenance', value: 'maintenance' },
                    { label: 'Returned', value: 'returned' },
                    { label: 'Retired', value: 'retired' },
                    { label: 'Active', value: 'active' },
                  ]}
                />
                {machine.status === 'maintenance' && (
                  <Button variant="outline" className="w-full justify-start text-green-600 border-green-200 hover:bg-green-50" onClick={() => updateMachineStatus(machine.id, 'active')}>
                    <CheckCircle2 className="mr-2 h-4 w-4" /> Return to Active
                  </Button>
                )}
                {['active', 'installed'].includes(machine.status) && (
                  <Button variant="primary" className="w-full justify-start bg-green-600 hover:bg-green-700 text-white" onClick={() => setIsSimulateModalOpen(true)}>
                    <Play className="mr-2 h-4 w-4" /> Simulate Play
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="bg-slate-900 text-white rounded-t-xl">
              <CardTitle className="flex items-center text-slate-50"><Server className="h-4 w-4 mr-2" /> Telemetry (Mock)</CardTitle>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-slate-500">Network Status</span>
                  <span className={`text-sm font-semibold flex items-center ${machine.isOnline ? 'text-green-600' : 'text-slate-400'}`}>
                    {machine.isOnline ? <><Activity className="h-3 w-3 mr-1" /> Online</> : 'Offline'}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-slate-500">Last Seen</span>
                  <span className="text-sm font-medium text-slate-900">{machine.lastSeen ? new Date(machine.lastSeen).toLocaleString() : 'Never'}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-slate-500">IP Address</span>
                  <span className="text-sm font-mono text-slate-900">{machine.ipAddress || 'Unknown'}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-slate-500">Firmware</span>
                  <span className="text-sm font-mono text-slate-900">{machine.firmwareVersion}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Timeline</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="relative border-l border-slate-200 ml-3 space-y-6">
                {timeline.map((event) => (
                  <div key={event.id} className="relative pl-6">
                    <div className="absolute -left-1.5 top-1.5 w-3 h-3 bg-white border-2 border-indigo-500 rounded-full" />
                    <div>
                      <p className="text-sm font-medium text-slate-900">{event.event}</p>
                      <p className="text-xs text-slate-500">{new Date(event.timestamp).toLocaleString()} • {event.actor}</p>
                      {event.note && <p className="text-xs mt-1 text-slate-600 bg-slate-50 p-2 rounded">{event.note}</p>}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

        </div>
      </div>

      <Modal
        isOpen={isAssignModalOpen}
        onClose={() => setIsAssignModalOpen(false)}
        title="Assign Machine"
        footer={
          <>
            <Button variant="outline" onClick={() => setIsAssignModalOpen(false)}>Cancel</Button>
            <Button onClick={handleAssignSubmit} disabled={!selectedDistributor}>Confirm Assignment</Button>
          </>
        }
      >
        <div className="space-y-6">
          <div className="bg-slate-50 p-4 rounded-md border border-slate-200 flex items-center justify-between">
            <span className="font-medium text-slate-700">Machine</span>
            <span className="font-bold font-mono">{machine.machineCode}</span>
          </div>

          <Select 
            required
            label="Assign to Distributor" 
            value={selectedDistributor} 
            onChange={(e) => {
              setSelectedDistributor(e.target.value);
              setSelectedPartner('');
            }}
            options={[
              { label: '-- Select Distributor --', value: '' },
              ...distributors.filter(d => d.status === 'active').map(d => ({ label: d.businessName, value: d.id }))
            ]}
          />

          <Select 
            label="Assign to Partner (Optional)" 
            value={selectedPartner} 
            onChange={(e) => setSelectedPartner(e.target.value)}
            disabled={!selectedDistributor}
            options={[
              { label: '-- None (Keep with Distributor) --', value: '' },
              ...partners
                .filter(p => p.status === 'active' && p.distributorId === selectedDistributor)
                .map(p => ({ label: p.businessName, value: p.id }))
            ]}
          />
          
          <p className="text-xs text-slate-500">
            Note: Assigning this machine will complete any existing active assignments and update the machine's status.
          </p>
        </div>
      </Modal>

      <SimulatePlayModal
        isOpen={isSimulateModalOpen}
        onClose={() => setIsSimulateModalOpen(false)}
        preselectedMachineId={machine.id}
      />

    </div>
  );
}

