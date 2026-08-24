import json
import re

def update_file(filename, replacement_map):
    with open(filename, 'r', encoding='utf-8') as f:
        content = f.read()

    for pattern, new_val in replacement_map.items():
        content = re.sub(pattern, new_val, content)

    with open(filename, 'w', encoding='utf-8') as f:
        f.write(content)

# 1. Partner Settlements
partner_settlements = """export const MOCK_PARTNER_SETTLEMENTS: DistributorPartnerSettlement[] = [
  {
    id: "ps-aug-part1",
    settlementNumber: "SET-P-2026-08-003",
    companySettlementId: "cs-aug-dist1",
    distributorId: "dist-1",
    partnerId: "part-1",
    partnerName: "Nexus Gaming Center",
    periodMonth: 8,
    periodYear: 2026,
    agreementVersion: "1.0",
    distributorSharePercent: 30,
    partnerSharePercent: 70,
    eligibleRevenue: 45000,
    distributorRetainedAmount: 13500,
    partnerPayableAmount: 31500,
    status: "payment_pending",
    machineBreakdown: [],
    gstAmount: 5670,
    totalAmount: 37170,
    createdAt: "2026-09-01T00:00:00Z",
    updatedAt: "2026-09-01T00:00:00Z"
  },
  {
    id: "ps-jul-part1",
    settlementNumber: "SET-P-2026-07-002",
    companySettlementId: "cs-jul-dist1",
    distributorId: "dist-1",
    partnerId: "part-1",
    partnerName: "Nexus Gaming Center",
    periodMonth: 7,
    periodYear: 2026,
    agreementVersion: "1.0",
    distributorSharePercent: 30,
    partnerSharePercent: 70,
    eligibleRevenue: 37857,
    distributorRetainedAmount: 11357,
    partnerPayableAmount: 26500,
    status: "paid",
    machineBreakdown: [],
    gstAmount: 4770,
    totalAmount: 31270,
    createdAt: "2026-08-01T00:00:00Z",
    updatedAt: "2026-08-10T00:00:00Z"
  },
  {
    id: "ps-jun-part1",
    settlementNumber: "SET-P-2026-06-001",
    companySettlementId: "cs-jun-dist1",
    distributorId: "dist-1",
    partnerId: "part-1",
    partnerName: "Nexus Gaming Center",
    periodMonth: 6,
    periodYear: 2026,
    agreementVersion: "1.0",
    distributorSharePercent: 30,
    partnerSharePercent: 70,
    eligibleRevenue: 30000,
    distributorRetainedAmount: 9000,
    partnerPayableAmount: 21000,
    status: "paid",
    machineBreakdown: [],
    gstAmount: 3780,
    totalAmount: 24780,
    createdAt: "2026-07-01T00:00:00Z",
    updatedAt: "2026-07-10T00:00:00Z"
  }
];"""

# 2. Payments
payments = """export const MOCK_PAYMENTS: PaymentRecord[] = [
  {
    id: "pay-dist-aug",
    senderId: "company",
    recipientId: "dist-1",
    settlementId: "cs-aug-dist1",
    amount: 15930,
    paidAt: "2026-08-10T10:00:00Z",
    paymentMethod: "bank_transfer",
    transactionReference: "UTIB0001234567",
    status: "paid"
  },
  {
    id: "pay-dist-jul",
    senderId: "company",
    recipientId: "dist-1",
    settlementId: "cs-jul-dist1",
    amount: 12480,
    paidAt: "2026-07-10T10:00:00Z",
    paymentMethod: "bank_transfer",
    transactionReference: "UTIB0001234568",
    status: "paid"
  },
  {
    id: "pay-dist-jun",
    senderId: "company",
    recipientId: "dist-1",
    settlementId: "cs-jun-dist1",
    amount: 10950,
    paidAt: "2026-06-10T10:00:00Z",
    paymentMethod: "bank_transfer",
    transactionReference: "UTIB0001234569",
    status: "paid"
  },
  {
    id: "pay-part-jul",
    senderId: "company",
    recipientId: "part-1",
    settlementId: "ps-jul-part1",
    amount: 31270,
    paidAt: "2026-07-12T10:00:00Z",
    paymentMethod: "bank_transfer",
    transactionReference: "HDFC0001234567",
    status: "paid"
  },
  {
    id: "pay-part-jun",
    senderId: "company",
    recipientId: "part-1",
    settlementId: "ps-jun-part1",
    amount: 24780,
    paidAt: "2026-06-12T10:00:00Z",
    paymentMethod: "bank_transfer",
    transactionReference: "HDFC0001234568",
    status: "paid"
  }
];"""

partner_receivables = """export const MOCK_PARTNER_RECEIVABLES: PartnerReceivable[] = [
  {
    id: "pr-aug-part1",
    partnerId: "part-1",
    distributorId: "dist-1",
    amount: 37170,
    status: "payment_pending",
    createdAt: "2026-09-01T00:00:00Z",
    settlementId: "ps-aug-part1"
  },
  {
    id: "pr-jul-part1",
    partnerId: "part-1",
    distributorId: "dist-1",
    amount: 31270,
    status: "paid",
    createdAt: "2026-08-01T00:00:00Z",
    settlementId: "ps-jul-part1"
  }
];"""

update_file('src/mock/settlementData.ts', {
    r'export const MOCK_PARTNER_SETTLEMENTS: DistributorPartnerSettlement\[\] = \[[\s\S]*?\];': partner_settlements,
    r'export const MOCK_PAYMENTS: PaymentRecord\[\] = \[[\s\S]*?\];': payments,
    r'export const MOCK_PARTNER_RECEIVABLES: PartnerReceivable\[\] = \[[\s\S]*?\];': partner_receivables
})
