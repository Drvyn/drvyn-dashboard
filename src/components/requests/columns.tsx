"use client"

import { ColumnDef } from "@tanstack/react-table"
import { GeneralRequest, GeneralRequestStatus } from "@/lib/types"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

// Updated status styles to match bookingsColumns
const statusStyles: Record<GeneralRequestStatus, string> = {
  new: "bg-amber-100 text-amber-800 border-amber-200 hover:bg-amber-200",
  "in-progress": "bg-blue-100 text-blue-800 border-blue-200 hover:bg-blue-200",
  resolved: "bg-green-100 text-green-800 border-green-200 hover:bg-green-200",
};

// Added statusDotStyles for consistency (optional, not used in SelectTrigger but included for completeness)
const statusDotStyles: Record<GeneralRequestStatus, string> = {
  new: "bg-amber-500",
  "in-progress": "bg-blue-500",
  resolved: "bg-green-500",
};

const generalRequestStatuses: GeneralRequestStatus[] = ["new", "in-progress", "resolved"];

export const generalRequestColumns: ColumnDef<GeneralRequest>[] = [
  {
    accessorKey: "brand",
    header: "Vehicle",
    cell: ({ row }) => {
      const req = row.original;
      return (
        <div>
          <div className="font-medium">{req.brand} {req.model}</div>
          <div className="text-sm text-muted-foreground">{req.year} &bull; {req.fuelType}</div>
        </div>
      )
    }
  },
  {
    accessorKey: "phone",
    header: "Phone",
  },
  {
    accessorKey: "createdAt",
    header: "Requested On",
    cell: ({ row }) => {
      const date = new Date(row.getValue("createdAt"))
      const formatted = date.toLocaleDateString("en-IN", {
        year: 'numeric', month: 'long', day: 'numeric'
      });
      return <div>{formatted}</div>
    },
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: function Cell({ getValue, row, column, table }) {
      const initialValue = getValue() as GeneralRequestStatus;
      const { updateData } = table.options.meta as any;

      return (
        <Select
          value={initialValue}
          onValueChange={(value) => updateData(row.index, column.id, value)}
        >
          <SelectTrigger
            className={cn(
              "w-36 h-9 transition-all duration-200 border-2 font-medium rounded-lg py-1.5 px-3",
              "focus:ring-2 focus:ring-offset-2 focus:ring-[hsl(var(--status-" + initialValue + "))/40]",
              "hover:shadow-sm active:scale-95",
              statusStyles[initialValue]
            )}
          >
            <div className="flex items-center gap-2">
              <span className="truncate capitalize">
                <SelectValue />
              </span>
            </div>
          </SelectTrigger>
          <SelectContent className="rounded-lg border-2 border-gray-200 bg-white shadow-md">
            {generalRequestStatuses.map((status) => (
              <SelectItem
                key={status}
                value={status}
                className="px-3 py-1.5 cursor-pointer transition-colors duration-150 hover:bg-gray-50 focus:bg-gray-50"
              >
                <div className="flex items-center gap-2">
                  <Badge
                    className={cn(
                      "capitalize text-sm font-medium w-full justify-start border-0 px-2 py-0.5",
                      statusStyles[status]
                    )}
                  >
                    {status}
                  </Badge>
                </div>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      );
    }
  },
]