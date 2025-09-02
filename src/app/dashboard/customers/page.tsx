import CustomerDataTable from "@/components/customers/data-table";
import { Customer } from "@/lib/types";

export default function CustomersPage() {
  const customerData: Customer[] = []; // An empty array to show no data

  return (
    <div>
      <h1 className="text-2xl font-semibold text-primary mb-4">Customers</h1>
      <CustomerDataTable data={customerData} />
    </div>
  );
}