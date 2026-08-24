import React from 'react';
import { Outlet } from 'react-router-dom';
import { AppShell } from './AppShell';
import { LayoutDashboard, MonitorSmartphone, ShoppingCart, IndianRupee, FileText, CreditCard, PieChart, Headphones, Shield, User, Settings } from 'lucide-react';

const navigation = [
  { name: 'Overview', href: '/partner/dashboard', icon: <LayoutDashboard /> },
  { name: 'Kiosks', href: '/partner/machines', icon: <MonitorSmartphone /> },
  { name: 'Orders', href: '/partner/orders', icon: <ShoppingCart /> },
  { name: 'Revenue', href: '/partner/revenue', icon: <IndianRupee /> },
  { name: 'Settlements', href: '/partner/settlements', icon: <FileText /> },
  { name: 'Payments', href: '/partner/payments', icon: <CreditCard /> },
  { name: 'Reports', href: '/partner/reports', icon: <PieChart /> },
  { name: 'Support', href: '/partner/support', icon: <Headphones /> },
  { name: 'Audit Logs', href: '/partner/audit', icon: <Shield /> },
  { name: 'Settings', href: '/partner/settings', icon: <Settings /> },
  { name: 'Profile', href: '/partner/profile', icon: <User /> },
];

export function PartnerShell() {
  return (
    <AppShell navigation={navigation} title="Partner">
      <Outlet />
    </AppShell>
  );
}
