import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { AreaChart, Area, XAxis, YAxis, ResponsiveContainer, ReferenceDot, Tooltip } from 'recharts';
import { VisitData } from '@/types/Trainerdashboard';

interface AverageVisitsChartProps {
  data: VisitData[];
  period: 'Weekly' | 'Monthly';
  peakValue: number;
  onPeriodChange: (period: 'Weekly' | 'Monthly') => void;
}

export const AverageVisitsChart: React.FC<AverageVisitsChartProps> = ({
  data,
  period,
  peakValue,
  onPeriodChange
}) => {
  const peakData = data.find(d => d.peak);

  // Custom tooltip component
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {     
      return (
        <div className="bg-gray-900 text-white px-3 py-2 rounded-lg shadow-lg border">
          <p className="text-sm font-medium">{label}</p>
          <p className="text-sm">
            <span className="text-[#FF4909]">Visits: </span>
            {payload[0].value}
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <Card className="bg-white border border-gray-200">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
        <CardTitle className="text-base md:text-lg font-semibold">Average visits</CardTitle>
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
        <div className="h-64 w-[130%] md:w-full -ml-14 md:ml-0 relative">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
              <defs>
                <linearGradient id="visitGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#FF4909" stopOpacity={0.8}/>
                  <stop offset="95%" stopColor="#FF4909" stopOpacity={0.1}/>
                </linearGradient>
              </defs>
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
                domain={[0, 100]}
              />
              <Tooltip 
                content={<CustomTooltip />}
                cursor={{ stroke: '#FF4909', strokeWidth: 1, strokeDasharray: '5 5' }}
              />
              <Area
                type="monotone"
                dataKey="visits"
                stroke="#FF4909"
                strokeWidth={2}
                fillOpacity={1}
                fill="url(#visitGradient)"
              />
              {peakData && (
                <>
                  <ReferenceDot
                    x={peakData.day}
                    y={peakData.visits}
                    r={4}
                    fill="#FF4909"
                    stroke="#fff"
                    strokeWidth={2}
                  />
                </>
              )}
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
};