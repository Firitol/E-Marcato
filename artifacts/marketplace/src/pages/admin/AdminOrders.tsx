import { useState } from "react";
import { useAdminOrders } from "@/lib/api";
import { AdminLayout } from "@/components/layout/AdminLayout";
import { useAuth } from "@/lib/auth-context";
import { useLocation } from "wouter";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { format } from "date-fns";

const STATUS_COLORS: Record<string, string> = {
  pending: "bg-yellow-100 text-yellow-800",
  confirmed: "bg-blue-100 text-blue-800",
  processing: "bg-purple-100 text-purple-800",
  shipped: "bg-indigo-100 text-indigo-800",
  delivered: "bg-green-100 text-green-800",
  cancelled: "bg-red-100 text-red-800",
};

export default function AdminOrders() {
  const { user } = useAuth();
  const [, setLocation] = useLocation();
  const [status, setStatus] = useState("");
  const [page, setPage] = useState(1);
  const { data, isLoading } = useAdminOrders({ status: status || undefined, page });

  if (!user || user.role !== "admin") { setLocation("/login"); return null; }

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">Orders</h1>
            <p className="text-muted-foreground">All platform orders</p>
          </div>
          <Select value={status} onValueChange={setStatus}>
            <SelectTrigger className="w-40"><SelectValue placeholder="All Status" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="">All Orders</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="confirmed">Confirmed</SelectItem>
              <SelectItem value="processing">Processing</SelectItem>
              <SelectItem value="shipped">Shipped</SelectItem>
              <SelectItem value="delivered">Delivered</SelectItem>
              <SelectItem value="cancelled">Cancelled</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {isLoading ? (
          <div className="space-y-3">{Array.from({ length: 10 }).map((_, i) => <Skeleton key={i} className="h-12 rounded-xl" />)}</div>
        ) : (
          <div className="bg-card border rounded-xl overflow-hidden">
            <table className="w-full text-sm">
              <thead className="border-b bg-muted/30">
                <tr>
                  <th className="text-left p-4 font-medium">Order #</th>
                  <th className="text-left p-4 font-medium">Date</th>
                  <th className="text-left p-4 font-medium">Total</th>
                  <th className="text-left p-4 font-medium">Payment</th>
                  <th className="text-left p-4 font-medium">Status</th>
                  <th className="text-left p-4 font-medium">City</th>
                </tr>
              </thead>
              <tbody>
                {data?.orders?.map((order: any) => (
                  <tr key={order.id} className="border-b hover:bg-muted/20">
                    <td className="p-4 font-mono text-xs font-medium">{order.orderNumber}</td>
                    <td className="p-4 text-muted-foreground">{order.createdAt ? format(new Date(order.createdAt), "MMM d, yyyy") : "-"}</td>
                    <td className="p-4 font-semibold">ETB {order.total?.toLocaleString()}</td>
                    <td className="p-4 capitalize text-muted-foreground">{order.paymentMethod?.replace(/_/g, " ")}</td>
                    <td className="p-4">
                      <Badge className={`${STATUS_COLORS[order.status] || ""} border-0`}>{order.status}</Badge>
                    </td>
                    <td className="p-4 text-muted-foreground">{order.shippingAddress?.city || "-"}</td>
                  </tr>
                ))}
                {(!data?.orders?.length) && <tr><td colSpan={6} className="p-8 text-center text-muted-foreground">No orders found</td></tr>}
              </tbody>
            </table>
          </div>
        )}

        {data?.totalPages > 1 && (
          <div className="flex justify-center gap-2">
            {Array.from({ length: data.totalPages }, (_, i) => (
              <Button key={i + 1} variant={page === i + 1 ? "default" : "outline"} size="sm" onClick={() => setPage(i + 1)}>{i + 1}</Button>
            ))}
          </div>
        )}
      </div>
    </AdminLayout>
  );
}
