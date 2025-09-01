"use client";

import * as React from "react";
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  useReactTable,
} from "@tanstack/react-table";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Booking, BookingStatus } from "@/lib/types";
import { bookingsColumns } from "./columns";

interface DataTableProps {
  data: Booking[];
}

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

async function fetchBookings(statusFilter?: string): Promise<Booking[]> {
  const url = statusFilter && statusFilter !== "all" 
    ? `${API_BASE_URL}/admin/bookings?status_filter=${statusFilter}`
    : `${API_BASE_URL}/admin/bookings`;

  const response = await fetch(url, {
    headers: {
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    throw new Error('Failed to fetch bookings');
  }

  const data = await response.json();
  return data.bookings;
}

async function updateBookingStatus(bookingId: string, status: string): Promise<void> {
  const response = await fetch(`${API_BASE_URL}/admin/bookings/${bookingId}/status`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ status }),
  });

  if (!response.ok) {
    throw new Error('Failed to update booking status');
  }
}

export default function BookingsDataTable({ data: initialData }: DataTableProps) {
  const [data, setData] = React.useState<Booking[]>([]);
  const [globalFilter, setGlobalFilter] = React.useState("");
  const [statusFilter, setStatusFilter] = React.useState<BookingStatus | "all">("all");
  const [isLoading, setIsLoading] = React.useState(true);
  
  const columns = bookingsColumns;

  // Fetch data from backend API
  React.useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const bookings = await fetchBookings(statusFilter !== "all" ? statusFilter : undefined);
        setData(bookings);
      } catch (error) {
        console.error('Error fetching bookings:', error);
        // Fallback to initial data if API fails
        setData(initialData);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [statusFilter, initialData]);

  const filteredData = React.useMemo(() => {
    let filtered = data;

    if (globalFilter) {
      filtered = filtered.filter((item) =>
        item.brand?.toLowerCase().includes(globalFilter.toLowerCase()) ||
        item.model?.toLowerCase().includes(globalFilter.toLowerCase()) ||
        item.year?.toLowerCase().includes(globalFilter.toLowerCase())
      );
    }
    
    return filtered;
  }, [data, globalFilter]);

  const updateData = React.useCallback(async (rowIndex: number, columnId: string, value: any) => {
    const booking = data[rowIndex];
    
    if (columnId === 'status' && booking._id) {
      try {
        await updateBookingStatus(booking._id, value);
        
        // Update local state optimistically
        setData(old => old.map((row, index) => 
          index === rowIndex ? { ...row, status: value } : row
        ));
      } catch (error) {
        console.error('Error updating booking status:', error);
        // Revert the change if API call fails
        setData(old => old.map((row, index) => 
          index === rowIndex ? { ...row, status: booking.status } : row
        ));
      }
    }
  }, [data]);

  const table = useReactTable({
    data: filteredData,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    state: {
      globalFilter,
    },
    onGlobalFilterChange: setGlobalFilter,
    meta: {
      updateData,
    },
    initialState: {
      pagination: {
        pageSize: 7,
      }
    }
  });

  const bookingStatuses: BookingStatus[] = ["pending", "confirmed", "completed", "cancelled"];

  if (isLoading) {
    return <div className="p-4">Loading bookings...</div>;
  }

  return (
    <div className="rounded-lg border bg-card text-card-foreground shadow-sm">
      <div className="flex items-center p-4 gap-4">
        <Input
          placeholder="Search by brand, model, year..."
          value={globalFilter}
          onChange={(event) => setGlobalFilter(event.target.value)}
          className="max-w-sm"
        />
        <Select value={statusFilter} onValueChange={(value) => setStatusFilter(value as any)}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Filter by status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Statuses</SelectItem>
            {bookingStatuses.map(status => (
              <SelectItem key={status} value={status} className="capitalize">{status}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <div className="border-t">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                    </TableHead>
                  );
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <div className="flex items-center justify-end space-x-2 p-4 border-t">
        <Button
          variant="outline"
          size="sm"
          onClick={() => table.previousPage()}
          disabled={!table.getCanPreviousPage()}
        >
          Previous
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => table.nextPage()}
          disabled={!table.getCanNextPage()}
        >
          Next
        </Button>
      </div>
    </div>
  );
}