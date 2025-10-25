'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { dashboardApi, bookingsApi, insuranceRequestsApi, generalRequestsApi } from "@/lib/api";
import { Booking, GeneralRequest, InsuranceRequest } from "@/lib/types";
import { Calendar, ShieldCheck as ShieldCheckIcon, MessageSquare } from "lucide-react";
import RequestStatusChart from "@/components/dashboard/request-status-chart";
import CombinedTrendChart from "@/app/dashboard/combined-trend-chart"; 


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

  // Calculate totals based on user's request
  const totalAllRequests = stats.totalBookings + stats.totalInsuranceRequests + stats.totalCarRequests;
  const totalBookings = stats.totalBookings;
  const totalInsurance = stats.totalInsuranceRequests;


  return (
    <div className="flex flex-col gap-6">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {/* Card 1: Total All Requests */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total All Requests</CardTitle>
            <div className="p-2 bg-yellow-500/10 rounded-md">
              <MessageSquare className="h-4 w-4 text-yellow-500" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalAllRequests}</div>
            <p className="text-xs text-muted-foreground">All-time bookings, insurance, and general requests</p>
          </CardContent>
        </Card>
        
        {/* Card 2: Total Bookings */}
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

        {/* Card 3: Total Insurance Requests */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Insurance</CardTitle>
            <div className="p-2 bg-green-500/10 rounded-md">
              <ShieldCheckIcon className="h-4 w-4 text-green-500" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalInsurance}</div>
            <p className="text-xs text-muted-foreground">All-time insurance requests</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-1 lg:grid-cols-7">
        {/* --- MODIFIED SECTION --- */}
        {/* Replaced BookingTrendChart with CombinedTrendChart */}
        <Card className="lg:col-span-4">
          <CardHeader>
            <CardTitle>Last 10 Days Trends</CardTitle>
          </CardHeader>
          <CardContent className="pl-2">
            <CombinedTrendChart 
              bookings={bookings}
              insuranceRequests={insuranceRequests}
              generalRequests={generalRequests}
            />
          </CardContent>
        </Card>
        {/* --- END MODIFIED SECTION --- */}

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
      
       {/* --- REMOVED SECTION --- */}
       {/* Removed the old InsuranceTrendChart card from here */}
    </div>
  );
}