'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { dashboardApi, bookingsApi, insuranceRequestsApi, generalRequestsApi } from "@/lib/api";
import { Booking, GeneralRequest, InsuranceRequest } from "@/lib/types";
import { Calendar, AlertTriangle, ShieldCheck as ShieldCheckIcon } from "lucide-react";
import BookingTrendChart from "@/components/dashboard/booking-trend-chart";
import RequestStatusChart from "@/components/dashboard/request-status-chart";
import InsuranceTrendChart from "@/components/dashboard/insurance-trend-chart";

interface DashboardStats {
  totalBookings: number;
  pendingBookings: number;
  completedBookings: number;
  totalRevenue: number;
  totalInsuranceRequests: number;
  pendingInsuranceRequests: number;
  totalCarRequests: number;
}

export default function DashboardPage() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [insuranceRequests, setInsuranceRequests] = useState<InsuranceRequest[]>([]);
  const [generalRequests, setGeneralRequests] = useState<GeneralRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        console.log('📊 Fetching dashboard data from backend...');
        
        // Fetch all data in parallel from your backend
        const [statsResponse, bookingsResponse, insuranceResponse, requestsResponse] = await Promise.all([
          dashboardApi.getStats(),
          bookingsApi.getAll(),
          insuranceRequestsApi.getAll(),
          generalRequestsApi.getAll()
        ]);

        // Handle stats
        if (statsResponse.success && statsResponse.data) {
          setStats(statsResponse.data);
          console.log('✅ Dashboard stats loaded');
        } else {
          console.warn('⚠️ Failed to load stats:', statsResponse.error);
        }

        // Handle bookings
        if (bookingsResponse.success && bookingsResponse.data) {
          setBookings(bookingsResponse.data.bookings || []);
          console.log('✅ Bookings loaded:', bookingsResponse.data.bookings?.length || 0);
        } else {
          console.warn('⚠️ Failed to load bookings:', bookingsResponse.error);
        }

        // Handle insurance requests
        if (insuranceResponse.success && insuranceResponse.data) {
          setInsuranceRequests(insuranceResponse.data.requests || []);
          console.log('✅ Insurance requests loaded:', insuranceResponse.data.requests?.length || 0);
        } else {
          console.warn('⚠️ Failed to load insurance requests:', insuranceResponse.error);
        }

        // Handle general requests
        if (requestsResponse.success && requestsResponse.data) {
          setGeneralRequests(requestsResponse.data.requests || []);
          console.log('✅ General requests loaded:', requestsResponse.data.requests?.length || 0);
        } else {
          console.warn('⚠️ Failed to load general requests:', requestsResponse.error);
        }

        // Check if any critical data failed to load
        if (!statsResponse.success) {
          setError('Failed to load dashboard statistics');
        }
      } catch (err) {
        console.error('❌ Failed to fetch dashboard data:', err);
        setError('Failed to fetch dashboard data. Please check your connection.');
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-lg">Loading dashboard...</div>
      </div>
    );
  }

  if (error || !stats) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-lg text-red-600">Error: {error || 'Failed to load dashboard data'}</div>
      </div>
    );
  }

  const totalBookings = stats.totalBookings;
  const pendingRequests = stats.pendingBookings + stats.pendingInsuranceRequests;
  const completedInsurance = stats.totalInsuranceRequests - stats.pendingInsuranceRequests;

  return (
    <div className="flex flex-col gap-6">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Bookings</CardTitle>
            <div className="p-2 bg-primary/10 rounded-md">
              <Calendar className="h-4 w-4 text-primary" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalBookings}</div>
            <p className="text-xs text-muted-foreground">All-time booking records</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Actions</CardTitle>
            <div className="p-2 bg-yellow-500/10 rounded-md">
              <AlertTriangle className="h-4 w-4 text-yellow-500" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{pendingRequests}</div>
            <p className="text-xs text-muted-foreground">Bookings and requests needing attention</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Completed Insurance</CardTitle>
            <div className="p-2 bg-green-500/10 rounded-md">
              <ShieldCheckIcon className="h-4 w-4 text-green-500" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{completedInsurance}</div>
            <p className="text-xs text-muted-foreground">Successfully processed insurance requests</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-1 lg:grid-cols-7">
        <Card className="lg:col-span-4">
          <CardHeader>
            <CardTitle>Booking Trends</CardTitle>
          </CardHeader>
          <CardContent className="pl-2">
            <BookingTrendChart data={bookings} />
          </CardContent>
        </Card>
        <Card className="lg:col-span-3">
          <CardHeader>
            <CardTitle>Request Status Overview</CardTitle>
          </CardHeader>
          <CardContent>
            <RequestStatusChart 
              bookings={bookings}
              insuranceRequests={insuranceRequests} 
              generalRequests={generalRequests} 
            />
          </CardContent>
        </Card>
      </div>
       <div className="grid gap-4 md:grid-cols-1">
        <Card>
          <CardHeader>
            <CardTitle>Insurance Request Trends</CardTitle>
          </CardHeader>
          <CardContent className="pl-2">
            <InsuranceTrendChart data={insuranceRequests} />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
