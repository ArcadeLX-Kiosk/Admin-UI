export type PaymentStatus = 'successful' | 'failed' | 'pending' | 'refunded';

export interface RevenueTransaction {
  id: string;
  machineId: string;
  machineCode: string;
  transactionReference: string;
  gameName: string;
  amount: number;
  durationMinutes: number;
  transactionDate: string;
  paymentStatus: PaymentStatus;
  paymentSource: string;
  createdAt: string;
}

export interface MachineRevenueAggregation {
  machineId: string;
  machineCode: string;
  totalRevenue: number;
  todayRevenue: number;
  thisWeekRevenue: number;
  thisMonthRevenue: number;
  transactionCount: number;
  lastRevenueDate: string | null;
}
