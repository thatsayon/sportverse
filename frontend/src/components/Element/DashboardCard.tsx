import React from "react";
import { Card, CardContent } from "../ui/card";
import { cn } from "@/lib/utils";
import { LucideIcon } from "lucide-react";

interface DashboardCardProps {
  icon: LucideIcon;
  title: string;
  total: number;
  rate?: number;
  iconColor: string;
  bgColor: string;
}

const DashboardCard: React.FC<DashboardCardProps> = ({
  icon: Icon,  // Destructure and rename it to `Icon`
  title,
  total,
  rate,
  bgColor,
  iconColor
}) => {
  return (
    <div>
      <Card className="border-0 shadow-sm">
        <CardContent>
          <div className="mb-3">
            <div className={cn("p-2 rounded-full w-fit mb-2", bgColor)}>
              {/* Use `Icon` with capital letter */}
              <Icon className={cn("size-5", iconColor)} />
            </div>

            <h3 className="font-semibold text-[#949AA6]">{title}</h3>
          </div>
          <div className="flex items-center justify-between">
            <div className="text-2xl font-bold">{total}</div>
            {rate && (
              <div
                className={cn(
                  "text-sm font-medium",
                  rate > 0 ? "text-green-600" : "text-red-600"
                )}
              >
                {rate}%
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default DashboardCard;
