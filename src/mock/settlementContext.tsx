import React, { createContext, useContext, useState, ReactNode } from 'react';
import { CompanyDistributorSettlement, DistributorReceivable, DistributorPartnerSettlement, PartnerReceivable, PaymentRecord, SettlementStatus, MachineSettlementBreakdown } from '../types/settlement';
import { MOCK_COMPANY_SETTLEMENTS, MOCK_RECEIVABLES, MOCK_PARTNER_SETTLEMENTS, MOCK_PARTNER_RECEIVABLES, MOCK_PAYMENTS } from './settlementData';
import { useOrg } from './orgContext';
import { useRevenue } from './revenueContext';
import { useMachine } from './machineContext';
import { useNotification } from './notificationContext';
import { useAudit } from './auditContext';

interface SettlementContextType {
  settlements: CompanyDistributorSettlement[];
  receivables: DistributorReceivable[];
  partnerSettlements: DistributorPartnerSettlement[];
  partnerReceivables: PartnerReceivable[];
  payments: PaymentRecord[];

  generateSettlement: (distributorId: string, month: number, year: number) => CompanyDistributorSettlement | null;
  advanceStatus: (id: string, newStatus: SettlementStatus) => void;
  markCompanySettlementPaid: (id: string, method: string, ref: string) => void;

  generatePartnerSettlement: (distributorId: string, partnerId: string, month: number, year: number) => DistributorPartnerSettlement | null;
  advancePartnerStatus: (id: string, newStatus: SettlementStatus) => void;
  markPartnerSettlementPaid: (id: string, method: string, ref: string) => void;
}

const SettlementContext = createContext<SettlementContextType | undefined>(undefined);

export const SettlementProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [settlements, setSettlements] = useState<CompanyDistributorSettlement[]>(MOCK_COMPANY_SETTLEMENTS as CompanyDistributorSettlement[]);
  const [receivables, setReceivables] = useState<DistributorReceivable[]>(MOCK_RECEIVABLES);
  const [partnerSettlements, setPartnerSettlements] = useState<DistributorPartnerSettlement[]>(MOCK_PARTNER_SETTLEMENTS);
  const [partnerReceivables, setPartnerReceivables] = useState<PartnerReceivable[]>(MOCK_PARTNER_RECEIVABLES);
  const [payments, setPayments] = useState<PaymentRecord[]>(MOCK_PAYMENTS);

  const { distributors, companyDistributorAgreements, distributorPartnerAgreements } = useOrg();
  const { transactions } = useRevenue();
  const { machines } = useMachine();
  const { addNotification } = useNotification();
  const { addAuditLog } = useAudit();

  const generateSettlement = (distributorId: string, month: number, year: number) => {
    // 1. Get Distributor
    const distributor = distributors.find(d => d.id === distributorId);
    if (!distributor) return null;

    // 2. Get Active Agreement
    const agreement = companyDistributorAgreements.find(a => a.distributorId === distributorId && a.status === 'active');
    if (!agreement) {
      throw new Error("Settlement cannot be generated because no applicable agreement exists for this period.");
    }

    // 3. Find applicable machines
    const distMachines = machines.filter(m => m.distributorId === distributorId);
    const distMachineIds = new Set(distMachines.map(m => m.id));

    // 4. Find revenue transactions for this month
    const applicableTransactions = transactions.filter(t => {
      if (!distMachineIds.has(t.machineId) || t.paymentStatus !== 'successful') return false;
      const d = new Date(t.transactionDate);
      return d.getMonth() + 1 === month && d.getFullYear() === year;
    });

    if (applicableTransactions.length === 0) {
      throw new Error("No eligible machine revenue exists for this settlement period.");
    }

    let grossTotal = 0;
    const breakdownMap = new Map<string, MachineSettlementBreakdown>();

    applicableTransactions.forEach(t => {
      grossTotal += t.amount;

      if (!breakdownMap.has(t.machineId)) {
        breakdownMap.set(t.machineId, {
          machineId: t.machineId,
          machineCode: t.machineCode,
          grossRevenue: 0,
          companyShareAmount: 0,
          distributorShareAmount: 0,
          transactionCount: 0
        });
      }

      const bd = breakdownMap.get(t.machineId)!;
      bd.grossRevenue += t.amount;
      bd.transactionCount = (bd.transactionCount || 0) + 1;
    });

    let compTotal = 0;
    let distTotal = 0;

    // Calculate shares per machine
    breakdownMap.forEach(bd => {
      bd.companyShareAmount = bd.grossRevenue * (agreement.companySharePercent / 100);
      bd.distributorShareAmount = bd.grossRevenue * (agreement.distributorSharePercent / 100);

      compTotal += bd.companyShareAmount;
      distTotal += bd.distributorShareAmount;
    });

    const gst = distTotal * 0.18;
    const total = distTotal + gst;

    const newSettlement: CompanyDistributorSettlement = {
      id: "set-comp-dist-" + Date.now(),
      settlementNumber: "SET-" + year + "-" + month.toString().padStart(2, '0') + "-" + Math.floor(Math.random() * 1000).toString().padStart(4, '0'),
      distributorId,
      distributorName: distributor.businessName,
      periodMonth: month,
      periodYear: year,

      agreementId: agreement.id,
      agreementVersion: agreement.version ? agreement.version.toString() : '1',
      companySharePercent: agreement.companySharePercent,
      distributorSharePercent: agreement.distributorSharePercent,

      grossRevenue: grossTotal,
      companyShareAmount: compTotal,
      distributorShareAmount: distTotal,
      gstAmount: gst,
      totalAmount: total,

      machineBreakdown: Array.from(breakdownMap.values()),

      status: 'requested',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    setSettlements(prev => [newSettlement, ...prev]);

    addAuditLog({
      actorId: distributorId,
      actorName: distributor.businessName,
      actorRole: 'distributor',
      action: 'Requested Company Settlement',
      entityType: 'settlement',
      entityId: newSettlement.id,
      distributorId: distributorId
    });

    return newSettlement;
  };

  const advanceStatus = (id: string, newStatus: SettlementStatus) => {
    const settlement = settlements.find(s => s.id === id);
    if (!settlement) return;

    setSettlements(prev => prev.map(s => {
      if (s.id !== id) return s;

      if (newStatus === 'approved' && s.status !== 'approved') {
        const newRec: DistributorReceivable = {
          id: "rec-" + Date.now(),
          settlementId: s.id,
          distributorId: s.distributorId,
          amount: s.totalAmount || s.distributorShareAmount,
          status: 'payment_pending',
          createdAt: new Date().toISOString()
        };
        setReceivables(r => [newRec, ...r]);

        addAuditLog({
          actorId: 'company',
          actorName: 'Company Admin',
          actorRole: 'company',
          action: 'Approved Company Settlement',
          entityType: 'settlement',
          entityId: id,
          distributorId: s.distributorId
        });

        addNotification({
          recipientId: s.distributorId,
          title: 'Settlement Approved',
          message: "Settlement " + s.settlementNumber + " for Month " + s.periodMonth + " has been approved",
          category: 'settlement',
          relatedEntityId: id,
          relatedEntityType: 'settlement'
        });
      }

      return { ...s, status: newStatus, updatedAt: new Date().toISOString() };
    }));
  };

  const markCompanySettlementPaid = (id: string, paymentReference: string) => {
    const settlement = settlements.find(s => s.id === id);
    if (!settlement) return;
    const receivable = receivables.find(r => r.settlementId === id);
    if (!receivable) return;

    setSettlements(prev => prev.map(s => s.id === id ? { ...s, status: 'paid', updatedAt: new Date().toISOString() } : s));
    setReceivables(prev => prev.map(r => r.settlementId === id ? { ...r, status: 'paid' } : r));

    const newPayment: PaymentRecord = {
      id: "PAY-" + Math.random().toString(36).substr(2, 9).toUpperCase(),
      settlementId: id,
      senderId: 'company',
      recipientId: settlement.distributorId,
      amount: receivable.amount,
      paymentMethod: 'bank_transfer',
      transactionReference: paymentReference,
      status: 'paid',
      paidAt: new Date().toISOString()
    };

    setPayments(p => [newPayment, ...p]);

    addAuditLog({
      actorId: 'company',
      actorName: 'Company Admin',
      actorRole: 'company',
      action: 'Paid Company Settlement',
      entityType: 'payment',
      entityId: newPayment.id,
      distributorId: settlement.distributorId
    });

    addNotification({
      recipientId: settlement.distributorId,
      title: 'Payment Received from Company',
      message: "You received ₹" + receivable.amount.toLocaleString('en-IN') + " for Settlement " + settlement.settlementNumber + "",
      category: 'payment',
      relatedEntityId: newPayment.id,
      relatedEntityType: 'payment'
    });
  };

  const generatePartnerSettlement = (distributorId: string, partnerId: string, month: number, year: number) => {
    // 1. Get corresponding Company Settlement to ensure Distributor has been settled
    const compSettlement = settlements.find(s => s.distributorId === distributorId && s.periodMonth === month && s.periodYear === year);
    if (!compSettlement) {
      throw new Error("Cannot request Partner Settlement because no underlying Company Settlement exists for this period.");
    }

    if (compSettlement.status === 'draft' || compSettlement.status === 'requested' || compSettlement.status === 'under_review' || compSettlement.status === 'generated' || compSettlement.status === 'verified') {
      throw new Error("Underlying Company Settlement must be at least Approved to calculate Partner shares securely.");
    }

    // 2. Prevent duplicates
    const existing = partnerSettlements.find(s => s.partnerId === partnerId && s.periodMonth === month && s.periodYear === year);
    if (existing) {
      throw new Error("A Partner Settlement request for this period already exists.");
    }

    // 3. Get Active Partner Agreement
    const agreement = distributorPartnerAgreements.find(a => a.distributorId === distributorId && a.partnerId === partnerId && a.status === 'active');
    if (!agreement) {
      throw new Error("No active commercial agreement found for this Partner.");
    }

    // 4. Find machines specific to this Partner that were included in the Company Settlement
    const partnerMachines = machines.filter(m => m.distributorId === distributorId && m.partnerId === partnerId);
    const partnerMachineIds = new Set(partnerMachines.map(m => m.id));

    const applicableMachineBreakdowns = compSettlement.machineBreakdown.filter(mb => partnerMachineIds.has(mb.machineId));

    if (applicableMachineBreakdowns.length === 0) {
      throw new Error("No eligible machine revenue exists for this Partner in the selected period.");
    }

    let totalEligibleRevenue = 0; // This is the Distributor's portion
    let distRetainedTotal = 0;
    let partPayableTotal = 0;
    const partnerBreakdown: MachineSettlementBreakdown[] = [];

    applicableMachineBreakdowns.forEach(mb => {
      const baseEligible = mb.distributorShareAmount;
      totalEligibleRevenue += baseEligible;

      const distRetained = baseEligible * (agreement.distributorSharePercent / 100);
      const partPayable = baseEligible * (agreement.partnerSharePercent / 100);

      distRetainedTotal += distRetained;
      partPayableTotal += partPayable;

      partnerBreakdown.push({
        machineId: mb.machineId,
        machineCode: mb.machineCode,
        grossRevenue: mb.grossRevenue,
        companyShareAmount: distRetained,
        distributorShareAmount: partPayable,
        transactionCount: mb.transactionCount
      });
    });

    const gst = partPayableTotal * 0.18;
    const total = partPayableTotal + gst;

    const newPartnerSettlement: DistributorPartnerSettlement = {
      id: "set-dist-part-" + Date.now(),
      settlementNumber: "SET-" + year + "-" + month.toString().padStart(2, '0') + "-" + Math.floor(Math.random() * 1000).toString().padStart(4, '0'),
      companySettlementId: compSettlement.id,
      distributorId,
      partnerId,
      partnerName: partnerMachines[0]?.partnerId || 'TimeZone Distribution Partner',
      periodMonth: month,
      periodYear: year,

      agreementId: agreement.id,
      agreementVersion: agreement.version ? agreement.version.toString() : '1',
      distributorSharePercent: agreement.distributorSharePercent,
      partnerSharePercent: agreement.partnerSharePercent,

      eligibleRevenue: totalEligibleRevenue,
      distributorRetainedAmount: distRetainedTotal,
      partnerPayableAmount: partPayableTotal,
      gstAmount: gst,
      totalAmount: total,

      machineBreakdown: partnerBreakdown,

      status: 'requested',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    setPartnerSettlements(prev => [newPartnerSettlement, ...prev]);

    addAuditLog({
      actorId: partnerId,
      actorName: 'Partner Admin',
      actorRole: 'partner',
      action: 'Requested Partner Settlement',
      entityType: 'settlement',
      entityId: newPartnerSettlement.id,
      distributorId: distributorId,
      partnerId: partnerId
    });

    return newPartnerSettlement;
  };

  const advancePartnerStatus = (id: string, newStatus: SettlementStatus) => {
    setPartnerSettlements(prev => prev.map(s => {
      if (s.id !== id) return s;

      if (newStatus === 'approved' && s.status !== 'approved') {
        const newRec: PartnerReceivable = {
          id: "rec-p-" + Date.now(),
          settlementId: s.id,
          partnerId: s.partnerId,
          distributorId: s.distributorId,
          amount: s.totalAmount || s.partnerPayableAmount,
          status: 'payment_pending',
          createdAt: new Date().toISOString()
        };
        setPartnerReceivables(r => [newRec, ...r]);

        addAuditLog({
          actorId: 'company',
          actorName: 'Company Admin',
          actorRole: 'company',
          action: 'Approved Partner Settlement',
          entityType: 'settlement',
          entityId: id,
          distributorId: s.distributorId,
          partnerId: s.partnerId
        });

        addNotification({
          recipientId: s.partnerId,
          title: 'Partner Settlement Approved',
          message: "Settlement " + s.settlementNumber + " for Month " + s.periodMonth + " has been approved by Company",
          category: 'settlement',
          relatedEntityId: id,
          relatedEntityType: 'settlement'
        });
      }

      return { ...s, status: newStatus, updatedAt: new Date().toISOString() };
    }));
  };

  const markPartnerSettlementPaid = (id: string, method: string, paymentReference: string) => {
    const settlement = partnerSettlements.find(s => s.id === id);
    if (!settlement) return;
    const receivable = partnerReceivables.find(r => r.settlementId === id);
    if (!receivable) return;

    setPartnerSettlements(prev => prev.map(s => s.id === id ? { ...s, status: 'paid', updatedAt: new Date().toISOString() } : s));
    setPartnerReceivables(prev => prev.map(r => r.settlementId === id ? { ...r, status: 'paid' } : r));

    const newPayment: PaymentRecord = {
      id: "PAY-P-" + Math.random().toString(36).substr(2, 9).toUpperCase(),
      settlementId: id,
      senderId: 'company',
      recipientId: settlement.partnerId,
      amount: receivable.amount,
      paymentMethod: method as any,
      transactionReference: paymentReference,
      status: 'paid',
      paidAt: new Date().toISOString()
    };

    setPayments(p => [newPayment, ...p]);

    addAuditLog({
      actorId: 'company',
      actorName: 'Company Admin',
      actorRole: 'company',
      action: 'Paid Partner Settlement',
      entityType: 'payment',
      entityId: newPayment.id,
      distributorId: settlement.distributorId,
      partnerId: settlement.partnerId
    });

    addNotification({
      recipientId: settlement.partnerId,
      title: 'Payment Received from Company',
      message: "You received ₹" + receivable.amount.toLocaleString('en-IN') + " for Settlement " + settlement.settlementNumber + "",
      category: 'payment',
      relatedEntityId: newPayment.id,
      relatedEntityType: 'payment'
    });
  };

  return (
    <SettlementContext.Provider value={{
      settlements, receivables, partnerSettlements, partnerReceivables, payments,
      generateSettlement, advanceStatus, markCompanySettlementPaid,
      generatePartnerSettlement, advancePartnerStatus, markPartnerSettlementPaid
    }}>
      {children}
    </SettlementContext.Provider>
  );
};

export const useSettlement = () => {
  const context = useContext(SettlementContext);
  if (context === undefined) {
    throw new Error('useSettlement must be used within a SettlementProvider');
  }
  return context;
};
