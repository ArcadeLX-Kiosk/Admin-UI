import React, { useState } from 'react';
import { useSettlement } from '../../mock/settlementContext';
import { useAuth } from '../../app/authContext';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { Select } from '../ui/Select';
import { Loader2, CreditCard } from 'lucide-react';

interface PayPartnerModalProps {
  isOpen: boolean;
  onClose: () => void;
  settlementId: string;
}

export function PayPartnerModal({ isOpen, onClose, settlementId }: PayPartnerModalProps) {
  const { markPartnerSettlementPaid, partnerSettlements, partnerReceivables } = useSettlement();
  
  const [method, setMethod] = useState('bank_transfer');
  const [reference, setReference] = useState('UPI-' + Math.floor(Math.random() * 1000000000));
  
  const [isLoading, setIsLoading] = useState(false);

  if (!isOpen) return null;

  const settlement = partnerSettlements.find(s => s.id === settlementId);
  const receivable = partnerReceivables.find(r => r.settlementId === settlementId);

  if (!settlement || !receivable) return null;

  const handlePay = () => {
    if (!reference) return;
    
    setIsLoading(true);
    setTimeout(() => {
      markPartnerSettlementPaid(settlementId, method, reference);
      setIsLoading(false);
      onClose();
    }, 800); // Simulate network
  };

  return (
    <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-md overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-200 flex items-center gap-2">
          <CreditCard className="w-5 h-5 text-indigo-600" />
          <h2 className="text-lg font-bold text-slate-900">Pay Partner Settlement</h2>
        </div>
        
        <div className="p-6 space-y-4">
          <div className="bg-indigo-50 p-4 rounded-lg border border-indigo-100 mb-2">
            <p className="text-sm text-indigo-900 font-medium mb-1">Payment Amount</p>
            <p className="text-3xl font-bold text-indigo-700">₹{receivable.amount.toLocaleString()}</p>
            <p className="text-xs text-indigo-600 mt-1">For {settlement.partnerName}</p>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Payment Method</label>
            <Select 
              value={method}
              onChange={(e) => setMethod(e.target.value)}
              options={[
                { label: 'Bank Transfer (NEFT/RTGS)', value: 'bank_transfer' },
                { label: 'UPI', value: 'upi' },
                { label: 'Cheque', value: 'cheque' },
              ]}
              className="w-full"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Transaction Reference</label>
            <Input 
              value={reference}
              onChange={(e) => setReference(e.target.value)}
              placeholder="e.g. UTR Number"
            />
          </div>
        </div>

        <div className="px-6 py-4 bg-slate-50 border-t border-slate-200 flex justify-end gap-3">
          <Button variant="outline" onClick={onClose} disabled={isLoading}>
            Cancel
          </Button>
          <Button onClick={handlePay} disabled={isLoading || !reference}>
            {isLoading ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : null}
            Confirm Payment
          </Button>
        </div>
      </div>
    </div>
  );
}
