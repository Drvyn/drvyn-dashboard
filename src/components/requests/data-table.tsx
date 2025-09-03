// data-table.tsx
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
import { GeneralRequest, GeneralRequestStatus } from "@/lib/types";
import { generalRequestColumns } from "./columns";

interface DataTableProps {
  data: GeneralRequest[];
}

// Helper functions for localStorage status management
const getStatusFromStorage = (): Record<string, GeneralRequestStatus> => {
  if (typeof window === 'undefined') return {};
  try {
    const statusData = localStorage.getItem("generalRequestStatuses");
    return statusData ? JSON.parse(statusData) : {};
  } catch {
    return {};
  }
};

const saveStatusToStorage = (id: string, status: GeneralRequestStatus) => {
  if (typeof window === 'undefined') return;
  try {
    const currentStatuses = getStatusFromStorage();
    const updatedStatuses = { ...currentStatuses, [id]: status };
    localStorage.setItem("generalRequestStatuses", JSON.stringify(updatedStatuses));
  } catch (error) {
    console.error("Failed to save status to localStorage:", error);
  }
};

export default function RequestsDataTable({ data: initialData }: DataTableProps) {
  const [data, setData] = React.useState<GeneralRequest[]>([]);
  const [globalFilter, setGlobalFilter] = React.useState("");
  const [statusFilter, setStatusFilter] = React.useState<GeneralRequestStatus | "all">("all");
  const [isLoading, setIsLoading] = React.useState(true);
  
  const columns = generalRequestColumns;

  // Load data and apply saved statuses from localStorage
  React.useEffect(() => {
    const initializeData = () => {
      try {
        setIsLoading(true);
        
        // Get saved statuses from localStorage
        const savedStatuses = getStatusFromStorage();
        
        // Apply saved statuses to the initial data
        const enhancedData = initialData.map(item => {
          if (item._id && savedStatuses[item._id]) {
            return { ...item, status: savedStatuses[item._id] };
          }
          return item;
        });
        
        setData(enhancedData);
      } catch (error) {
        console.error('Error initializing general requests:', error);
        setData(initialData);
      } finally {
        setIsLoading(false);
      }
    };

    initializeData();
  }, [initialData]);

  const filteredData = React.useMemo(() => {
    let filtered = data;

    if (statusFilter !== "all") {
      filtered = filtered.filter((item: GeneralRequest) => item.status === statusFilter);
    }

    if (globalFilter) {
      filtered = filtered.filter((item: GeneralRequest) =>
        item.brand.toLowerCase().includes(globalFilter.toLowerCase()) ||
        item.model.toLowerCase().includes(globalFilter.toLowerCase()) ||
        item.year.toLowerCase().includes(globalFilter.toLowerCase())
      );
    }
    
    return filtered;
  }, [data, globalFilter, statusFilter]);

  const updateData = React.useCallback((rowIndex: number, columnId: string, value: any) => {
    setData((old: GeneralRequest[]) => {
      const newData = old.map((row: GeneralRequest, index: number) => {
        if (index === rowIndex) {
          const updatedRow = {
            ...old[rowIndex],
            [columnId]: value,
          };
          
          // Save only the status to localStorage if it's a status change
          if (columnId === 'status' && updatedRow._id) {
            saveStatusToStorage(updatedRow._id, value);
          }
          
          return updatedRow;
        }
        return row;
      });
      
      return newData;
    });
  }, []);

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

  const generalRequestStatuses: GeneralRequestStatus[] = ["new", "in-progress", "resolved"];

  if (isLoading) {
    return <div className="p-4">Loading general requests...</div>;
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
                {generalRequestStatuses.map(status => (
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