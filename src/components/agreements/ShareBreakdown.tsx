import React from 'react';

interface ShareBreakdownProps {
  party1Name: string;
  party1Share: number;
  party2Name: string;
  party2Share: number;
}

export function ShareBreakdown({ party1Name, party1Share, party2Name, party2Share }: ShareBreakdownProps) {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between text-sm">
        <span className="font-semibold text-slate-900">100% Total Revenue</span>
      </div>
      <div className="h-4 w-full bg-slate-100 rounded-full overflow-hidden flex">
        <div 
          className="h-full bg-indigo-600 transition-all duration-500" 
          style={{ width: `${party1Share}%` }} 
        />
        <div 
          className="h-full bg-emerald-500 transition-all duration-500" 
          style={{ width: `${party2Share}%` }} 
        />
      </div>
      <div className="flex justify-between text-sm">
        <div className="flex items-center">
          <div className="w-3 h-3 rounded-full bg-indigo-600 mr-2" />
          <span className="text-slate-600">{party1Name}</span>
          <span className="ml-2 font-semibold text-slate-900">{party1Share}%</span>
        </div>
        <div className="flex items-center">
          <div className="w-3 h-3 rounded-full bg-emerald-500 mr-2" />
          <span className="text-slate-600">{party2Name}</span>
          <span className="ml-2 font-semibold text-slate-900">{party2Share}%</span>
        </div>
      </div>
    </div>
  );
}
