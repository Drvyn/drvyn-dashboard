"use client"

import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { type Booking } from "@/lib/types";
import { format, subDays, startOfDay } from "date-fns";

interface BookingTrendChartProps {
  data: Booking[];
}

export default function BookingTrendChart({ data }: BookingTrendChartProps) {
  // Filter for the last 10 days
  const tenDaysAgo = startOfDay(subDays(new Date(), 9));
  const filteredData = data.filter(booking => startOfDay(new Date(booking.date)) >= tenDaysAgo);

  const aggregatedData = filteredData.reduce((acc, booking) => {
    const date = format(new Date(booking.date), "MMM dd");
    const existing = acc.find(item => item.date === date);
    if (existing) {
      existing.count += 1;
    } else {
      acc.push({ date, count: 1 });
    }
    return acc;
  }, [] as { date: string; count: number }[]);
  
  const sortedData = aggregatedData.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

  return (
    <ResponsiveContainer width="100%" height={350}>
      <BarChart data={sortedData}>
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
        <Bar dataKey="count" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
  );
}