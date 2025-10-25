// components/columns.tsx
"use client"

import { ColumnDef } from "@tanstack/react-table"
import { Booking, BookingStatus, InsuranceRequest, InsuranceStatus, GeneralRequest, GeneralRequestStatus } from "@/lib/types"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

// Booking status styles
const bookingStatusStyles: Record<BookingStatus, string> = {
  pending: "bg-amber-100 text-amber-800 border-amber-200 hover:bg-amber-200",
  confirmed: "bg-blue-100 text-blue-800 border-blue-200 hover:bg-blue-200",
  completed: "bg-green-100 text-green-800 border-green-200 hover:bg-green-200",
  cancelled: "bg-red-100 text-red-800 border-red-200 hover:bg-red-200",
  "not-interested": "bg-gray-100 text-gray-800 border-gray-200 hover:bg-gray-200",
  "to-follow-up": "bg-purple-100 text-purple-800 border-purple-200 hover:bg-purple-200",
  "cold-enq": "bg-orange-100 text-orange-800 border-orange-200 hover:bg-orange-200",
  "booking-confirmed": "bg-blue-100 text-blue-800 border-blue-200 hover:bg-blue-200", // Same as confirmed
};

const bookingStatuses: BookingStatus[] = ["pending", "confirmed", "completed", "cancelled", "not-interested", "to-follow-up", "cold-enq", "booking-confirmed"];

export const bookingsColumns: ColumnDef<Booking>[] = [
  {
    accessorKey: "brand",
    header: "Vehicle",
    cell: ({ row }) => {
      const booking = row.original;
      return (
        <div>
          <div className="font-medium">{booking.brand} {booking.model}</div>
          <div className="text-sm text-muted-foreground">{booking.year} &bull; {booking.fuelType}</div>
        </div>
      )
    }
  },
  {
    accessorKey: "cartItems",
    header: "Services",
    cell: ({ row }) => {
      const cartItems = row.original.cartItems;
      return (
        <div className="space-y-1">
          {cartItems.map(item => (
            <div key={item.packageName} className="text-sm text-muted-foreground">
              • {item.packageName}
            </div>
          ))}
        </div>
      )
    }
  },
  {
    accessorKey: "date",
    header: "Booking Date & Time",
    cell: ({ row }) => {
      const booking = row.original;
      return (
        <div>
          <div className="font-medium">{booking.date}</div>
          <div className="text-sm text-muted-foreground">{booking.time}</div>
        </div>
      )
    }
  },
  {
    accessorKey: "serviceCenter",
    header: "Service Center",
    cell: ({ row }) => {
      return (
        <div className="font-medium">
          {row.original.serviceCenter}
        </div>
      )
    }
  },
  {
    accessorKey: "totalPrice",
    header: () => <div className="text-right">Price</div>,
    cell: ({ row }) => {
      const amount = parseFloat(row.getValue("totalPrice"))
      const formatted = new Intl.NumberFormat("en-IN", {
        style: "currency",
        currency: "INR",
      }).format(amount)
 
      return <div className="text-right font-medium">{formatted}</div>
    },
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: function Cell({ getValue, row, column, table }) {
      const initialValue = getValue() as BookingStatus;
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
              bookingStatusStyles[initialValue]
            )}
          >
            <div className="flex items-center gap-2">
              <span className="truncate capitalize">
                <SelectValue />
              </span>
            </div>
          </SelectTrigger>
          <SelectContent className="rounded-lg border-2 border-gray-200 bg-white shadow-md">
            {bookingStatuses.map((status) => (
              <SelectItem
                key={status}
                value={status}
                className="px-3 py-1.5 cursor-pointer transition-colors duration-150 hover:bg-gray-50 focus:bg-gray-50"
              >
                <div className="flex items-center gap-2">
                  <Badge
                    className={cn(
                      "capitalize text-sm font-medium w-full justify-start border-0 px-2 py-0.5",
                      bookingStatusStyles[status]
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
    },
  },
]

// Insurance request status styles
const insuranceStatusStyles: Record<InsuranceStatus, string> = {
  new: "bg-amber-100 text-amber-800 border-amber-200 hover:bg-amber-200",
  contacted: "bg-blue-100 text-blue-800 border-blue-200 hover:bg-blue-200",
  completed: "bg-green-100 text-green-800 border-green-200 hover:bg-green-200",
  rejected: "bg-red-100 text-red-800 border-red-200 hover:bg-red-200",
  "not-interested": "bg-gray-100 text-gray-800 border-gray-200 hover:bg-gray-200",
  "to-follow-up": "bg-purple-100 text-purple-800 border-purple-200 hover:bg-purple-200",
  "cold-enq": "bg-orange-100 text-orange-800 border-orange-200 hover:bg-orange-200",
  "booking-confirmed": "bg-blue-100 text-blue-800 border-blue-200 hover:bg-blue-200",
};

const insuranceStatuses: InsuranceStatus[] = ["new", "contacted", "completed", "rejected", "not-interested", "to-follow-up", "cold-enq", "booking-confirmed"];

export const insuranceRequestColumns: ColumnDef<InsuranceRequest>[] = [
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
    accessorKey: "companyPolicyName",
    header: "Policy Name",
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
      const initialValue = getValue() as InsuranceStatus;
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
              insuranceStatusStyles[initialValue]
            )}
          >
            <div className="flex items-center gap-2">
              <span className="truncate capitalize">
                <SelectValue />
              </span>
            </div>
          </SelectTrigger>
          <SelectContent className="rounded-lg border-2 border-gray-200 bg-white shadow-md">
            {insuranceStatuses.map((status) => (
              <SelectItem
                key={status}
                value={status}
                className="px-3 py-1.5 cursor-pointer transition-colors duration-150 hover:bg-gray-50 focus:bg-gray-50"
              >
                <div className="flex items-center gap-2">
                  <Badge
                    className={cn(
                      "capitalize text-sm font-medium w-full justify-start border-0 px-2 py-0.5",
                      insuranceStatusStyles[status]
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

// General request status styles
const generalRequestStatusStyles: Record<GeneralRequestStatus, string> = {
  new: "bg-amber-100 text-amber-800 border-amber-200 hover:bg-amber-200",
  "in-progress": "bg-blue-100 text-blue-800 border-blue-200 hover:bg-blue-200",
  resolved: "bg-green-100 text-green-800 border-green-200 hover:bg-green-200",
  "not-interested": "bg-gray-100 text-gray-800 border-gray-200 hover:bg-gray-200",
  "to-follow-up": "bg-purple-100 text-purple-800 border-purple-200 hover:bg-purple-200",
  "cold-enq": "bg-orange-100 text-orange-800 border-orange-200 hover:bg-orange-200",
  "booking-confirmed": "bg-blue-100 text-blue-800 border-blue-200 hover:bg-blue-200",
};

const generalRequestStatuses: GeneralRequestStatus[] = ["new", "in-progress", "resolved", "not-interested", "to-follow-up", "cold-enq", "booking-confirmed"];

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
              generalRequestStatusStyles[initialValue]
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
                      generalRequestStatusStyles[status]
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