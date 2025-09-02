// components/requests-data-table.tsx
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
import { GeneralRequest } from "@/lib/types";
import { generalRequestColumns } from "./columns";
import { generalRequestsApi } from "@/lib/api";

interface DataTableProps {
  initialData: GeneralRequest[];
}

export default function RequestsDataTable({ initialData }: DataTableProps) {
  const [data, setData] = React.useState<GeneralRequest[]>(initialData);
  const [globalFilter, setGlobalFilter] = React.useState("");
  const [isLoading, setIsLoading] = React.useState(false);
  
  const columns = generalRequestColumns;

  React.useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      try {
        const response = await generalRequestsApi.getAll();
        
        if (response.success && response.data) {
          setData(response.data.requests);
        }
      } catch (error) {
        console.error('Failed to load general requests:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, []);

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
    initialState: {
      pagination: {
        pageSize: 7,
      }
    }
  });

  if (isLoading) {
    return <div className="flex justify-center items-center h-64">Loading general requests...</div>;
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
                  No general requests found.
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