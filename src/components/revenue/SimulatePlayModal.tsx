import React, { useState } from 'react';
import { useRevenue } from '../../mock/revenueContext';
import { useMachine } from '../../mock/machineContext';
import { Modal } from '../ui/Modal';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { Select } from '../ui/Select';
import { Play } from 'lucide-react';

interface SimulatePlayModalProps {
  isOpen: boolean;
  onClose: () => void;
  preselectedMachineId?: string;
}

export function SimulatePlayModal({ isOpen, onClose, preselectedMachineId }: SimulatePlayModalProps) {
  const { simulatePlay } = useRevenue();
  const { machines } = useMachine();
  
  const [machineId, setMachineId] = useState(preselectedMachineId || '');
  const [gameName, setGameName] = useState('Space Adventure');
  const [amount, setAmount] = useState('100');
  const [duration, setDuration] = useState('10');

  // For demo: Only allow simulating on active/installed machines
  const activeMachines = machines.filter(m => ['active', 'installed'].includes(m.status));

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const machine = machines.find(m => m.id === machineId);
    if (!machine) return;

    simulatePlay(machineId, machine.machineCode, gameName, Number(amount), Number(duration));
    
    // Reset form mostly, keep machine if preselected
    if (!preselectedMachineId) setMachineId('');
    
    // Simulate some toast visually by just closing for now
    onClose();
    // In a real app we would use a toast context here
    alert(`Successfully simulated play on ${machine.machineCode} for ₹${amount}!`);
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Simulate Gameplay Revenue"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <p className="text-sm text-slate-500 mb-4">
          This is a DEMO ONLY utility. It instantly creates a successful transaction, attributing gross revenue to the selected machine.
        </p>
        
        <Select 
          label="Machine"
          required
          value={machineId}
          onChange={(e) => setMachineId(e.target.value)}
          disabled={!!preselectedMachineId}
          options={[
            { label: '-- Select Machine --', value: '' },
            ...activeMachines.map(m => ({ label: `${m.machineCode} (${m.serialNumber})`, value: m.id }))
          ]}
        />
        
        <Select 
          label="Game / Software"
          required
          value={gameName}
          onChange={(e) => setGameName(e.target.value)}
          options={[
            { label: 'Space Adventure', value: 'Space Adventure' },
            { label: 'Racing Pro', value: 'Racing Pro' },
            { label: 'Puzzle Master', value: 'Puzzle Master' },
            { label: 'Action Hero', value: 'Action Hero' },
          ]}
        />
        
        <div className="grid grid-cols-2 gap-4">
          <Input 
            label="Amount (₹)"
            type="number"
            required
            min="10"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
          />
          <Input 
            label="Duration (Minutes)"
            type="number"
            required
            min="1"
            value={duration}
            onChange={(e) => setDuration(e.target.value)}
          />
        </div>
        
        <div className="pt-4 flex justify-end gap-3">
          <Button type="button" variant="outline" onClick={onClose}>Cancel</Button>
          <Button type="submit" variant="primary" className="bg-green-600 hover:bg-green-700"><Play className="h-4 w-4 mr-2" /> Simulate Play</Button>
        </div>
      </form>
    </Modal>
  );
}
