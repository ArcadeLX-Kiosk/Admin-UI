import React, { createContext, useContext, useState, ReactNode } from 'react';
import { 
  Distributor, Partner, CompanyDistributorAgreement, DistributorPartnerAgreement 
} from '../types/organization';
import { 
  MOCK_DISTRIBUTORS, MOCK_PARTNERS, MOCK_COMPANY_DISTRIBUTOR_AGREEMENTS, MOCK_DISTRIBUTOR_PARTNER_AGREEMENTS 
} from './data';

interface OrgContextType {
  distributors: Distributor[];
  partners: Partner[];
  companyDistributorAgreements: CompanyDistributorAgreement[];
  distributorPartnerAgreements: DistributorPartnerAgreement[];
  
  // Company actions
  addDistributor: (dist: Omit<Distributor, 'id' | 'createdAt' | 'totalMachines' | 'monthlyRevenue' | 'pendingSettlement'>) => void;
  updateDistributor: (id: string, dist: Partial<Distributor>) => void;
  addCompanyDistributorAgreement: (agreement: Omit<CompanyDistributorAgreement, 'id' | 'createdAt' | 'version' | 'status'>) => void;
  
  // Distributor actions
  addPartner: (partner: Omit<Partner, 'id' | 'createdAt' | 'totalMachines' | 'monthlyRevenue' | 'pendingSettlement'>) => void;
  updatePartner: (id: string, partner: Partial<Partner>) => void;
  addDistributorPartnerAgreement: (agreement: Omit<DistributorPartnerAgreement, 'id' | 'createdAt' | 'version' | 'status'>) => void;
}

const OrgContext = createContext<OrgContextType | undefined>(undefined);

export const OrgProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [distributors, setDistributors] = useState<Distributor[]>(MOCK_DISTRIBUTORS as Distributor[]);
  const [partners, setPartners] = useState<Partner[]>(MOCK_PARTNERS as Partner[]);
  const [companyDistributorAgreements, setCompanyDistributorAgreements] = useState<CompanyDistributorAgreement[]>(MOCK_COMPANY_DISTRIBUTOR_AGREEMENTS);
  const [distributorPartnerAgreements, setDistributorPartnerAgreements] = useState<DistributorPartnerAgreement[]>(MOCK_DISTRIBUTOR_PARTNER_AGREEMENTS);

  const addDistributor = (data: Omit<Distributor, 'id' | 'createdAt' | 'totalMachines' | 'monthlyRevenue' | 'pendingSettlement'>) => {
    const newDist: Distributor = {
      ...data,
      id: `dist-${Date.now()}`,
      createdAt: new Date().toISOString(),
      totalMachines: 0,
      monthlyRevenue: 0,
      pendingSettlement: 0,
    };
    setDistributors([...distributors, newDist]);
  };

  const updateDistributor = (id: string, updates: Partial<Distributor>) => {
    setDistributors(distributors.map(d => d.id === id ? { ...d, ...updates } : d));
  };

  const addCompanyDistributorAgreement = (data: Omit<CompanyDistributorAgreement, 'id' | 'createdAt' | 'version' | 'status'>) => {
    // Find active agreement and expire it
    setCompanyDistributorAgreements(prev => {
      let currentVersion = 0;
      const updated = prev.map(a => {
        if (a.distributorId === data.distributorId) {
          if (a.version > currentVersion) currentVersion = a.version;
          if (a.status === 'active') {
            return { ...a, status: 'expired' as const, effectiveTo: new Date().toISOString() };
          }
        }
        return a;
      });

      const newAgreement: CompanyDistributorAgreement = {
        ...data,
        id: `cda-${Date.now()}`,
        version: currentVersion + 1,
        status: 'active',
        createdAt: new Date().toISOString(),
      };
      
      return [...updated, newAgreement];
    });
  };

  const addPartner = (data: Omit<Partner, 'id' | 'createdAt' | 'totalMachines' | 'monthlyRevenue' | 'pendingSettlement'>) => {
    const newPartner: Partner = {
      ...data,
      id: `part-${Date.now()}`,
      createdAt: new Date().toISOString(),
      totalMachines: 0,
      monthlyRevenue: 0,
      pendingSettlement: 0,
    };
    setPartners([...partners, newPartner]);
  };

  const updatePartner = (id: string, updates: Partial<Partner>) => {
    setPartners(partners.map(p => p.id === id ? { ...p, ...updates } : p));
  };

  const addDistributorPartnerAgreement = (data: Omit<DistributorPartnerAgreement, 'id' | 'createdAt' | 'version' | 'status'>) => {
    setDistributorPartnerAgreements(prev => {
      let currentVersion = 0;
      const updated = prev.map(a => {
        if (a.distributorId === data.distributorId && a.partnerId === data.partnerId) {
          if (a.version > currentVersion) currentVersion = a.version;
          if (a.status === 'active') {
            return { ...a, status: 'expired' as const, effectiveTo: new Date().toISOString() };
          }
        }
        return a;
      });

      const newAgreement: DistributorPartnerAgreement = {
        ...data,
        id: `dpa-${Date.now()}`,
        version: currentVersion + 1,
        status: 'active',
        createdAt: new Date().toISOString(),
      };
      
      return [...updated, newAgreement];
    });
  };

  return (
    <OrgContext.Provider value={{
      distributors, partners, companyDistributorAgreements, distributorPartnerAgreements,
      addDistributor, updateDistributor, addCompanyDistributorAgreement,
      addPartner, updatePartner, addDistributorPartnerAgreement
    }}>
      {children}
    </OrgContext.Provider>
  );
};

export const useOrg = () => {
  const context = useContext(OrgContext);
  if (context === undefined) {
    throw new Error('useOrg must be used within an OrgProvider');
  }
  return context;
};
