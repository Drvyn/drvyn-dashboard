'use client';

import { useEffect, useState } from 'react';
import { bookingsApi } from "@/lib/api";
import { Booking } from "@/lib/types";
import BookingsDataTable from "@/components/bookings/data-table";

export default function BookingsPage() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        setLoading(true);
        console.log('📋 Fetching bookings from backend...');
        
        const response = await bookingsApi.getAll();
        
        if (response.success && response.data) {
          setBookings(response.data.bookings || []);
          console.log('✅ Bookings loaded:', response.data.bookings?.length || 0);
        } else {
          console.error('❌ Failed to load bookings:', response.error);
          setError(response.error || 'Failed to fetch bookings');
        }
      } catch (err) {
        console.error('❌ Error fetching bookings:', err);
        setError('Failed to fetch bookings. Please check your connection.');
      } finally {
        setLoading(false);
      }
    };

    fetchBookings();
  }, []);

  if (loading) {
    return (
      <div>
        <h1 className="text-2xl font-semibold text-primary mb-4">Bookings</h1>
        <div className="flex items-center justify-center h-64">
          <div className="text-lg">Loading bookings...</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div>
        <h1 className="text-2xl font-semibold text-primary mb-4">Bookings</h1>
        <div className="flex items-center justify-center h-64">
          <div className="text-lg text-red-600">Error: {error}</div>
        </div>
      </div>
    );
  }

  return (
    <div>
        <h1 className="text-2xl font-semibold text-primary mb-4">Bookings</h1>
        <BookingsDataTable data={bookings} />
    </div>
  );
}
