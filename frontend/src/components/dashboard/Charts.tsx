// components/dashboard/Charts.tsx
"use client";

import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
} from "recharts";
import { MoveUpIcon } from "lucide-react";
import { IncomeRecord, SessionBreakdown } from "@/types/admin/dashboard";



interface DonutChartProps {
  data: SessionBreakdown[];
}

// Donut Chart Component
const DonutChart: React.FC<DonutChartProps> = ({ data }) => {
  // const total = pieData.reduce((sum, entry) => sum + entry.value, 0);

  return (
    <Card className="border-0 shadow-sm">
      <CardHeader>
        <div className="flex items-center justify-between border-b-2 pb-3">
          <CardTitle className="text-base lg:text-lg font-semibold">
            Session Breakdown
          </CardTitle>
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col items-center justify-between">
          {/* Donut Chart */}
          <div className="w-48 h-48 mb-4 lg:mb-0">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={data}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={90}
                  paddingAngle={2}
                  dataKey="total_sessions"
                >
                  {data.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={
                        entry.session_name === "Virtual Training"
                          ? "#3B82F6" // Blue
                          : entry.session_name === "Mindset Training"
                          ? "#F59E0B" // Orange
                          : entry.session_name === "In Person Training"
                          ? "#EF4444" // Red
                          : "#808080" // Default value if none match
                      }
                    />
                  ))}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
          </div>

          {/* Legend and Stats */}
          <div className="flex-1 w-full mt-6">
            <div className="space-y-4">
              <div className="flex justify-between items-center px-3 lg:px-6 py-2 bg-[#F5F6F7]">
                <p className="text-xs lg:text-base">Session name</p>
                <p className="text-xs lg:text-base">Total Sessions</p>
                <p className="text-xs lg:text-base">Inceate Rate</p>
              </div>
              {data.map((item, index) => (
                <div
                  key={index}
                  className="grid grid-cols-3 items-center justify-between px-2 lg:px-4"
                >
                  <div className="flex items-center">
                    <div
                      className={`w-3 h-3 rounded-full mr-3 
                        
                        ${
                          item.session_name === "Virtual Training" &&
                          "bg-[#3B82F6]"
                        }
                        ${
                          item.session_name === "Mindset Training" &&
                          "bg-[#F59E0B]"
                        }
                        ${
                          item.session_name === "In Person Training" &&
                          "bg-[#EF4444]"
                        }
                      `}
                    />
                    <span className="text-xs lg:text-sm text-gray-600">
                      {item.session_name}
                    </span>
                  </div>
                  <div className=" min-w-28">
                    <h3 className="text-xs lg:text-sm font-semibold text-center ">
                      {item.total_sessions}
                    </h3>
                  </div>

                  <p className="text-xs lg:text-sm text-green-600 text-end">
                    {item.increase_rate}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

interface BarChartComponentProps {
  data: IncomeRecord[];
}

// Bar Chart Component
const BarChartComponent: React.FC<BarChartComponentProps> = ({ data }) => {
  const lastObject = data.length - 1;

  const changeRate = data[lastObject].change_rate;

  return (
    <Card className="border-0 shadow-sm">
      <CardHeader>
        <CardTitle className="flex items-start justify-between">
          <div>
            <h3 className="text-sm text-[#626C70]">Income Chart</h3>
          </div>
          <h4
            className={`flex text-sm items-center gap-0 ${
              changeRate > 0 ? "text-[#0FAF62]" : "text-red-500"
            } `}
          >
            <MoveUpIcon size={16} stroke="#0FAF62" /> {changeRate}
          </h4>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={data}
              margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
            >
              <XAxis
                dataKey="month"
                axisLine={false}
                tickLine={false}
                tick={{ fill: "#808080", fontSize: 16 }}
              />
              <YAxis hide />
              <Tooltip
                contentStyle={{
                  backgroundColor: "white",
                  border: "1px solid #e5e7eb",
                  borderRadius: "6px",
                }}
              />
              <Bar
                dataKey="total_income"
                fill="#F15A24"
                radius={[4, 4, 0, 0]}
                activeBar={false}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
};

export { DonutChart, BarChartComponent };
