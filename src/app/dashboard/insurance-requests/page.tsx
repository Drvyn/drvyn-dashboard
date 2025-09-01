'use client';

import { useEffect, useState } from 'react';
import { insuranceRequestsApi } from "@/lib/api";
import { InsuranceRequest } from "@/lib/types";
import InsuranceDataTable from "@/components/insurance-requests/data-table";

export default function InsuranceRequestsPage() {
  const [insuranceRequests, setInsuranceRequests] = useState<InsuranceRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchInsuranceRequests = async () => {
      try {
        setLoading(true);
        console.log('🛡️ Fetching insurance requests from backend...');
        
        const response = await insuranceRequestsApi.getAll();
        
        if (response.success && response.data) {
          setInsuranceRequests(response.data.requests || []);
          console.log('✅ Insurance requests loaded:', response.data.requests?.length || 0);
        } else {
          console.error('❌ Failed to load insurance requests:', response.error);
          setError(response.error || 'Failed to fetch insurance requests');
        }
      } catch (err) {
        console.error('❌ Error fetching insurance requests:', err);
        setError('Failed to fetch insurance requests. Please check your connection.');
      } finally {
        setLoading(false);
      }
    };

    fetchInsuranceRequests();
  }, []);

  if (loading) {
    return (
      <div>
        <h1 className="text-2xl font-semibold text-primary mb-4">Insurance Requests</h1>
        <div className="flex items-center justify-center h-64">
          <div className="text-lg">Loading insurance requests...</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div>
        <h1 className="text-2xl font-semibold text-primary mb-4">Insurance Requests</h1>
        <div className="flex items-center justify-center h-64">
          <div className="text-lg text-red-600">Error: {error}</div>
        </div>
      </div>
    );
  }

  return (
    <div>
        <h1 className="text-2xl font-semibold text-primary mb-4">Insurance Requests</h1>
        <InsuranceDataTable data={insuranceRequests} />
    </div>
  );
}
