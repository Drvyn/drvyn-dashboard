"use client"

import { Line, LineChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { type InsuranceRequest } from "@/lib/types";
import { format, subDays, startOfDay } from "date-fns";

interface InsuranceTrendChartProps {
  data: InsuranceRequest[];
}

export default function InsuranceTrendChart({ data }: InsuranceTrendChartProps) {
  // Filter for the last 10 days
  const tenDaysAgo = startOfDay(subDays(new Date(), 9));
  const filteredData = data.filter(request => startOfDay(new Date(request.createdAt)) >= tenDaysAgo);

  const aggregatedData = filteredData.reduce((acc, request) => {
    const date = format(new Date(request.createdAt), "MMM dd");
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
      <LineChart data={sortedData}>
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
        <Line type="monotone" dataKey="count" stroke="hsl(var(--accent))" strokeWidth={2} dot={{ r: 4, fill: "hsl(var(--accent))" }} />
      </LineChart>
    </ResponsiveContainer>
  );
}