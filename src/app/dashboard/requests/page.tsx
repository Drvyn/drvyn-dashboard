'use client';

import { useEffect, useState } from 'react';
import { generalRequestsApi } from "@/lib/api";
import { GeneralRequest } from "@/lib/types";
import RequestsDataTable from "@/components/requests/data-table";

export default function RequestsPage() {
  const [requests, setRequests] = useState<GeneralRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchRequests = async () => {
      try {
        setLoading(true);
        console.log('📝 Fetching general requests from backend...');
        
        const response = await generalRequestsApi.getAll();
        
        if (response.success && response.data) {
          setRequests(response.data.requests || []);
          console.log('✅ General requests loaded:', response.data.requests?.length || 0);
        } else {
          console.error('❌ Failed to load requests:', response.error);
          setError(response.error || 'Failed to fetch requests');
        }
      } catch (err) {
        console.error('❌ Error fetching requests:', err);
        setError('Failed to fetch requests. Please check your connection.');
      } finally {
        setLoading(false);
      }
    };

    fetchRequests();
  }, []);

  if (loading) {
    return (
      <div>
        <h1 className="text-2xl font-semibold text-primary mb-4">General Requests</h1>
        <div className="flex items-center justify-center h-64">
          <div className="text-lg">Loading requests...</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div>
        <h1 className="text-2xl font-semibold text-primary mb-4">General Requests</h1>
        <div className="flex items-center justify-center h-64">
          <div className="text-lg text-red-600">Error: {error}</div>
        </div>
      </div>
    );
  }

  return (
    <div>
        <h1 className="text-2xl font-semibold text-primary mb-4">General Requests</h1>
        <RequestsDataTable data={requests} />
    </div>
  );
}
