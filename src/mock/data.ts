import { Distributor, Partner, CompanyDistributorAgreement, DistributorPartnerAgreement } from '../types/organization';

export const MOCK_PARTNERS: Partner[] = [
  {
    "id": "part-1",
    "distributorId": "dist-1",
    "businessName": "Nexus Gaming Center",
    "contactPerson": "Karan Patel",
    "email": "karan@nexusgaming.demo",
    "phone": "+91 91111 22222",
    "gstNumber": "24ABCDE1234P1Z5",
    "address": "Alpha Mall, 3rd Floor",
    "city": "Ahmedabad",
    "state": "Gujarat",
    "postalCode": "380015",
    "country": "India",
    "status": "active",
    "createdAt": "2024-02-01T10:00:00Z",
    "totalMachines": 15,
    "monthlyRevenue": 2161200,
    "pendingSettlement": 0
  },
  {
    "id": "part-2",
    "distributorId": "dist-1",
    "businessName": "Orion Arcades",
    "contactPerson": "Neha Desai",
    "email": "neha@orionarcades.demo",
    "phone": "+91 92222 33333",
    "gstNumber": "29FGHIJ1234P2Z4",
    "address": "Forum Mall, Level 4",
    "city": "Bengaluru",
    "state": "Karnataka",
    "postalCode": "560021",
    "country": "India",
    "status": "active",
    "createdAt": "2024-05-12T14:30:00Z",
    "totalMachines": 20,
    "monthlyRevenue": 3316400,
    "pendingSettlement": 0
  },
  {
    "id": "part-3",
    "distributorId": "dist-2",
    "businessName": "Star Play Zone",
    "contactPerson": "Amit Joshi",
    "email": "amit@starplay.demo",
    "phone": "+91 93333 44444",
    "gstNumber": "27KLMNO1234P3Z3",
    "address": "Infinity Mall, Andheri",
    "city": "Mumbai",
    "state": "Maharashtra",
    "postalCode": "400053",
    "country": "India",
    "status": "active",
    "createdAt": "2024-08-20T09:15:00Z",
    "totalMachines": 10,
    "monthlyRevenue": 1550200,
    "pendingSettlement": 0
  }
];

export const MOCK_COMPANY_DISTRIBUTOR_AGREEMENTS: CompanyDistributorAgreement[] = [
  {
    "id": "cda-1-v1",
    "distributorId": "dist-1",
    "companySharePercent": 40,
    "distributorSharePercent": 60,
    "effectiveFrom": "2024-01-15T00:00:00Z",
    "effectiveTo": null,
    "version": 1,
    "status": "active",
    "notes": "Standard 40/60 agreement for FunZone",
    "documentUrl": "#",
    "createdAt": "2024-01-10T10:00:00Z"
  },
  {
    "id": "cda-2-v1",
    "distributorId": "dist-2",
    "companySharePercent": 50,
    "distributorSharePercent": 50,
    "effectiveFrom": "2024-03-22T00:00:00Z",
    "effectiveTo": null,
    "version": 1,
    "status": "active",
    "notes": "Standard market entry",
    "documentUrl": "#",
    "createdAt": "2024-03-15T10:00:00Z"
  },
  {
    "id": "cda-3-v1",
    "distributorId": "dist-3",
    "companySharePercent": 35,
    "distributorSharePercent": 65,
    "effectiveFrom": "2025-06-05T00:00:00Z",
    "effectiveTo": null,
    "version": 1,
    "status": "active",
    "notes": "Premium distributor tier",
    "documentUrl": "#",
    "createdAt": "2025-06-01T10:00:00Z"
  }
];

export const MOCK_DISTRIBUTOR_PARTNER_AGREEMENTS: DistributorPartnerAgreement[] = [
  {
    "id": "dpa-1-v1",
    "distributorId": "dist-1",
    "partnerId": "part-1",
    "distributorSharePercent": 30,
    "partnerSharePercent": 70,
    "effectiveFrom": "2024-02-01T00:00:00Z",
    "effectiveTo": null,
    "version": 1,
    "status": "active",
    "notes": "Nexus Gaming 30/70 split",
    "documentUrl": "#",
    "createdAt": "2024-01-25T10:00:00Z"
  },
  {
    "id": "dpa-2-v1",
    "distributorId": "dist-1",
    "partnerId": "part-2",
    "distributorSharePercent": 40,
    "partnerSharePercent": 60,
    "effectiveFrom": "2024-05-12T00:00:00Z",
    "effectiveTo": null,
    "version": 1,
    "status": "active",
    "notes": "Orion Arcades 40/60 split",
    "documentUrl": "#",
    "createdAt": "2024-05-01T10:00:00Z"
  },
  {
    "id": "dpa-3-v1",
    "distributorId": "dist-2",
    "partnerId": "part-3",
    "distributorSharePercent": 35,
    "partnerSharePercent": 65,
    "effectiveFrom": "2024-08-20T00:00:00Z",
    "effectiveTo": null,
    "version": 1,
    "status": "active",
    "notes": "Star Play Zone split",
    "documentUrl": "#",
    "createdAt": "2024-08-15T10:00:00Z"
  }
];

export const MOCK_DISTRIBUTORS = [
  {
    "id": "dist-1",
    "businessName": "FunZone Distribution",
    "contactPerson": "Arjun Mehta",
    "email": "arjun@funzonedistribution.demo",
    "phone": "+91 98765 43210",
    "gstNumber": "29ABCDE1234F1Z5",
    "address": "123 Tech Park, Block C",
    "city": "Bengaluru",
    "state": "Karnataka",
    "postalCode": "560001",
    "country": "India",
    "status": "active",
    "createdAt": "2024-01-15T10:00:00Z",
    "totalMachines": 35,
    "monthlyRevenue": 5477600,
    "pendingSettlement": 469980
  },
  {
    "id": "dist-2",
    "businessName": "PlayWorks Entertainment",
    "contactPerson": "Priya Sharma",
    "email": "priya@playworks.demo",
    "phone": "+91 91234 56780",
    "gstNumber": "27XYZDE1234F2Z4",
    "address": "45 Hub Mall, Level 2",
    "city": "Mumbai",
    "state": "Maharashtra",
    "postalCode": "400001",
    "country": "India",
    "status": "active",
    "createdAt": "2024-03-22T14:30:00Z",
    "totalMachines": 10,
    "monthlyRevenue": 1550200,
    "pendingSettlement": 0
  },
  {
    "id": "dist-3",
    "businessName": "Metro Amusements",
    "contactPerson": "Sanjay Gupta",
    "email": "sanjay@metroamuse.demo",
    "phone": "+91 90001 10002",
    "gstNumber": "33FGHIJ1234F4Z2",
    "address": "Anna Salai",
    "city": "Chennai",
    "state": "Tamil Nadu",
    "postalCode": "600002",
    "country": "India",
    "status": "active",
    "createdAt": "2025-06-05T11:45:00Z",
    "totalMachines": 5,
    "monthlyRevenue": 1017900,
    "pendingSettlement": 0
  }
];
