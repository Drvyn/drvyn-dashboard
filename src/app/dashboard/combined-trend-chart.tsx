"use client"

import { Line, LineChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis, Legend } from "recharts";
import { type Booking, type InsuranceRequest, type GeneralRequest } from "@/lib/types";
import { format, subDays, eachDayOfInterval, startOfDay } from "date-fns";

interface CombinedTrendChartProps {
  bookings: Booking[];
  insuranceRequests: InsuranceRequest[];
  generalRequests: GeneralRequest[];
}

type DailyData = {
  date: string; // "MMM dd"
  totalBookings: number;
  totalInsurance: number;
  totalGeneral: number;
  totalAll: number;
};

export default function CombinedTrendChart({ bookings, insuranceRequests, generalRequests }: CombinedTrendChartProps) {
  const endDate = startOfDay(new Date());
  const startDate = startOfDay(subDays(endDate, 9)); // 10 days total including today

  // 1. Create a map of all dates in the last 10 days, initialized to 0 counts
  const dateMap = new Map<string, DailyData>();
  eachDayOfInterval({ start: startDate, end: endDate }).forEach(day => {
    const dateKey = format(day, "MMM dd");
    dateMap.set(dateKey, {
      date: dateKey,
      totalBookings: 0,
      totalInsurance: 0,
      totalGeneral: 0,
      totalAll: 0,
    });
  });

  // 2. Filter and aggregate bookings
  bookings
    .filter(b => startOfDay(new Date(b.date)) >= startDate)
    .forEach(b => {
      const dateKey = format(startOfDay(new Date(b.date)), "MMM dd");
      if (dateMap.has(dateKey)) {
        const dayData = dateMap.get(dateKey)!;
        dayData.totalBookings += 1;
        dayData.totalAll += 1;
      }
    });

  // 3. Filter and aggregate insurance requests
  insuranceRequests
    .filter(i => startOfDay(new Date(i.createdAt)) >= startDate)
    .forEach(i => {
      const dateKey = format(startOfDay(new Date(i.createdAt)), "MMM dd");
      if (dateMap.has(dateKey)) {
        const dayData = dateMap.get(dateKey)!;
        dayData.totalInsurance += 1;
        dayData.totalAll += 1;
      }
    });

  // 4. Filter and aggregate general requests
  generalRequests
    .filter(g => startOfDay(new Date(g.createdAt)) >= startDate)
    .forEach(g => {
      const dateKey = format(startOfDay(new Date(g.createdAt)), "MMM dd");
      if (dateMap.has(dateKey)) {
        const dayData = dateMap.get(dateKey)!;
        dayData.totalGeneral += 1;
        dayData.totalAll += 1;
      }
    });

  // 5. Convert map values to array
  const chartData = Array.from(dateMap.values());

  return (
    <ResponsiveContainer width="100%" height={350}>
      <LineChart data={chartData}>
        <CartesianGrid strokeDasharray="3 3" vertical={false} />
        <XAxis
          dataKey="date"
          stroke="#888888"
          fontSize={12}
          tickLine={false}
          axisLine={false}
        />
        <YAxis
          stroke="#888888"
          fontSize={12}
          tickLine={false}
          axisLine={false}
          allowDecimals={false}
        />
        <Tooltip
          contentStyle={{
            backgroundColor: 'hsl(var(--background))',
            border: '1px solid hsl(var(--border))',
            borderRadius: 'var(--radius)',
          }}
        />
        <Legend />
        <Line 
          type="monotone" 
          dataKey="totalAll" 
          name="Total All Requests" 
          stroke="hsl(var(--primary))" 
          strokeWidth={2} 
          dot={{ r: 4, fill: "hsl(var(--primary))" }} 
        />
        <Line 
          type="monotone" 
          dataKey="totalBookings" 
          name="Total Bookings" 
          stroke="hsl(var(--status-confirmed))" 
          strokeWidth={2} 
          dot={{ r: 4, fill: "hsl(var(--status-confirmed))" }} 
        />
        <Line 
          type="monotone" 
          dataKey="totalInsurance" 
          name="Total Insurance" 
          stroke="hsl(var(--status-completed))" 
          strokeWidth={2} 
          dot={{ r: 4, fill: "hsl(var(--status-completed))" }} 
        />
      </LineChart>
    </ResponsiveContainer>
  );
}