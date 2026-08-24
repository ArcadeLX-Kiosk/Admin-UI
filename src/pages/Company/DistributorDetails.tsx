import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Edit, AlertCircle, Building2 } from 'lucide-react';
import { useOrg } from '../../mock/orgContext';
import { Button } from '../../components/ui/Button';
import { Card, CardHeader, CardTitle, CardContent } from '../../components/ui/Card';
import { OrgStatusBadge, AgreementStatusBadge } from '../../components/ui/StatusBadges';
import { ShareBreakdown } from '../../components/agreements/ShareBreakdown';
import { Modal } from '../../components/ui/Modal';
import { Input } from '../../components/ui/Input';

export function DistributorDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { distributors, companyDistributorAgreements, addCompanyDistributorAgreement } = useOrg();
  
  const distributor = distributors.find(d => d.id === id);
  const agreements = companyDistributorAgreements.filter(a => a.distributorId === id).sort((a, b) => b.version - a.version);
  const activeAgreement = agreements.find(a => a.status === 'active');

  const [isAgreementModalOpen, setIsAgreementModalOpen] = useState(false);
  const [companyShare, setCompanyShare] = useState('40');
  const [distributorShare, setDistributorShare] = useState('60');
  const [agreementError, setAgreementError] = useState('');

  if (!distributor) {
    return <div className="p-8 text-center text-slate-500">Distributor not found.</div>;
  }

  const handleCreateAgreement = () => {
    const cShare = Number(companyShare);
    const dShare = Number(distributorShare);

    if (cShare + dShare !== 100) {
      setAgreementError('Company share and Distributor share must equal 100%.');
      return;
    }
    
    setAgreementError('');
    addCompanyDistributorAgreement({
      distributorId: distributor.id,
      companySharePercent: cShare,
      distributorSharePercent: dShare,
      effectiveFrom: new Date().toISOString(),
      effectiveTo: null,
      notes: 'Updated agreement version via demo',
      documentUrl: '#',
    });
    setIsAgreementModalOpen(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="sm" onClick={() => navigate('/company/distributors')}>
          <ArrowLeft className="h-4 w-4 mr-2" /> Back
        </Button>
        <div className="flex-1">
          <h1 className="text-2xl font-bold text-slate-900">{distributor.businessName}</h1>
          <div className="flex items-center gap-3 mt-1 text-sm text-slate-500">
            <span>ID: {distributor.id}</span>
            <OrgStatusBadge status={distributor.status} />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Info */}
        <div className="space-y-6 lg:col-span-1">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                Business Info
                <Button variant="ghost" size="sm"><Edit className="h-4 w-4" /></Button>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <p className="text-xs text-slate-500">Contact Person</p>
                <p className="font-medium">{distributor.contactPerson}</p>
              </div>
              <div>
                <p className="text-xs text-slate-500">Email</p>
                <p className="font-medium">{distributor.email}</p>
              </div>
              <div>
                <p className="text-xs text-slate-500">Phone</p>
                <p className="font-medium">{distributor.phone}</p>
              </div>
              <div>
                <p className="text-xs text-slate-500">GST Number</p>
                <p className="font-medium">{distributor.gstNumber}</p>
              </div>
              <div>
                <p className="text-xs text-slate-500">Address</p>
                <p className="font-medium">{distributor.address}, {distributor.city}</p>
                <p className="text-sm text-slate-700">{distributor.state}, {distributor.postalCode}</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Column: Agreement & Stats */}
        <div className="space-y-6 lg:col-span-2">
          {/* Agreement Section */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle>Company Agreement</CardTitle>
              <Button size="sm" onClick={() => setIsAgreementModalOpen(true)}>
                New Agreement Version
              </Button>
            </CardHeader>
            <CardContent>
              {activeAgreement ? (
                <div className="space-y-6">
                  <div className="flex items-center gap-2 mb-4">
                    <AgreementStatusBadge status={activeAgreement.status} />
                    <span className="text-sm text-slate-500">Version {activeAgreement.version} • Effective: {new Date(activeAgreement.effectiveFrom).toLocaleDateString()}</span>
                  </div>
                  
                  <ShareBreakdown 
                    party1Name="Company"
                    party1Share={activeAgreement.companySharePercent}
                    party2Name="Distributor"
                    party2Share={activeAgreement.distributorSharePercent}
                  />
                  
                  <div className="text-sm text-slate-500 bg-slate-50 p-3 rounded-md mt-4 flex items-start">
                    <AlertCircle className="h-4 w-4 mr-2 mt-0.5 flex-shrink-0" />
                    <p>This agreement dictates the revenue split between the Company and the Distributor. Partner agreements are private to the Distributor.</p>
                  </div>
                </div>
              ) : (
                <div className="text-center py-6 text-slate-500">
                  <p>No active agreement found.</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Agreement History */}
          <Card>
            <CardHeader>
              <CardTitle>Agreement History</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {agreements.length === 0 ? (
                  <p className="text-sm text-slate-500">No history available.</p>
                ) : (
                  agreements.map(agr => (
                    <div key={agr.id} className="flex items-center justify-between p-3 border border-slate-100 rounded-md">
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-medium text-sm">Version {agr.version}</span>
                          <AgreementStatusBadge status={agr.status} />
                        </div>
                        <p className="text-xs text-slate-500">
                          {new Date(agr.effectiveFrom).toLocaleDateString()} - {agr.effectiveTo ? new Date(agr.effectiveTo).toLocaleDateString() : 'Present'}
                        </p>
                      </div>
                      <div className="text-right text-sm">
                        <span className="text-slate-600">Company: {agr.companySharePercent}%</span>
                        <br/>
                        <span className="text-slate-600">Distributor: {agr.distributorSharePercent}%</span>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      <Modal
        isOpen={isAgreementModalOpen}
        onClose={() => setIsAgreementModalOpen(false)}
        title="Create New Agreement Version"
        footer={
          <>
            <Button variant="outline" onClick={() => setIsAgreementModalOpen(false)}>Cancel</Button>
            <Button onClick={handleCreateAgreement}>Save Agreement</Button>
          </>
        }
      >
        <div className="space-y-4">
          {agreementError && (
            <div className="p-3 bg-red-50 text-red-600 text-sm rounded-md border border-red-100">
              {agreementError}
            </div>
          )}
          
          <div className="bg-slate-50 p-4 rounded-md flex items-center justify-between mb-4">
            <span className="font-medium">Total Machine Revenue</span>
            <span className="font-bold">100%</span>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <Input 
              label="Company Share (%)" 
              type="number"
              value={companyShare}
              onChange={(e) => setCompanyShare(e.target.value)}
            />
            <Input 
              label="Distributor Share (%)" 
              type="number"
              value={distributorShare}
              onChange={(e) => setDistributorShare(e.target.value)}
            />
          </div>
          
          <div className="pt-4 border-t border-slate-100">
            <ShareBreakdown 
              party1Name="Company"
              party1Share={Number(companyShare) || 0}
              party2Name="Distributor"
              party2Share={Number(distributorShare) || 0}
            />
          </div>
        </div>
      </Modal>
    </div>
  );
}
