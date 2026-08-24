import React, { createContext, useContext, useState, ReactNode } from 'react';
import { RevenueTransaction, MachineRevenueAggregation } from '../types/revenue';
import { MOCK_REVENUE_TRANSACTIONS } from './revenueData';

interface RevenueContextType {
  transactions: RevenueTransaction[];
  simulatePlay: (machineId: string, machineCode: string, gameName: string, amount: number, durationMinutes: number) => void;
  getMachineAggregation: (machineId: string) => MachineRevenueAggregation;
}

const RevenueContext = createContext<RevenueContextType | undefined>(undefined);

export const RevenueProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [transactions, setTransactions] = useState<RevenueTransaction[]>(MOCK_REVENUE_TRANSACTIONS as unknown as RevenueTransaction[]);

  const simulatePlay = (machineId: string, machineCode: string, gameName: string, amount: number, durationMinutes: number) => {
    const newTransaction: RevenueTransaction = {
      id: `rev-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      machineId,
      machineCode,
      transactionReference: `pay_${Math.random().toString(36).substr(2, 9)}`,
      gameName,
      amount,
      durationMinutes,
      transactionDate: new Date().toISOString(),
      paymentStatus: 'successful',
      paymentSource: 'Razorpay Demo',
      createdAt: new Date().toISOString(),
    };

    setTransactions(prev => [newTransaction, ...prev]);
  };

  const getMachineAggregation = (machineId: string): MachineRevenueAggregation => {
    const machineTx = transactions.filter(t => t.machineId === machineId && t.paymentStatus === 'successful');
    const now = new Date();

    let total = 0, today = 0, week = 0, month = 0;

    machineTx.forEach(t => {
      total += t.amount;
      const txDate = new Date(t.transactionDate);
      const daysDiff = (now.getTime() - txDate.getTime()) / (1000 * 3600 * 24);

      if (daysDiff <= 1 && txDate.getDate() === now.getDate()) today += t.amount;
      if (daysDiff <= 7) week += t.amount;
      if (txDate.getMonth() === now.getMonth() && txDate.getFullYear() === now.getFullYear()) month += t.amount;
    });

    const lastDate = machineTx.length > 0
      ? machineTx.sort((a, b) => new Date(b.transactionDate).getTime() - new Date(a.transactionDate).getTime())[0].transactionDate
      : null;

    return {
      machineId,
      machineCode: machineTx[0]?.machineCode || '',
      totalRevenue: total,
      todayRevenue: today,
      thisWeekRevenue: week,
      thisMonthRevenue: month,
      transactionCount: machineTx.length,
      lastRevenueDate: lastDate,
    };
  };

  return (
    <RevenueContext.Provider value={{ transactions, simulatePlay, getMachineAggregation }}>
      {children}
    </RevenueContext.Provider>
  );
};

export const useRevenue = () => {
  const context = useContext(RevenueContext);
  if (context === undefined) {
    throw new Error('useRevenue must be used within a RevenueProvider');
  }
  return context;
};
