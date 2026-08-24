import { CompanyDistributorSettlement, DistributorPartnerSettlement, PaymentRecord, DistributorReceivable, PartnerReceivable } from '../types/settlement';

export const MOCK_COMPANY_SETTLEMENTS: CompanyDistributorSettlement[] = [
  {
    "id": "cs-aug-dist1",
    "settlementNumber": "SET-2026-08-DIST1",
    "distributorId": "dist-1",
    "distributorName": "FunZone Distribution",
    "periodMonth": 8,
    "periodYear": 2026,
    "grossRevenue": 783300,
    "companySharePercent": 40,
    "distributorSharePercent": 60,
    "companyShareAmount": 313320,
    "distributorShareAmount": 469980,
    "status": "payment_pending",
    "machineBreakdown": [
      {
        "machineId": "KSK-2026-000001",
        "machineCode": "KSK-2026-000001",
        "grossRevenue": 75000,
        "companyShareAmount": 30000,
        "distributorShareAmount": 45000
      },
      {
        "machineId": "KSK-2026-000002",
        "machineCode": "KSK-2026-000002",
        "grossRevenue": 15300,
        "companyShareAmount": 6120,
        "distributorShareAmount": 9180
      },
      {
        "machineId": "KSK-2026-000003",
        "machineCode": "KSK-2026-000003",
        "grossRevenue": 17000,
        "companyShareAmount": 6800,
        "distributorShareAmount": 10200
      },
      {
        "machineId": "KSK-2026-000004",
        "machineCode": "KSK-2026-000004",
        "grossRevenue": 58000,
        "companyShareAmount": 23200,
        "distributorShareAmount": 34800
      },
      {
        "machineId": "KSK-2026-000005",
        "machineCode": "KSK-2026-000005",
        "grossRevenue": 4300,
        "companyShareAmount": 1720,
        "distributorShareAmount": 2580
      },
      {
        "machineId": "KSK-2026-000006",
        "machineCode": "KSK-2026-000006",
        "grossRevenue": 8800,
        "companyShareAmount": 3520,
        "distributorShareAmount": 5280
      },
      {
        "machineId": "KSK-2026-000007",
        "machineCode": "KSK-2026-000007",
        "grossRevenue": 23000,
        "companyShareAmount": 9200,
        "distributorShareAmount": 13800
      },
      {
        "machineId": "KSK-2026-000008",
        "machineCode": "KSK-2026-000008",
        "grossRevenue": 36000,
        "companyShareAmount": 14400,
        "distributorShareAmount": 21600
      },
      {
        "machineId": "KSK-2026-000009",
        "machineCode": "KSK-2026-000009",
        "grossRevenue": 7600,
        "companyShareAmount": 3040,
        "distributorShareAmount": 4560
      },
      {
        "machineId": "KSK-2026-000010",
        "machineCode": "KSK-2026-000010",
        "grossRevenue": 37600,
        "companyShareAmount": 15040,
        "distributorShareAmount": 22560
      },
      {
        "machineId": "KSK-2026-000011",
        "machineCode": "KSK-2026-000011",
        "grossRevenue": 57000,
        "companyShareAmount": 22800,
        "distributorShareAmount": 34200
      },
      {
        "machineId": "KSK-2026-000012",
        "machineCode": "KSK-2026-000012",
        "grossRevenue": 31500,
        "companyShareAmount": 12600,
        "distributorShareAmount": 18900
      },
      {
        "machineId": "KSK-2026-000013",
        "machineCode": "KSK-2026-000013",
        "grossRevenue": 4400,
        "companyShareAmount": 1760,
        "distributorShareAmount": 2640
      },
      {
        "machineId": "KSK-2026-000014",
        "machineCode": "KSK-2026-000014",
        "grossRevenue": 21000,
        "companyShareAmount": 8400,
        "distributorShareAmount": 12600
      },
      {
        "machineId": "KSK-2026-000015",
        "machineCode": "KSK-2026-000015",
        "grossRevenue": 14100,
        "companyShareAmount": 5640,
        "distributorShareAmount": 8460
      },
      {
        "machineId": "KSK-2026-000016",
        "machineCode": "KSK-2026-000016",
        "grossRevenue": 21600,
        "companyShareAmount": 8640,
        "distributorShareAmount": 12960
      },
      {
        "machineId": "KSK-2026-000017",
        "machineCode": "KSK-2026-000017",
        "grossRevenue": 28800,
        "companyShareAmount": 11520,
        "distributorShareAmount": 17280
      },
      {
        "machineId": "KSK-2026-000018",
        "machineCode": "KSK-2026-000018",
        "grossRevenue": 4700,
        "companyShareAmount": 1880,
        "distributorShareAmount": 2820
      },
      {
        "machineId": "KSK-2026-000019",
        "machineCode": "KSK-2026-000019",
        "grossRevenue": 7200,
        "companyShareAmount": 2880,
        "distributorShareAmount": 4320
      },
      {
        "machineId": "KSK-2026-000020",
        "machineCode": "KSK-2026-000020",
        "grossRevenue": 16800,
        "companyShareAmount": 6720,
        "distributorShareAmount": 10080
      },
      {
        "machineId": "KSK-2026-000021",
        "machineCode": "KSK-2026-000021",
        "grossRevenue": 20000,
        "companyShareAmount": 8000,
        "distributorShareAmount": 12000
      },
      {
        "machineId": "KSK-2026-000022",
        "machineCode": "KSK-2026-000022",
        "grossRevenue": 15300,
        "companyShareAmount": 6120,
        "distributorShareAmount": 9180
      },
      {
        "machineId": "KSK-2026-000023",
        "machineCode": "KSK-2026-000023",
        "grossRevenue": 18900,
        "companyShareAmount": 7560,
        "distributorShareAmount": 11340
      },
      {
        "machineId": "KSK-2026-000024",
        "machineCode": "KSK-2026-000024",
        "grossRevenue": 7600,
        "companyShareAmount": 3040,
        "distributorShareAmount": 4560
      },
      {
        "machineId": "KSK-2026-000025",
        "machineCode": "KSK-2026-000025",
        "grossRevenue": 10800,
        "companyShareAmount": 4320,
        "distributorShareAmount": 6480
      },
      {
        "machineId": "KSK-2026-000026",
        "machineCode": "KSK-2026-000026",
        "grossRevenue": 11800,
        "companyShareAmount": 4720,
        "distributorShareAmount": 7080
      },
      {
        "machineId": "KSK-2026-000027",
        "machineCode": "KSK-2026-000027",
        "grossRevenue": 11400,
        "companyShareAmount": 4560,
        "distributorShareAmount": 6840
      },
      {
        "machineId": "KSK-2026-000028",
        "machineCode": "KSK-2026-000028",
        "grossRevenue": 1500,
        "companyShareAmount": 600,
        "distributorShareAmount": 900
      },
      {
        "machineId": "KSK-2026-000029",
        "machineCode": "KSK-2026-000029",
        "grossRevenue": 16000,
        "companyShareAmount": 6400,
        "distributorShareAmount": 9600
      },
      {
        "machineId": "KSK-2026-000030",
        "machineCode": "KSK-2026-000030",
        "grossRevenue": 22000,
        "companyShareAmount": 8800,
        "distributorShareAmount": 13200
      },
      {
        "machineId": "KSK-2026-000031",
        "machineCode": "KSK-2026-000031",
        "grossRevenue": 31200,
        "companyShareAmount": 12480,
        "distributorShareAmount": 18720
      },
      {
        "machineId": "KSK-2026-000032",
        "machineCode": "KSK-2026-000032",
        "grossRevenue": 53000,
        "companyShareAmount": 21200,
        "distributorShareAmount": 31800
      },
      {
        "machineId": "KSK-2026-000033",
        "machineCode": "KSK-2026-000033",
        "grossRevenue": 3500,
        "companyShareAmount": 1400,
        "distributorShareAmount": 2100
      },
      {
        "machineId": "KSK-2026-000034",
        "machineCode": "KSK-2026-000034",
        "grossRevenue": 40000,
        "companyShareAmount": 16000,
        "distributorShareAmount": 24000
      },
      {
        "machineId": "KSK-2026-000035",
        "machineCode": "KSK-2026-000035",
        "grossRevenue": 30600,
        "companyShareAmount": 12240,
        "distributorShareAmount": 18360
      }
    ],
    agreementVersion: 1,
    createdAt: "2026-09-01T10:00:00Z",
    updatedAt: "2026-09-01T10:00:00Z"
  }
];

export const MOCK_PARTNER_SETTLEMENTS: DistributorPartnerSettlement[] = [
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
];

export const MOCK_PAYMENTS: PaymentRecord[] = [
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
];

export const MOCK_RECEIVABLES: DistributorReceivable[] = [
  {
    "id": "cr-aug-dist1",
    "distributorId": "dist-1",
    "settlementId": "cs-aug-dist1",
    "amount": 469980,
    "status": "payment_pending",
    "createdAt": "2026-09-02T10:00:00Z"
  }
];

export const MOCK_PARTNER_RECEIVABLES: PartnerReceivable[] = [
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
];
