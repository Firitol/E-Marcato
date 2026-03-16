import { useState } from "react";
import { useAdminSellers } from "@/lib/api";
import { api } from "@/lib/api";
import { AdminLayout } from "@/components/layout/AdminLayout";
import { useAuth } from "@/lib/auth-context";
import { useLocation } from "wouter";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/hooks/use-toast";
import { useQueryClient } from "@tanstack/react-query";
import { format } from "date-fns";
import { CheckCircle, XCircle } from "lucide-react";

const STATUS_COLORS: Record<string, string> = {
  pending: "bg-yellow-100 text-yellow-800",
  approved: "bg-green-100 text-green-800",
  rejected: "bg-red-100 text-red-800",
  suspended: "bg-gray-100 text-gray-800",
};

export default function AdminSellers() {
  const { user } = useAuth();
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const qc = useQueryClient();
  const [status, setStatus] = useState("pending");
  const { data, isLoading } = useAdminSellers({ status: status || undefined });

  if (!user || user.role !== "admin") { setLocation("/login"); return null; }

  const approve = async (id: number, newStatus: string) => {
    try {
      await api.put(`/admin/sellers/${id}/approve`, { status: newStatus });
      toast({ title: `Seller ${newStatus}!` });
      qc.invalidateQueries({ queryKey: ["admin-sellers"] });
    } catch (err: any) {
      toast({ variant: "destructive", title: "Failed", description: err.message });
    }
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">Sellers</h1>
            <p className="text-muted-foreground">Approve and manage sellers</p>
          </div>
          <Select value={status} onValueChange={setStatus}>
            <SelectTrigger className="w-36"><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="">All</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="approved">Approved</SelectItem>
              <SelectItem value="rejected">Rejected</SelectItem>
              <SelectItem value="suspended">Suspended</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {isLoading ? (
          <div className="space-y-3">{Array.from({ length: 5 }).map((_, i) => <Skeleton key={i} className="h-16 rounded-xl" />)}</div>
        ) : (
          <div className="bg-card border rounded-xl overflow-hidden">
            <table className="w-full text-sm">
              <thead className="border-b bg-muted/30">
                <tr>
                  <th className="text-left p-4 font-medium">Store</th>
                  <th className="text-left p-4 font-medium">Category</th>
                  <th className="text-left p-4 font-medium">City</th>
                  <th className="text-left p-4 font-medium">Status</th>
                  <th className="text-left p-4 font-medium">Applied</th>
                  <th className="text-left p-4 font-medium">Actions</th>
                </tr>
              </thead>
              <tbody>
                {data?.sellers?.map((seller: any) => (
                  <tr key={seller.id} className="border-b hover:bg-muted/20">
                    <td className="p-4 font-medium">{seller.storeName}</td>
                    <td className="p-4 text-muted-foreground">{seller.category || "-"}</td>
                    <td className="p-4 text-muted-foreground">{seller.city || "-"}</td>
                    <td className="p-4">
                      <Badge className={`${STATUS_COLORS[seller.status] || ""} border-0`}>{seller.status}</Badge>
                    </td>
                    <td className="p-4 text-muted-foreground">{seller.createdAt ? format(new Date(seller.createdAt), "MMM d, yyyy") : "-"}</td>
                    <td className="p-4">
                      <div className="flex gap-2">
                        {seller.status === "pending" && (
                          <>
                            <Button size="sm" variant="outline" className="text-green-700 border-green-300 hover:bg-green-50"
                              onClick={() => approve(seller.id, "approved")}>
                              <CheckCircle className="w-3.5 h-3.5 mr-1" /> Approve
                            </Button>
                            <Button size="sm" variant="outline" className="text-red-700 border-red-300 hover:bg-red-50"
                              onClick={() => approve(seller.id, "rejected")}>
                              <XCircle className="w-3.5 h-3.5 mr-1" /> Reject
                            </Button>
                          </>
                        )}
                        {seller.status === "approved" && (
                          <Button size="sm" variant="outline" onClick={() => approve(seller.id, "suspended")}>Suspend</Button>
                        )}
                        {seller.status === "suspended" && (
                          <Button size="sm" variant="outline" onClick={() => approve(seller.id, "approved")}>Reinstate</Button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
                {(!data?.sellers?.length) && (
                  <tr><td colSpan={6} className="p-8 text-center text-muted-foreground">No sellers found</td></tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </AdminLayout>
  );
}
