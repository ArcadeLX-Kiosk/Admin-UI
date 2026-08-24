import React from 'react';
import { Outlet } from 'react-router-dom';
import { AppShell } from './AppShell';
import { LayoutDashboard, Users, MonitorSmartphone, Package, ShoppingCart, IndianRupee, FileText, CreditCard, PieChart, Headphones, Shield, Settings } from 'lucide-react';

const navigation = [
  { name: 'Overview', href: '/distributor/dashboard', icon: <LayoutDashboard /> },
  { name: 'Partners', href: '/distributor/partners', icon: <Users /> },
  { name: 'Kiosks', href: '/distributor/machines', icon: <MonitorSmartphone /> },
  { name: 'Orders', href: '/distributor/orders', icon: <ShoppingCart /> },
  { name: 'Revenue', href: '/distributor/revenue', icon: <IndianRupee /> },
  { name: 'Settlements', href: '/distributor/settlements', icon: <FileText /> },
  { name: 'Payments', href: '/distributor/payments', icon: <CreditCard /> },
  { name: 'Reports', href: '/distributor/reports', icon: <PieChart /> },
  { name: 'Support', href: '/distributor/support', icon: <Headphones /> },
  { name: 'Audit Logs', href: '/distributor/audit', icon: <Shield /> },
  { name: 'Settings', href: '/distributor/settings', icon: <Settings /> },
];

export function DistributorShell() {
  return (
    <AppShell navigation={navigation} title="Distributor">
      <Outlet />
    </AppShell>
  );
}
