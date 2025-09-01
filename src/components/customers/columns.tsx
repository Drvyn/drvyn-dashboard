"use client"

import { ColumnDef } from "@tanstack/react-table"
import { Customer } from "@/lib/types"
import { format } from "date-fns"

export const customerColumns: ColumnDef<Customer>[] = [
  {
    accessorKey: "name",
    header: "Customer",
    cell: ({ row }) => {
        const customer = row.original;
        return (
            <div>
                <div className="font-medium">{customer.name}</div>
                <div className="text-sm text-muted-foreground">{customer.phone}</div>
            </div>
        )
    }
  },
  {
    accessorKey: "address",
    header: "Address"
  },
  {
    accessorKey: "vehicles",
    header: "Vehicles",
    cell: ({ row }) => {
        const vehicles = row.original.vehicles;
        return (
            <div>
                {vehicles.slice(0, 2).map(v => (
                    <div key={`${v.brand}-${v.model}`}>{v.brand} {v.model} ({v.year})</div>
                ))}
                {vehicles.length > 2 && <div className="text-sm text-muted-foreground">+{vehicles.length - 2} more</div>}
            </div>
        )
    }
  },
  {
    accessorKey: "totalBookings",
    header: "Total Bookings",
  },
    {
    accessorKey: "totalRequests",
    header: "Total Requests",
  },
  {
    accessorKey: "lastSeen",
    header: "Last Activity",
     cell: ({ row }) => {
      const date = new Date(row.getValue("lastSeen"))
      const formatted = format(date, "MMM dd, yyyy");
      return <div>{formatted}</div>
    },
  },
]
