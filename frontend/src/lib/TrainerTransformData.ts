import { ChartData } from "@/types/Trainerdashboard";

export function trainerTransformData(
    rawData: Record<string, number>,
    type: "Weekly" | "Monthly"
  ): ChartData[] {
    if (!rawData) return [];
    
    return Object.entries(rawData).map(([date, value]) => ({
      day: type === "Weekly" 
        ? new Date(date).toLocaleDateString("en-US", { weekday: "short" }) 
        : new Date(date).toLocaleDateString("en-US", { month: "short", day: "numeric" }),
      value,
    }));
  }