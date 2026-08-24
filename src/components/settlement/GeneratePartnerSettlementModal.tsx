import React, { useState } from 'react';
import { useSettlement } from '../../mock/settlementContext';
import { useOrg } from '../../mock/orgContext';
import { useAuth } from '../../app/authContext';
import { Button } from '../ui/Button';
import { Select } from '../ui/Select';
import { Loader2 } from 'lucide-react';

interface GeneratePartnerSettlementModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
const YEARS = [2026, 2027];

export function GeneratePartnerSettlementModal({ isOpen, onClose }: GeneratePartnerSettlementModalProps) {
  const { user } = useAuth();
  const { generatePartnerSettlement } = useSettlement();
  const { partners } = useOrg();
  
  const [partnerId, setPartnerId] = useState('');
  const [month, setMonth] = useState(new Date().getMonth() + 1); // 1-indexed
  const [year, setYear] = useState(new Date().getFullYear());
  
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleGenerate = () => {
    if (!user) return;
    if (!partnerId) {
      setError("Please select a partner.");
      return;
    }
    
    setError(null);
    setIsLoading(true);

    try {
      generatePartnerSettlement(user.id, partnerId, month, year);
      setIsLoading(false);
      onClose();
    } catch (err: any) {
      setError(err.message || 'An error occurred while generating the settlement.');
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-md overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-200">
          <h2 className="text-lg font-bold text-slate-900">Generate Partner Settlement</h2>
        </div>
        
        <div className="p-6 space-y-4">
          {error && (
            <div className="p-3 bg-red-50 text-red-700 text-sm rounded-lg border border-red-200">
              {error}
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Select Partner</label>
            <Select 
              value={partnerId}
              onChange={(e) => setPartnerId(e.target.value)}
              options={[
                { label: 'Select a Partner...', value: '' },
                ...partners.map(p => ({ label: p.businessName, value: p.id }))
              ]}
              className="w-full"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Month</label>
              <Select 
                value={month.toString()}
                onChange={(e) => setMonth(parseInt(e.target.value))}
                options={MONTHS.map((m, i) => ({ label: m, value: (i + 1).toString() }))}
                className="w-full"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Year</label>
              <Select 
                value={year.toString()}
                onChange={(e) => setYear(parseInt(e.target.value))}
                options={YEARS.map(y => ({ label: y.toString(), value: y.toString() }))}
                className="w-full"
              />
            </div>
          </div>
          
          <div className="bg-slate-50 p-3 rounded-lg border border-slate-200 mt-4 text-xs text-slate-600">
            <p><strong>Note:</strong> Generating a Partner Settlement requires that a Company Settlement has already been generated and approved for the same period.</p>
          </div>
        </div>

        <div className="px-6 py-4 bg-slate-50 border-t border-slate-200 flex justify-end gap-3">
          <Button variant="outline" onClick={onClose} disabled={isLoading}>
            Cancel
          </Button>
          <Button onClick={handleGenerate} disabled={isLoading}>
            {isLoading ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : null}
            Generate Settlement
          </Button>
        </div>
      </div>
    </div>
  );
}
