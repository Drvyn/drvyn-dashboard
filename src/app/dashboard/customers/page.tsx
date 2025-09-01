import { bookings, insuranceRequests, generalRequests } from "@/lib/data";
import { Customer } from "@/lib/types";
import CustomerDataTable from "@/components/customers/data-table";

function getCustomerName(phone: string): string {
    const allEntries = [...bookings, ...insuranceRequests, ...generalRequests];
    // A real implementation would fetch customer name from a user profile
    // For now, we'll assign generic names based on the phone number.
    const uniquePhones = [...new Set(allEntries.map(e => e.phone))];
    const index = uniquePhones.indexOf(phone);
    if (index !== -1) {
        return `Customer ${index + 1}`;
    }
    return "Unknown Customer";
}


export default function CustomersPage() {
  const allEntries = [...bookings, ...insuranceRequests, ...generalRequests];

  const customers = allEntries.reduce((acc, entry) => {
    const phone = entry.phone;
    if (!acc[phone]) {
      acc[phone] = {
        phone,
        name: getCustomerName(phone),
        totalBookings: 0,
        totalRequests: 0,
        lastSeen: '1970-01-01',
        vehicles: [],
        address: 'N/A',
      };
    }

    if ('status' in entry && 'totalPrice' in entry) { // Booking
      acc[phone].totalBookings += 1;
       // Update address only if it's a booking and it's the most recent entry so far
       if (new Date(entry.createdAt) > new Date(acc[phone].lastSeen)) {
        acc[phone].address = (entry as any).address || acc[phone].address;
      }
    } else { // Insurance or General Request
      acc[phone].totalRequests += 1;
    }

    if (new Date(entry.createdAt) > new Date(acc[phone].lastSeen)) {
      acc[phone].lastSeen = entry.createdAt;
    }

    const vehicle = { brand: entry.brand, model: entry.model, year: entry.year };
    if (!acc[phone].vehicles.some(v => v.brand === vehicle.brand && v.model === vehicle.model)) {
        acc[phone].vehicles.push(vehicle);
    }
    
    return acc;
  }, {} as Record<string, Customer>);

  const customerData = Object.values(customers);

  return (
    <div>
      <h1 className="text-2xl font-semibold text-primary mb-4">Customers</h1>
      <CustomerDataTable data={customerData} />
    </div>
  );
}
