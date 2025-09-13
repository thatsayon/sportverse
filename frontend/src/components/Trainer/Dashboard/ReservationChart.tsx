import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Tooltip } from 'recharts';
import { ChartData } from '@/types/Trainerdashboard';

interface ReservationChartProps {
  data: ChartData[];
  period: 'Weekly' | 'Monthly';
  onPeriodChange: (period: 'Weekly' | 'Monthly') => void;
}

export const ReservationChart: React.FC<ReservationChartProps> = ({
  data,
  period,
  onPeriodChange
}) => {
  // Custom tooltip component
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-gray-900 text-white px-3 py-2 rounded-lg shadow-lg border">
          <p className="text-sm font-medium">{label}</p>
          <p className="text-sm">
            <span className="text-[#FF4909]">Revenue: </span>
            ${payload[0].value}
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <Card className="bg-white border border-gray-200">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
        <CardTitle className="text-lg font-semibold">Revenue</CardTitle>
        <div className="flex gap-2">
          <Button
            variant={period === 'Weekly' ? 'default' : 'outline'}
            size="sm"
            onClick={() => onPeriodChange('Weekly')}
            className={period === 'Weekly' ? 'bg-[#FF4909] hover:bg-[#FF4909]/90 py-2' : 'border-gray-300 text-gray-600 py-2'}
          >
            Weekly
          </Button>
          <Button
            variant={period === 'Monthly' ? 'default' : 'outline'}
            size="sm"
            onClick={() => onPeriodChange('Monthly')}
            className={period === 'Monthly' ? 'bg-[#FF4909] hover:bg-[#FF4909]/90 py-2' : 'border-gray-300 text-gray-600 py-2'}
          >
            Monthly
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="h-64 w-[125%] md:w-full -ml-10 md:ml-0">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data} margin={{ top: 20, right: 30, left: 0, bottom: 5 }}>
              <XAxis 
                dataKey="day" 
                axisLine={false}
                tickLine={false}
                tick={{ fontSize: 12, fill: '#6B7280' }}
              />
              <YAxis 
                axisLine={false}
                tickLine={false}
                tick={{ fontSize: 12, fill: '#6B7280' }}
                domain={[0, 120]}
              />
              <Tooltip 
                content={<CustomTooltip />}
                cursor={{ fill: 'rgba(255, 73, 9, 0.1)' }}
              />
              <Bar 
                dataKey="value" 
                fill="#FF4909" 
                radius={[4, 4, 0, 0]}
                maxBarSize={50}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
};