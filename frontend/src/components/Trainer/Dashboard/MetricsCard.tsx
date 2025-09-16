import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { TrendingUp, TrendingDown } from 'lucide-react';

interface MetricsCardProps {
  title: string;
  value: string | number;
  change: number;
  icon: React.ReactNode;
  variant?: 'default' | 'danger';
}

export const MetricsCard: React.FC<MetricsCardProps> = ({
  title,
  value,
  change,
  icon,
  variant = 'default'
}) => {
  const isPositive = change > 0;
  const changeColor = variant === 'danger' 
    ? (isPositive ? 'text-red-500' : 'text-green-500')
    : (isPositive ? 'text-green-500' : 'text-red-500');

  return (
    <Card className="p-4 bg-white border border-gray-200 hover:shadow-md transition-shadow">
      <CardContent className="p-0">
        <div className="flex items-center justify-between mb-3">
          <span className="text-sm text-gray-600 font-medium">{title}</span>
          <div className="p-2 rounded-lg bg-gray-50">
            {icon}
          </div>
        </div>
        <div className="flex items-end justify-between">
          <span className="text-2xl font-bold text-gray-900">{value}</span>
          <div className={`flex items-center gap-1 text-sm font-medium ${changeColor}`}>
            {isPositive ? (
              <TrendingUp className="h-4 w-4" />
            ) : (
              <TrendingDown className="h-4 w-4" />
            )}
            {isPositive ? '+' : ''}{change}%
          </div>
        </div>
      </CardContent>
    </Card>
  );
};