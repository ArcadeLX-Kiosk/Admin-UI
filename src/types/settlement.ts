export type SettlementStatus = 'draft' | 'requested' | 'under_review' | 'generated' | 'verified' | 'approved' | 'payment_pending' | 'paid' | 'closed' | 'rejected' | 'cancelled' | 'payment_failed';

export interface MachineSettlementBreakdown {
  machineId: string;
  machineCode: string;
  grossRevenue: number;
  companyShareAmount: number;
  distributorShareAmount: number;
  transactionCount?: number;
}

export interface CompanyDistributorSettlement {
  id: string;
  settlementNumber: string; // e.g., SET-2026-08-0001
  distributorId: string;
  distributorName: string; // Snapshotted name
  periodMonth: number; // 1-12
  periodYear: number;
  
  agreementId?: string;
  agreementVersion: string | number;
  companySharePercent: number;
  distributorSharePercent: number;
  
  grossRevenue: number;
  companyShareAmount: number;
  distributorShareAmount: number;
  gstAmount?: number;
  totalAmount?: number;
  
  machineBreakdown: MachineSettlementBreakdown[];
  
  status: SettlementStatus;
  
  createdAt: string;
  updatedAt: string;
}

export interface DistributorReceivable {
  id: string;
  settlementId: string;
  distributorId: string;
  amount: number;
  status: 'payment_pending' | 'paid';
  createdAt: string;
}

export interface DistributorPartnerSettlement {
  id: string;
  settlementNumber: string; // e.g., SET-2026-08-0002
  companySettlementId: string; // References the upstream company settlement
  distributorId: string;
  partnerId: string;
  partnerName: string;
  periodMonth: number;
  periodYear: number;
  
  agreementId?: string;
  agreementVersion: string | number;
  distributorSharePercent: number;
  partnerSharePercent: number;
  
  // This is the amount the Distributor received for these partner's machines
  eligibleRevenue: number; 
  distributorRetainedAmount: number;
  partnerPayableAmount: number;
  gstAmount?: number;
  totalAmount?: number;
  
  machineBreakdown: MachineSettlementBreakdown[];
  
  status: SettlementStatus;
  
  createdAt: string;
  updatedAt: string;
}

export interface PartnerReceivable {
  id: string;
  settlementId: string;
  partnerId: string;
  distributorId: string;
  amount: number;
  status: 'payment_pending' | 'paid';
  createdAt: string;
}

export interface PaymentRecord {
  id: string;
  settlementId: string;
  senderId: string; // 'company' or distributorId
  recipientId: string; // distributorId or partnerId
  amount: number;
  paymentMethod: string;
  transactionReference: string;
  status: 'pending' | 'processing' | 'paid' | 'failed';
  paidAt: string;
}
