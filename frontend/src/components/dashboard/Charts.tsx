// components/dashboard/Charts.tsx
'use client'

import React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip } from 'recharts'
import { Button } from '@/components/ui/button'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { MoveUpIcon, Percent } from 'lucide-react'

// Donut Chart Data
const pieData = [
  { name: 'California', value: 547, color: '#3B82F6' },
  { name: 'Charlotte', value: 914, color: '#F59E0B' },
  { name: 'New Jersey', value: 414, color: '#EF4444' }
]

// Bar Chart Data
const barData = [
  { month: 'Jan', value: 400 },
  { month: 'Feb', value: 600 },
  { month: 'Mar', value: 800 },
  { month: 'Apr', value: 1000 },
  { month: 'May', value: 900 },
  { month: 'Jun', value: 1100 }
]

// Donut Chart Component
const DonutChart: React.FC = () => {
  const total = pieData.reduce((sum, entry) => sum + entry.value, 0)
  
  return (
    <Card className="border-0 shadow-sm">
      <CardHeader>
        <div className="flex items-center justify-between border-b-2 pb-3">
          <CardTitle className="text-base lg:text-lg font-semibold">Most Visited states</CardTitle>
          <Select defaultValue="month">
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="month">This Month</SelectItem>
              <SelectItem value="week">This Week</SelectItem>
              <SelectItem value="year">This Year</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col items-center justify-between">
          {/* Donut Chart */}
          <div className="w-48 h-48 mb-4 lg:mb-0">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={90}
                  paddingAngle={2}
                  dataKey="value"
                >
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
          </div>

          {/* Legend and Stats */}
          <div className="flex-1 w-full mt-6">
            <div className="space-y-4">
                <div className='flex justify-between items-center px-3 lg:px-6 py-2 bg-[#F5F6F7]'>
                    <p className='text-xs lg:text-base'>Page name</p>
                    <p className='text-xs lg:text-base'>Total Users</p>
                    <p className='text-xs lg:text-base'>Inceate Rate</p>
                </div>
              {pieData.map((item, index) => (
                <div key={index} className="grid grid-cols-3 items-center justify-between px-2 lg:px-4">
                  <div className="flex items-center">
                    <div
                      className="w-3 h-3 rounded-full mr-3"
                      style={{ backgroundColor: item.color }}
                    />
                    <span className="text-xs lg:text-sm text-gray-600">{item.name}</span>
                  </div>
                    <div className=' min-w-28'>
                        <h3 className="text-xs lg:text-sm font-semibold text-center ">{item.value}</h3>
                    </div>
                  
                    <p className="text-xs lg:text-sm text-green-600 text-end">81.94%</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

// Bar Chart Component
const BarChartComponent: React.FC = () => {
  return (
    <Card className="border-0 shadow-sm">
      <CardHeader>
        <CardTitle className="flex items-start justify-between">
            <div>
                <h3 className='text-sm text-[#626C70]'>Conversion Rate</h3>
                <h1 className='text-2xl font-semibold'>9.73%</h1>
            </div>
            <h4 className='flex text-sm items-center gap-0 text-[#0FAF62]'><MoveUpIcon size={16} stroke='#0FAF62'/> 3.5% Increase</h4>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={barData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
              <XAxis 
                dataKey="month" 
                axisLine={false}
                tickLine={false}
                tick={{ fill: '#808080', fontSize: 16 }}
              />
              <YAxis hide />
              <Tooltip 
                contentStyle={{
                  backgroundColor: 'white',
                  border: '1px solid #e5e7eb',
                  borderRadius: '6px'
                }}
              />
              <Bar 
                dataKey="value" 
                fill="#F15A24"
                radius={[4, 4, 0, 0]}
                activeBar={false}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  )
}

export { DonutChart, BarChartComponent }