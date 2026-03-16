import { api } from "@/lib/api";
import { AdminLayout } from "@/components/layout/AdminLayout";
import { useAuth } from "@/lib/auth-context";
import { useLocation } from "wouter";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/hooks/use-toast";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { CheckCircle, XCircle } from "lucide-react";

export default function AdminProducts() {
  const { user } = useAuth();
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const qc = useQueryClient();
  const { data, isLoading } = useQuery({
    queryKey: ["admin-pending-products"],
    queryFn: () => api.get("/admin/products/pending"),
  });

  if (!user || user.role !== "admin") { setLocation("/login"); return null; }

  const approve = async (id: number, status: string) => {
    try {
      await api.put(`/admin/products/${id}/approve`, { status });
      toast({ title: `Product ${status}!` });
      qc.invalidateQueries({ queryKey: ["admin-pending-products"] });
    } catch (err: any) {
      toast({ variant: "destructive", title: "Failed", description: err.message });
    }
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold">Product Moderation</h1>
          <p className="text-muted-foreground">Review and approve pending products</p>
        </div>

        {isLoading ? (
          <div className="space-y-3">{Array.from({ length: 5 }).map((_, i) => <Skeleton key={i} className="h-20 rounded-xl" />)}</div>
        ) : (
          <div className="bg-card border rounded-xl overflow-hidden">
            <table className="w-full text-sm">
              <thead className="border-b bg-muted/30">
                <tr>
                  <th className="text-left p-4 font-medium">Product</th>
                  <th className="text-left p-4 font-medium">Price</th>
                  <th className="text-left p-4 font-medium">Stock</th>
                  <th className="text-left p-4 font-medium">Actions</th>
                </tr>
              </thead>
              <tbody>
                {data?.products?.map((p: any) => (
                  <tr key={p.id} className="border-b hover:bg-muted/20">
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <img src={p.images?.[0] || "https://placehold.co/40x40"} alt={p.name} className="w-10 h-10 rounded-lg object-cover border" />
                        <div>
                          <p className="font-medium">{p.name}</p>
                          <p className="text-xs text-muted-foreground line-clamp-1">{p.description}</p>
                        </div>
                      </div>
                    </td>
                    <td className="p-4">ETB {parseFloat(p.price).toLocaleString()}</td>
                    <td className="p-4">{p.stock}</td>
                    <td className="p-4">
                      <div className="flex gap-2">
                        <Button size="sm" variant="outline" className="text-green-700 border-green-300 hover:bg-green-50"
                          onClick={() => approve(p.id, "active")}>
                          <CheckCircle className="w-3.5 h-3.5 mr-1" /> Approve
                        </Button>
                        <Button size="sm" variant="outline" className="text-red-700 border-red-300 hover:bg-red-50"
                          onClick={() => approve(p.id, "rejected")}>
                          <XCircle className="w-3.5 h-3.5 mr-1" /> Reject
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
                {(!data?.products?.length) && (
                  <tr><td colSpan={4} className="p-8 text-center text-muted-foreground">No pending products to review</td></tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </AdminLayout>
  );
}
