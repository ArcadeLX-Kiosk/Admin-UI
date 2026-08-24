import React from 'react';
import { useOrg } from '../../mock/orgContext';
import { useAuth } from '../../app/authContext';
import { Card, CardHeader, CardTitle, CardContent } from '../../components/ui/Card';
import { OrgStatusBadge, AgreementStatusBadge } from '../../components/ui/StatusBadges';
import { ShareBreakdown } from '../../components/agreements/ShareBreakdown';
import { AlertCircle } from 'lucide-react';

export function PartnerProfile() {
  const { user } = useAuth();
  const { partners, distributorPartnerAgreements } = useOrg();
  
  const partner = partners.find(p => p.id === user?.id);
  
  // The partner only sees their agreement with their specific distributor
  const agreements = distributorPartnerAgreements
    .filter(a => a.partnerId === user?.id)
    .sort((a, b) => b.version - a.version);
    
  const activeAgreement = agreements.find(a => a.status === 'active');

  if (!partner) {
    return <div className="p-8 text-center text-slate-500">Profile data not found.</div>;
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">My Profile</h1>
        <p className="text-sm text-slate-500">View your business information and active agreements.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="space-y-6 lg:col-span-1">
          <Card>
            <CardHeader>
              <CardTitle>Business Info</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-3">
                <OrgStatusBadge status={partner.status} />
              </div>
              <div>
                <p className="text-xs text-slate-500">Business Name</p>
                <p className="font-medium">{partner.businessName}</p>
              </div>
              <div>
                <p className="text-xs text-slate-500">Contact Person</p>
                <p className="font-medium">{partner.contactPerson}</p>
              </div>
              <div>
                <p className="text-xs text-slate-500">Email</p>
                <p className="font-medium">{partner.email}</p>
              </div>
              <div>
                <p className="text-xs text-slate-500">Phone</p>
                <p className="font-medium">{partner.phone}</p>
              </div>
              <div>
                <p className="text-xs text-slate-500">GST Number</p>
                <p className="font-medium">{partner.gstNumber}</p>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6 lg:col-span-2">
          {/* Agreement Section */}
          <Card>
            <CardHeader>
              <CardTitle>Active Agreement</CardTitle>
            </CardHeader>
            <CardContent>
              {activeAgreement ? (
                <div className="space-y-6">
                  <div className="flex items-center gap-2 mb-4">
                    <AgreementStatusBadge status={activeAgreement.status} />
                    <span className="text-sm text-slate-500">Version {activeAgreement.version} • Effective: {new Date(activeAgreement.effectiveFrom).toLocaleDateString()}</span>
                  </div>
                  
                  <ShareBreakdown 
                    party1Name="Distributor"
                    party1Share={activeAgreement.distributorSharePercent}
                    party2Name="You (Partner)"
                    party2Share={activeAgreement.partnerSharePercent}
                  />
                  
                  <div className="text-sm text-slate-500 bg-slate-50 p-3 rounded-md mt-4 flex items-start">
                    <AlertCircle className="h-4 w-4 mr-2 mt-0.5 flex-shrink-0" />
                    <p>This shows your revenue share agreement with your Distributor. If you have questions about your payout percentage, please contact your Distributor directly.</p>
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
                        <span className="text-slate-600">Distributor: {agr.distributorSharePercent}%</span>
                        <br/>
                        <span className="text-slate-600">You: {agr.partnerSharePercent}%</span>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
