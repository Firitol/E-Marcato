import { useState } from "react";
import { useSellerOrders } from "@/lib/api";
import { api } from "@/lib/api";
import { SellerLayout } from "@/components/layout/SellerLayout";
import { useAuth } from "@/lib/auth-context";
import { useLocation } from "wouter";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/hooks/use-toast";
import { useQueryClient } from "@tanstack/react-query";
import { format } from "date-fns";

const STATUS_COLORS: Record<string, string> = {
  pending: "bg-yellow-100 text-yellow-800",
  confirmed: "bg-blue-100 text-blue-800",
  processing: "bg-purple-100 text-purple-800",
  shipped: "bg-indigo-100 text-indigo-800",
  delivered: "bg-green-100 text-green-800",
  cancelled: "bg-red-100 text-red-800",
};

export default function SellerOrders() {
  const { user } = useAuth();
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const qc = useQueryClient();
  const [statusFilter, setStatusFilter] = useState("");
  const { data, isLoading } = useSellerOrders({ status: statusFilter || undefined });

  if (!user) { setLocation("/login"); return null; }

  const updateStatus = async (orderId: number, status: string) => {
    try {
      await api.put(`/orders/${orderId}/status`, { status });
      toast({ title: "Order status updated!" });
      qc.invalidateQueries({ queryKey: ["seller-orders"] });
    } catch (err: any) {
      toast({ variant: "destructive", title: "Failed", description: err.message });
    }
  };

  return (
    <SellerLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">Orders</h1>
            <p className="text-muted-foreground">Manage your customer orders</p>
          </div>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-40"><SelectValue placeholder="All Status" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="">All Orders</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="confirmed">Confirmed</SelectItem>
              <SelectItem value="processing">Processing</SelectItem>
              <SelectItem value="shipped">Shipped</SelectItem>
              <SelectItem value="delivered">Delivered</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {isLoading ? (
          <div className="space-y-3">{Array.from({ length: 5 }).map((_, i) => <Skeleton key={i} className="h-20 rounded-xl" />)}</div>
        ) : (
          <div className="bg-card border rounded-xl overflow-hidden">
            <table className="w-full text-sm">
              <thead className="border-b bg-muted/30">
                <tr>
                  <th className="text-left p-4 font-medium">Order</th>
                  <th className="text-left p-4 font-medium">Date</th>
                  <th className="text-left p-4 font-medium">Total</th>
                  <th className="text-left p-4 font-medium">Payment</th>
                  <th className="text-left p-4 font-medium">Status</th>
                  <th className="text-left p-4 font-medium">Action</th>
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
                    <td className="p-4">
                      {order.status === "pending" && (
                        <Button size="sm" variant="outline" onClick={() => updateStatus(order.id, "confirmed")}>Confirm</Button>
                      )}
                      {order.status === "confirmed" && (
                        <Button size="sm" variant="outline" onClick={() => updateStatus(order.id, "processing")}>Process</Button>
                      )}
                      {order.status === "processing" && (
                        <Button size="sm" variant="outline" onClick={() => updateStatus(order.id, "shipped")}>Mark Shipped</Button>
                      )}
                    </td>
                  </tr>
                ))}
                {(!data?.orders?.length) && (
                  <tr><td colSpan={6} className="p-8 text-center text-muted-foreground">No orders yet</td></tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </SellerLayout>
  );
}
