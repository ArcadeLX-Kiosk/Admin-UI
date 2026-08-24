export type OrganizationStatus = 'active' | 'inactive';
export type AgreementStatus = 'draft' | 'active' | 'expired' | 'terminated';

export interface Distributor {
  id: string;
  businessName: string;
  contactPerson: string;
  email: string;
  phone: string;
  gstNumber: string;
  address: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
  status: OrganizationStatus;
  createdAt: string;
  // Read-only conceptual aggregates for UI
  totalMachines: number;
  monthlyRevenue: number;
  pendingSettlement: number;
}

export interface Partner {
  id: string;
  distributorId: string;
  businessName: string;
  contactPerson: string;
  email: string;
  phone: string;
  gstNumber: string;
  address: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
  status: OrganizationStatus;
  createdAt: string;
  // Read-only conceptual aggregates for UI
  totalMachines: number;
  monthlyRevenue: number;
  pendingSettlement: number;
}

export interface CompanyDistributorAgreement {
  id: string;
  distributorId: string;
  companySharePercent: number;
  distributorSharePercent: number;
  effectiveFrom: string;
  effectiveTo: string | null;
  version: number;
  status: AgreementStatus;
  notes: string;
  documentUrl: string;
  createdAt: string;
}

export interface DistributorPartnerAgreement {
  id: string;
  distributorId: string;
  partnerId: string;
  distributorSharePercent: number;
  partnerSharePercent: number;
  effectiveFrom: string;
  effectiveTo: string | null;
  version: number;
  status: AgreementStatus;
  notes: string;
  documentUrl: string;
  createdAt: string;
}
