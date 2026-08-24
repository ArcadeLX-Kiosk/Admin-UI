import React from 'react';
import { Card, CardContent } from '../ui/Card';

interface StatCardProps {
  title: string;
  value: string | number;
  icon: any;
  description?: string;
  trend?: {
    value: number;
    isPositive: boolean;
  };
}

export function StatCard({ title, value, icon, description, trend }: StatCardProps) {
  const IconContent = React.isValidElement(icon) 
    ? icon 
    : (icon ? React.createElement(icon, { className: "h-4 w-4 text-slate-400" }) : null);

  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex items-center justify-between space-y-0 pb-2">
          <p className="text-sm font-medium text-slate-500">{title}</p>
          {IconContent}
        </div>
        <div className="flex flex-col gap-1 mt-2">
          <div className="text-2xl font-bold">{value}</div>
          {description && (
            <p className="text-xs text-slate-500">{description}</p>
          )}
          {trend && (
            <p className={`text-xs ${trend.isPositive ? 'text-green-600' : 'text-red-600'}`}>
              {trend.isPositive ? '+' : '-'}{trend.value}% from last month
            </p>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
