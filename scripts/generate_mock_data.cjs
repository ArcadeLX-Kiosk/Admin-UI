const fs = require('fs');
const path = require('path');

const srcMockPath = path.join(__dirname, '../src/mock');

const DIST_1 = 'dist-1';
const PART_1 = 'part-1';
const MACHINE_1 = 'KSK-2026-000001';

const generateData = () => {
  const machines = [];
  const distributors = [
    {
      id: DIST_1,
      businessName: 'FunZone Distribution',
      contactPerson: 'Arjun Mehta',
      email: 'arjun@funzonedistribution.demo',
      phone: '+91 98765 43210',
      gstNumber: '29ABCDE1234F1Z5',
      address: '123 Tech Park, Block C',
      city: 'Bengaluru',
      state: 'Karnataka',
      postalCode: '560001',
      country: 'India',
      status: 'active',
      createdAt: '2024-01-15T10:00:00Z',
      totalMachines: 35,
      monthlyRevenue: 0,
      pendingSettlement: 0,
    },
    {
      id: 'dist-2',
      businessName: 'PlayWorks Entertainment',
      contactPerson: 'Priya Sharma',
      email: 'priya@playworks.demo',
      phone: '+91 91234 56780',
      gstNumber: '27XYZDE1234F2Z4',
      address: '45 Hub Mall, Level 2',
      city: 'Mumbai',
      state: 'Maharashtra',
      postalCode: '400001',
      country: 'India',
      status: 'active',
      createdAt: '2024-03-22T14:30:00Z',
      totalMachines: 10,
      monthlyRevenue: 0,
      pendingSettlement: 0,
    },
    {
      id: 'dist-3',
      businessName: 'Metro Amusements',
      contactPerson: 'Sanjay Gupta',
      email: 'sanjay@metroamuse.demo',
      phone: '+91 90001 10002',
      gstNumber: '33FGHIJ1234F4Z2',
      address: 'Anna Salai',
      city: 'Chennai',
      state: 'Tamil Nadu',
      postalCode: '600002',
      country: 'India',
      status: 'active',
      createdAt: '2025-06-05T11:45:00Z',
      totalMachines: 5,
      monthlyRevenue: 0,
      pendingSettlement: 0,
    }
  ];

  const partners = [
    {
      id: PART_1,
      distributorId: DIST_1,
      businessName: 'Nexus Gaming Center',
      contactPerson: 'Karan Patel',
      email: 'Karan Patel@gmail.com',
      phone: '+91 91111 22222',
      gstNumber: '24ABCDE1234P1Z5',
      address: 'Alpha Mall, 3rd Floor',
      city: 'Ahmedabad',
      state: 'Gujarat',
      postalCode: '380015',
      country: 'India',
      status: 'active',
      createdAt: '2024-02-01T10:00:00Z',
      totalMachines: 15,
      monthlyRevenue: 0,
      pendingSettlement: 0,
    },
    {
      id: 'part-2',
      distributorId: DIST_1,
      businessName: 'Orion Arcades',
      contactPerson: 'Neha Desai',
      email: 'neha@orionarcades.demo',
      phone: '+91 92222 33333',
      gstNumber: '29FGHIJ1234P2Z4',
      address: 'Forum Mall, Level 4',
      city: 'Bengaluru',
      state: 'Karnataka',
      postalCode: '560021',
      country: 'India',
      status: 'active',
      createdAt: '2024-05-12T14:30:00Z',
      totalMachines: 20,
      monthlyRevenue: 0,
      pendingSettlement: 0,
    },
    {
      id: 'part-3',
      distributorId: 'dist-2',
      businessName: 'Star Play Zone',
      contactPerson: 'Amit Joshi',
      email: 'amit@starplay.demo',
      phone: '+91 93333 44444',
      gstNumber: '27KLMNO1234P3Z3',
      address: 'Infinity Mall, Andheri',
      city: 'Mumbai',
      state: 'Maharashtra',
      postalCode: '400053',
      country: 'India',
      status: 'active',
      createdAt: '2024-08-20T09:15:00Z',
      totalMachines: 10,
      monthlyRevenue: 0,
      pendingSettlement: 0,
    }
  ];

  const companyDistAgreements = [
    {
      id: 'cda-1-v1',
      distributorId: DIST_1,
      companySharePercent: 40,
      distributorSharePercent: 60,
      effectiveFrom: '2024-01-15T00:00:00Z',
      effectiveTo: null,
      version: 1,
      status: 'active',
      notes: 'Standard 40/60 agreement for FunZone',
      documentUrl: '#',
      createdAt: '2024-01-10T10:00:00Z',
    },
    {
      id: 'cda-2-v1',
      distributorId: 'dist-2',
      companySharePercent: 50,
      distributorSharePercent: 50,
      effectiveFrom: '2024-03-22T00:00:00Z',
      effectiveTo: null,
      version: 1,
      status: 'active',
      notes: 'Standard market entry',
      documentUrl: '#',
      createdAt: '2024-03-15T10:00:00Z',
    },
    {
      id: 'cda-3-v1',
      distributorId: 'dist-3',
      companySharePercent: 35,
      distributorSharePercent: 65,
      effectiveFrom: '2025-06-05T00:00:00Z',
      effectiveTo: null,
      version: 1,
      status: 'active',
      notes: 'Premium distributor tier',
      documentUrl: '#',
      createdAt: '2025-06-01T10:00:00Z',
    }
  ];

  const distPartAgreements = [
    {
      id: 'dpa-1-v1',
      distributorId: DIST_1,
      partnerId: PART_1,
      distributorSharePercent: 30,
      partnerSharePercent: 70,
      effectiveFrom: '2024-02-01T00:00:00Z',
      effectiveTo: null,
      version: 1,
      status: 'active',
      notes: 'Nexus Gaming 30/70 split',
      documentUrl: '#',
      createdAt: '2024-01-25T10:00:00Z',
    },
    {
      id: 'dpa-2-v1',
      distributorId: DIST_1,
      partnerId: 'part-2',
      distributorSharePercent: 40,
      partnerSharePercent: 60,
      effectiveFrom: '2024-05-12T00:00:00Z',
      effectiveTo: null,
      version: 1,
      status: 'active',
      notes: 'Orion Arcades 40/60 split',
      documentUrl: '#',
      createdAt: '2024-05-01T10:00:00Z',
    },
    {
      id: 'dpa-3-v1',
      distributorId: 'dist-2',
      partnerId: 'part-3',
      distributorSharePercent: 35,
      partnerSharePercent: 65,
      effectiveFrom: '2024-08-20T00:00:00Z',
      effectiveTo: null,
      version: 1,
      status: 'active',
      notes: 'Star Play Zone split',
      documentUrl: '#',
      createdAt: '2024-08-15T10:00:00Z',
    }
  ];

  // Generate 50 machines
  for (let i = 1; i <= 50; i++) {
    const codeStr = String(i).padStart(6, '0');
    const machineId = `KSK-2026-${codeStr}`;
    let dId = DIST_1;
    let pId = PART_1;

    if (i > 15 && i <= 35) {
      pId = 'part-2';
    } else if (i > 35 && i <= 45) {
      dId = 'dist-2';
      pId = 'part-3';
    } else if (i > 45) {
      dId = 'dist-3';
      pId = null;
    }

    machines.push({
      id: machineId,
      code: machineId,
      model: i % 2 === 0 ? 'Arcade-LX B2B' : 'Arcade-LX B2C',
      status: 'installed',
      distributorId: dId,
      partnerId: pId,
      manufacturingDate: '2024-01-05T00:00:00Z',
      deploymentDate: pId ? '2024-03-01T00:00:00Z' : '2025-07-01T00:00:00Z',
      location: pId ? `Location for ${pId}` : `Location for ${dId}`,
      city: i < 20 ? 'Ahmedabad' : (i < 40 ? 'Bengaluru' : 'Mumbai'),
      firmwareVersion: 'v2.1.4',
      totalRevenue: 0,
      totalTransactions: 0,
    });
  }

  // Specifically set machine KSK-2026-000001 details to guarantee the hero path
  machines[0].id = MACHINE_1;
  machines[0].code = MACHINE_1;
  machines[0].distributorId = DIST_1;
  machines[0].partnerId = PART_1;

  // Revenue Transactions spanning Jan 2026 - Aug 2026
  const revenues = [];
  let txIdCounter = 1;
  for (let month = 1; month <= 8; month++) {
    // Generate transactions for machines. For the hero machine (KSK-2026-000001) in August (month 8), we explicitly want 75,000 total.
    for (const machine of machines) {
      const isHeroMachine = machine.id === MACHINE_1;

      let txsThisMonth = 30;
      let amountPerTx = 50; // Random defaults

      if (isHeroMachine && month === 8) {
        // We need 75,000. Let's do 75 transactions of 1000 each to keep it simple, or 150 txs of 500
        txsThisMonth = 150;
        amountPerTx = 500;
      } else {
        txsThisMonth = Math.floor(Math.random() * 50) + 10;
        amountPerTx = Math.floor(Math.random() * 10) * 100 + 100; // 100 to 1000
      }

      let dailySum = 0;
      for (let d = 1; d <= txsThisMonth; d++) {
        const day = (d % 28) + 1;
        const dateStr = `2026-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}T12:00:00Z`;

        revenues.push({
          id: `tx-${txIdCounter++}`,
          machineId: machine.id,
          amount: amountPerTx,
          currency: 'INR',
          status: 'success',
          timestamp: dateStr,
          paymentMethod: 'upi',
          transactionReference: `UPI-${Math.floor(Math.random() * 1000000000)}`
        });
        dailySum += amountPerTx;
      }
      machine.totalRevenue += dailySum;
      machine.totalTransactions += txsThisMonth;

      const pId = machine.partnerId;
      const dId = machine.distributorId;
      if (pId) {
        const p = partners.find(x => x.id === pId);
        if (p) p.monthlyRevenue += dailySum;
      }
      if (dId) {
        const d = distributors.find(x => x.id === dId);
        if (d) d.monthlyRevenue += dailySum;
      }
    }
  }

  // Settlements (Just generate August settlements as the pending/completed ones for the demo)
  const companySettlements = [];
  const partnerSettlements = [];
  const payments = [];
  const receivables = [];
  const partnerReceivables = [];
  const orders = [];

  // Calculate company settlements for August (Month 8)
  // Let's create an approved but UNPAID settlement for FunZone for August
  // Actually, the user wants the demo to be: Company pays Distributor -> Distributor pays Partner
  // Let's make August generated but unapproved/unpaid? 
  // User flow: "Company Login -> Dashboard -> Pay Distributor -> Distributor Login -> Pay Partner"
  // So Company Settlement should be 'payment_pending'.

  let companyFunzoneSettlementAmount = 0;
  let distFunzoneEntitlement = 0;
  const funzoneMachineBreakdown = [];

  // Build machine breakdown for FunZone for August
  for (const m of machines.filter(m => m.distributorId === DIST_1)) {
    const augRevs = revenues.filter(r => r.machineId === m.id && r.timestamp.startsWith('2026-08'));
    const totalRev = augRevs.reduce((acc, curr) => acc + curr.amount, 0);
    if (totalRev > 0) {
      // FunZone agreement is 40% company / 60% distributor
      const cShare = totalRev * 0.40;
      const dShare = totalRev * 0.60;

      companyFunzoneSettlementAmount += totalRev;
      distFunzoneEntitlement += dShare;

      funzoneMachineBreakdown.push({
        machineId: m.id,
        machineCode: m.code,
        grossRevenue: totalRev,
        companyShareAmount: cShare,
        distributorShareAmount: dShare
      });
    }
  }

  companySettlements.push({
    id: 'cs-aug-dist1',
    settlementNumber: 'SET-2026-08-DIST1',
    distributorId: DIST_1,
    distributorName: 'FunZone Distribution',
    periodMonth: 8,
    periodYear: 2026,
    grossRevenue: companyFunzoneSettlementAmount,
    companySharePercent: 40,
    distributorSharePercent: 60,
    companyShareAmount: companyFunzoneSettlementAmount * 0.40,
    distributorShareAmount: distFunzoneEntitlement,
    status: 'payment_pending',
    machineBreakdown: funzoneMachineBreakdown,
    agreementVersion: 1,
    createdAt: '2026-09-01T10:00:00Z',
  });

  receivables.push({
    id: 'cr-aug-dist1',
    distributorId: DIST_1,
    settlementId: 'cs-aug-dist1',
    amount: distFunzoneEntitlement,
    periodMonth: 8,
    periodYear: 2026,
    status: 'payment_pending',
    dueDate: '2026-09-10T00:00:00Z',
    createdAt: '2026-09-02T10:00:00Z'
  });

  distributors.find(d => d.id === DIST_1).pendingSettlement = distFunzoneEntitlement;

  // Let's create an order in 'requested' state so the company can approve it in the demo
  orders.push({
    id: 'ORD-2026-09-001',
    requestedBy: DIST_1,
    requestedByRole: 'distributor',
    requestedTo: 'company',
    requestedToRole: 'company',
    machineModel: 'Arcade-LX B2B',
    quantity: 10,
    deliveryAddress: '123 Tech Park, Block C, Bengaluru',
    status: 'requested',
    createdAt: '2026-09-05T09:00:00Z',
    updatedAt: '2026-09-05T09:00:00Z',
    notes: 'Need more machines for Diwali season.'
  });

  const generateFile = (fileName, varName, data, typeImports) => {
    const content = `${typeImports}\n\nexport const ${varName} = ${JSON.stringify(data, null, 2)};\n`;
    fs.writeFileSync(path.join(srcMockPath, fileName), content);
  }

  generateFile('data.ts', 'MOCK_DISTRIBUTORS', distributors, `import { Distributor, Partner, CompanyDistributorAgreement, DistributorPartnerAgreement } from '../types/organization';\n\nexport const MOCK_PARTNERS: Partner[] = ${JSON.stringify(partners, null, 2)};\n\nexport const MOCK_COMPANY_DISTRIBUTOR_AGREEMENTS: CompanyDistributorAgreement[] = ${JSON.stringify(companyDistAgreements, null, 2)};\n\nexport const MOCK_DISTRIBUTOR_PARTNER_AGREEMENTS: DistributorPartnerAgreement[] = ${JSON.stringify(distPartAgreements, null, 2)};`);
  generateFile('machineData.ts', 'MOCK_MACHINES', machines, `import { Machine } from '../types/machine';`);
  generateFile('orderData.ts', 'MOCK_ORDERS', orders, `import { Order } from '../types/order';`);
  generateFile('revenueData.ts', 'MOCK_REVENUE_TRANSACTIONS', revenues, `import { RevenueTransaction } from '../types/revenue';`);

  // Note: SettlementData needs multiple exports
  const settlementContent = `import { CompanyDistributorSettlement, DistributorPartnerSettlement, PaymentRecord, Receivable, PartnerReceivable } from '../types/settlement';\n\nexport const MOCK_COMPANY_SETTLEMENTS: CompanyDistributorSettlement[] = ${JSON.stringify(companySettlements, null, 2)};\n\nexport const MOCK_PARTNER_SETTLEMENTS: DistributorPartnerSettlement[] = ${JSON.stringify(partnerSettlements, null, 2)};\n\nexport const MOCK_PAYMENTS: PaymentRecord[] = ${JSON.stringify(payments, null, 2)};\n\nexport const MOCK_RECEIVABLES: Receivable[] = ${JSON.stringify(receivables, null, 2)};\n\nexport const MOCK_PARTNER_RECEIVABLES: PartnerReceivable[] = ${JSON.stringify(partnerReceivables, null, 2)};`;
  fs.writeFileSync(path.join(srcMockPath, 'settlementData.ts'), settlementContent);
};

generateData();
