import React from 'react';
import { Outlet } from 'react-router-dom';
import { AppShell } from './AppShell';
import { LayoutDashboard, Users, MonitorSmartphone, Package, ShoppingCart, IndianRupee, FileText, CreditCard, PieChart, Headphones, Shield, Settings } from 'lucide-react';

const navigation = [
  { name: 'Overview', href: '/company/dashboard', icon: <LayoutDashboard /> },
  { name: 'Distributors', href: '/company/distributors', icon: <Users /> },
  { name: 'Kiosks', href: '/company/machines', icon: <MonitorSmartphone /> },
  { name: 'Inventory', href: '/company/inventory', icon: <Package /> },
  { name: 'Orders', href: '/company/orders', icon: <ShoppingCart /> },
  { name: 'Revenue', href: '/company/revenue', icon: <IndianRupee /> },
  { name: 'Settlements', href: '/company/settlements', icon: <FileText /> },
  { name: 'Payments', href: '/company/payments', icon: <CreditCard /> },
  { name: 'Reports', href: '/company/reports', icon: <PieChart /> },
  { name: 'Support', href: '/company/support', icon: <Headphones /> },
  { name: 'Audit Logs', href: '/company/audit', icon: <Shield /> },
  { name: 'Settings', href: '/company/settings', icon: <Settings /> },
];

export function CompanyShell() {
  return (
    <AppShell navigation={navigation} title="Company">
      <Outlet />
    </AppShell>
  );
}
