import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { Login } from './pages/Login';
import { ProtectedRoute } from './routes/ProtectedRoute';

import { CompanyShell } from './layouts/CompanyShell';
import { CompanyDashboard } from './pages/Company/Dashboard';
import { DistributorsList } from './pages/Company/DistributorsList';
import { DistributorDetails } from './pages/Company/DistributorDetails';
import { CreateDistributor } from './pages/Company/CreateDistributor';
import { MachinesList as CompanyMachinesList } from './pages/Company/MachinesList';
import { MachineDetails } from './pages/Company/MachineDetails';
import { CreateMachine } from './pages/Company/CreateMachine';
import { InventoryDashboard } from './pages/Company/Inventory';
import { CompanyOrdersList } from './pages/Company/OrdersList';
import { OrderDetails as CompanyOrderDetails } from './pages/Company/OrderDetails';
import { CreateOrder as CompanyCreateOrder } from './pages/Company/CreateOrder';
import { CompanyRevenueDashboard } from './pages/Company/Revenue';
import { CompanySettlementsList } from './pages/Company/Settlements';
import { CompanySettlementDetails } from './pages/Company/SettlementDetails';
import { CompanyPaymentsList } from './pages/Company/Payments';
import { CompanyReports } from './pages/Company/Reports';
import { CompanyAuditLogs } from './pages/Company/AuditLogs';
import { CompanySupport } from './pages/Company/Support';
import { CompanySettings } from './pages/Company/Settings';

import { DistributorShell } from './layouts/DistributorShell';
import { DistributorDashboard } from './pages/Distributor/Dashboard';
import { PartnersList } from './pages/Distributor/PartnersList';
import { PartnerDetails } from './pages/Distributor/PartnerDetails';
import { CreatePartner } from './pages/Distributor/CreatePartner';
import { DistributorMachines } from './pages/Distributor/MachinesList';
import { DistributorOrdersList } from './pages/Distributor/OrdersList';
import { DistributorOrderDetails } from './pages/Distributor/OrderDetails';
import { DistributorCreateRequest } from './pages/Distributor/CreateRequest';
import { DistributorCreatePartnerOrder } from './pages/Distributor/CreatePartnerOrder';
import { DistributorRevenueDashboard } from './pages/Distributor/Revenue';
import { DistributorSettlementsList } from './pages/Distributor/Settlements';
import { DistributorSettlementDetails } from './pages/Distributor/SettlementDetails';
import { DistributorPartnerSettlementsList } from './pages/Distributor/PartnerSettlements';
import { DistributorPartnerSettlementDetails } from './pages/Distributor/PartnerSettlementDetails';
import { DistributorPaymentsList } from './pages/Distributor/Payments';
import { DistributorReports } from './pages/Distributor/Reports';
import { DistributorAuditLogs } from './pages/Distributor/AuditLogs';
import { DistributorSupport } from './pages/Distributor/Support';
import { DistributorSettings } from './pages/Distributor/Settings';

import { PartnerShell } from './layouts/PartnerShell';
import { PartnerDashboard } from './pages/Partner/Dashboard';
import { PartnerProfile } from './pages/Partner/Profile';
import { PartnerMachines } from './pages/Partner/MachinesList';
import { PartnerOrdersList } from './pages/Partner/OrdersList';
import { PartnerOrderDetails } from './pages/Partner/OrderDetails';
import { PartnerCreateRequest } from './pages/Partner/CreateRequest';
import { PartnerRevenueDashboard } from './pages/Partner/Revenue';
import { PartnerSettlementsList } from './pages/Partner/Settlements';
import { PartnerSettlementDetails } from './pages/Partner/SettlementDetails';
import { PartnerPaymentsList } from './pages/Partner/Payments';
import { PartnerReports } from './pages/Partner/Reports';
import { PartnerAuditLogs } from './pages/Partner/AuditLogs';
import { PartnerSupport } from './pages/Partner/Support';
import { PartnerSettings } from './pages/Partner/Settings';

import { Placeholder } from './pages/Placeholder';

function App() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/login" replace />} />
      <Route path="/login" element={<Login />} />

      {/* Company Routes */}
      <Route element={<ProtectedRoute allowedRole="company" />}>
        <Route path="/company" element={<CompanyShell />}>
          <Route path="dashboard" element={<CompanyDashboard />} />
          <Route path="distributors" element={<DistributorsList />} />
          <Route path="distributors/new" element={<CreateDistributor />} />
          <Route path="distributors/:id" element={<DistributorDetails />} />
          <Route path="machines" element={<CompanyMachinesList />} />
          <Route path="machines/new" element={<CreateMachine />} />
          <Route path="machines/:id" element={<MachineDetails />} />
          <Route path="inventory" element={<InventoryDashboard />} />
          <Route path="revenue" element={<CompanyRevenueDashboard />} />
          <Route path="settlements" element={<CompanySettlementsList />} />
          <Route path="settlements/:id" element={<CompanySettlementDetails />} />
          <Route path="payments" element={<CompanyPaymentsList />} />
          <Route path="orders" element={<CompanyOrdersList />} />
          <Route path="orders/new" element={<CompanyCreateOrder />} />
          <Route path="orders/:id" element={<CompanyOrderDetails />} />
          <Route path="reports" element={<CompanyReports />} />
          <Route path="audit" element={<CompanyAuditLogs />} />
          <Route path="support" element={<CompanySupport />} />
          <Route path="settings" element={<CompanySettings />} />
          <Route path="*" element={<Placeholder />} />
        </Route>
      </Route>

      {/* Distributor Routes */}
      <Route element={<ProtectedRoute allowedRole="distributor" />}>
        <Route path="/distributor" element={<DistributorShell />}>
          <Route path="dashboard" element={<DistributorDashboard />} />
          <Route path="partners" element={<PartnersList />} />
          <Route path="partners/new" element={<CreatePartner />} />
          <Route path="partners/:id" element={<PartnerDetails />} />
          <Route path="machines" element={<DistributorMachines />} />
          <Route path="revenue" element={<DistributorRevenueDashboard />} />
          <Route path="settlements" element={<DistributorSettlementsList />} />
          <Route path="settlements/:id" element={<DistributorSettlementDetails />} />
          <Route path="partner-settlements" element={<DistributorPartnerSettlementsList />} />
          <Route path="partner-settlements/:id" element={<DistributorPartnerSettlementDetails />} />
          <Route path="payments" element={<DistributorPaymentsList />} />
          <Route path="orders" element={<DistributorOrdersList />} />
          <Route path="orders/new" element={<DistributorCreatePartnerOrder />} />
          <Route path="orders/new-request" element={<DistributorCreateRequest />} />
          <Route path="orders/:id" element={<DistributorOrderDetails />} />
          <Route path="reports" element={<DistributorReports />} />
          <Route path="audit" element={<DistributorAuditLogs />} />
          <Route path="support" element={<DistributorSupport />} />
          <Route path="settings" element={<DistributorSettings />} />
          <Route path="*" element={<Placeholder />} />
        </Route>
      </Route>

      {/* Partner Routes */}
      <Route element={<ProtectedRoute allowedRole="partner" />}>
        <Route path="/partner" element={<PartnerShell />}>
          <Route path="dashboard" element={<PartnerDashboard />} />
          <Route path="profile" element={<PartnerProfile />} />
          <Route path="machines" element={<PartnerMachines />} />
          <Route path="revenue" element={<PartnerRevenueDashboard />} />
          <Route path="settlements" element={<PartnerSettlementsList />} />
          <Route path="settlements/:id" element={<PartnerSettlementDetails />} />
          <Route path="payments" element={<PartnerPaymentsList />} />
          <Route path="orders" element={<PartnerOrdersList />} />
          <Route path="orders/new" element={<PartnerCreateRequest />} />
          <Route path="orders/:id" element={<PartnerOrderDetails />} />
          <Route path="reports" element={<PartnerReports />} />
          <Route path="audit" element={<PartnerAuditLogs />} />
          <Route path="support" element={<PartnerSupport />} />
          <Route path="settings" element={<PartnerSettings />} />
          <Route path="*" element={<Placeholder />} />
        </Route>
      </Route>

      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  );
}

export default App;
