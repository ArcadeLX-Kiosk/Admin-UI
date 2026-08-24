import React from 'react';
import { useLocation } from 'react-router-dom';

export function Placeholder() {
  const location = useLocation();
  const pageName = location.pathname.split('/').pop()?.replace(/-/g, ' ');

  return (
    <div className="flex flex-col items-center justify-center h-full text-slate-500 min-h-[400px]">
      <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mb-4">
        <span className="text-2xl font-bold text-slate-300">?</span>
      </div>
      <h2 className="text-xl font-semibold text-slate-700 capitalize">{pageName}</h2>
      <p className="mt-2 text-sm text-slate-500">This feature will be implemented in a future phase.</p>
    </div>
  );
}
