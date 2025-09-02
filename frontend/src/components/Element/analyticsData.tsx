import React from 'react';
import { Card, CardContent } from '@/components/ui/card';

interface AnalyticsData {
  id: string;
  title: string;
  value: string;
  change?: string;
  changeType?: 'positive' | 'negative' | 'neutral';
}

interface AnalyticsCardProps {
  data: AnalyticsData;
}

const AnalyticsCard: React.FC<AnalyticsCardProps> = ({ data }) => {
  const getChangeColor = (changeType?: 'positive' | 'negative' | 'neutral') => {
    switch (changeType) {
      case 'positive':
        return 'text-green-500';
      case 'negative':
        return 'text-red-500';
      case 'neutral':
        return 'text-gray-500';
      default:
        return 'text-gray-500';
    }
  };

  return (
    <Card className="p-4 bg-white border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
      <CardContent className="p-0">
        <div className="space-y-9">
          <h3 className="text-sm font-medium text-gray-600 leading-tight">
            {data.title}
          </h3>
          <div className="flex items-end justify-between">
            <span className="text-2xl font-bold text-gray-900">
              {data.value}
            </span>
            {data.change && (
              <span className={`text-xs font-medium ${getChangeColor(data.changeType)}`}>
                {data.change}
              </span>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default AnalyticsCard;