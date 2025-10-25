// components/request-status-chart.tsx
"use client"

import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from "recharts";
import { type Booking, type InsuranceRequest, type GeneralRequest, BookingStatus, InsuranceStatus, GeneralRequestStatus } from "@/lib/types";

interface RequestStatusChartProps {
  bookings: Booking[];
  insuranceRequests: InsuranceRequest[];
  generalRequests: GeneralRequest[];
}

const bookingStatusColors: Record<BookingStatus, string> = {
  pending: "hsl(var(--status-pending))",
  confirmed: "hsl(var(--status-confirmed))",
  completed: "hsl(var(--status-completed))",
  cancelled: "hsl(var(--status-cancelled))",
  "not-interested": "hsl(var(--status-not-interested))",
  "to-follow-up": "hsl(var(--status-to-follow-up))",
  "cold-enq": "hsl(var(--status-cold-enq))",
  "booking-confirmed": "hsl(var(--status-booking-confirmed))",
};

const insuranceStatusColors: Record<InsuranceStatus, string> = {
  new: "hsl(var(--status-new))",
  contacted: "hsl(var(--status-contacted))",
  completed: "hsl(var(--status-completed))",
  rejected: "hsl(var(--status-rejected))",
  "not-interested": "hsl(var(--status-not-interested))",
  "to-follow-up": "hsl(var(--status-to-follow-up))",
  "cold-enq": "hsl(var(--status-cold-enq))",
  "booking-confirmed": "hsl(var(--status-booking-confirmed))",
};

const generalRequestStatusColors: Record<GeneralRequestStatus, string> = {
  new: "hsl(var(--status-new))",
  "in-progress": "hsl(var(--status-in-progress))",
  resolved: "hsl(var(--status-resolved))",
  "not-interested": "hsl(var(--status-not-interested))",
  "to-follow-up": "hsl(var(--status-to-follow-up))",
  "cold-enq": "hsl(var(--status-cold-enq))",
  "booking-confirmed": "hsl(var(--status-booking-confirmed))",
};

const CustomTooltip = ({ active, payload }: any) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    return (
      <div className="rounded-lg border bg-background p-2 shadow-sm">
        <div className="grid grid-cols-2 gap-2">
          <div className="flex flex-col space-y-1">
            <span className="text-[10px] uppercase text-muted-foreground">{data.name}</span>
            <span className="font-bold text-muted-foreground">{data.value}</span>
          </div>
        </div>
      </div>
    );
  }

  return null;
};

export default function RequestStatusChart({ bookings, insuranceRequests, generalRequests }: RequestStatusChartProps) {
  
  const bookingData = Object.entries(
    bookings.reduce((acc, b) => {
      acc[b.status] = (acc[b.status] || 0) + 1;
      return acc;
    }, {} as Record<BookingStatus, number>)
  ).map(([name, value]) => ({ name: name as BookingStatus, value }));

  const insuranceData = Object.entries(
    insuranceRequests.reduce((acc, i) => {
      acc[i.status] = (acc[i.status] || 0) + 1;
      return acc;
    }, {} as Record<InsuranceStatus, number>)
  ).map(([name, value]) => ({ name: name as InsuranceStatus, value }));

  const generalData = Object.entries(
    generalRequests.reduce((acc, g) => {
      acc[g.status] = (acc[g.status] || 0) + 1;
      return acc;
    }, {} as Record<GeneralRequestStatus, number>)
  ).map(([name, value]) => ({ name: name as GeneralRequestStatus, value }));

  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="flex flex-col items-center">
            <h3 className="text-md font-medium mb-2 capitalize">Bookings</h3>
            <ResponsiveContainer width="100%" height={150}>
                <PieChart>
                    <Pie data={bookingData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={60} innerRadius={40}>
                        {bookingData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={bookingStatusColors[entry.name]} />
                        ))}
                    </Pie>
                    <Tooltip content={<CustomTooltip />} />
                </PieChart>
            </ResponsiveContainer>
        </div>
        <div className="flex flex-col items-center">
            <h3 className="text-md font-medium mb-2 capitalize">Insurance</h3>
            <ResponsiveContainer width="100%" height={150}>
                <PieChart>
                    <Pie data={insuranceData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={60} innerRadius={40}>
                        {insuranceData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={insuranceStatusColors[entry.name]} />
                        ))}
                    </Pie>
                    <Tooltip content={<CustomTooltip />} />
                </PieChart>
            </ResponsiveContainer>
        </div>
        <div className="flex flex-col items-center">
            <h3 className="text-md font-medium mb-2 capitalize">General</h3>
            <ResponsiveContainer width="100%" height={150}>
                <PieChart>
                    <Pie data={generalData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={60} innerRadius={40}>
                        {generalData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={generalRequestStatusColors[entry.name]} />
                        ))}
                    </Pie>
                     <Tooltip content={<CustomTooltip />} />
                </PieChart>
            </ResponsiveContainer>
        </div>
    </div>
  );
}