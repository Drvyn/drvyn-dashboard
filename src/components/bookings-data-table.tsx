// components/bookings-data-table.tsx
"use client";

import * as React from "react";
import {
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
import { bookingsApi } from "@/lib/api";

interface DataTableProps {
  initialData: Booking[];
}

export default function BookingsDataTable({ initialData }: DataTableProps) {
  const [data, setData] = React.useState<Booking[]>(initialData);
  const [globalFilter, setGlobalFilter] = React.useState("");
  const [statusFilter, setStatusFilter] = React.useState<BookingStatus | "all">("all");
  const [isLoading, setIsLoading] = React.useState(false);
  
  const columns = bookingsColumns;

  // Load data from backend
  React.useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      try {
        const response = await bookingsApi.getAll(
          statusFilter === "all" ? undefined : statusFilter
        );
        
        if (response.success && response.data) {
          setData(response.data.bookings);
        }
      } catch (error) {
        console.error('Failed to load bookings:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, [statusFilter]);

  const updateData = React.useCallback(async (rowIndex: number, columnId: string, value: any) => {
    const row = data[rowIndex];
    
    if (columnId === 'status' && row._id) {
      try {
        const response = await bookingsApi.updateStatus(row._id, value);
        
        if (response.success) {
          setData(old => old.map((item, index) => 
            index === rowIndex ? { ...item, [columnId]: value } : item
          ));
        }
      } catch (error) {
        console.error('Failed to update booking status:', error);
      }
    }
  }, [data]);

  const filteredData = React.useMemo(() => {
    if (!globalFilter) return data;
    
    return data.filter((item) =>
      item.brand.toLowerCase().includes(globalFilter.toLowerCase()) ||
      item.model.toLowerCase().includes(globalFilter.toLowerCase()) ||
      item.year.toLowerCase().includes(globalFilter.toLowerCase())
    );
  }, [data, globalFilter]);

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

  const bookingStatuses: BookingStatus[] = ["pending", "confirmed", "completed", "cancelled", "not-interested", "to-follow-up", "cold-enq", "booking-confirmed"];

  if (isLoading) {
    return <div className="flex justify-center items-center h-64">Loading bookings...</div>;
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
                  No bookings found.
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