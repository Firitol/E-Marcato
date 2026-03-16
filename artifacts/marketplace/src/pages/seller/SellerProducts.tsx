import { useState } from "react";
import { useSellerProducts } from "@/lib/api";
import { api } from "@/lib/api";
import { SellerLayout } from "@/components/layout/SellerLayout";
import { useAuth } from "@/lib/auth-context";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/hooks/use-toast";
import { useQueryClient } from "@tanstack/react-query";
import { useSellerProfile } from "@/lib/api";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useCategories } from "@/lib/api";
import { Plus, Pencil } from "lucide-react";

const STATUS_COLORS: Record<string, string> = {
  active: "bg-green-100 text-green-800",
  pending: "bg-yellow-100 text-yellow-800",
  rejected: "bg-red-100 text-red-800",
  inactive: "bg-gray-100 text-gray-800",
};

export default function SellerProducts() {
  const { user } = useAuth();
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const qc = useQueryClient();
  const { data: profile } = useSellerProfile();
  const { data: categories } = useCategories();
  const { data, isLoading } = useSellerProducts(profile ? { sellerId: profile.id } : undefined);
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({ name: "", description: "", price: "", originalPrice: "", stock: "", categoryId: "", images: "" });
  const [submitting, setSubmitting] = useState(false);

  if (!user) { setLocation("/login"); return null; }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await api.post("/products", {
        ...form,
        price: parseFloat(form.price),
        originalPrice: form.originalPrice ? parseFloat(form.originalPrice) : undefined,
        stock: parseInt(form.stock),
        categoryId: parseInt(form.categoryId),
        images: form.images ? form.images.split(",").map(s => s.trim()) : [],
      });
      toast({ title: "Product submitted for review!" });
      setOpen(false);
      qc.invalidateQueries({ queryKey: ["seller-products"] });
    } catch (err: any) {
      toast({ variant: "destructive", title: "Failed", description: err.message });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <SellerLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">My Products</h1>
            <p className="text-muted-foreground">Manage your product listings</p>
          </div>
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <Button className="flex items-center gap-2"><Plus className="w-4 h-4" /> Add Product</Button>
            </DialogTrigger>
            <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Add New Product</DialogTitle>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <Label>Product Name *</Label>
                  <Input value={form.name} onChange={e => setForm(p => ({ ...p, name: e.target.value }))} required className="mt-1" />
                </div>
                <div>
                  <Label>Description *</Label>
                  <Textarea value={form.description} onChange={e => setForm(p => ({ ...p, description: e.target.value }))} required className="mt-1 resize-none" rows={3} />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <Label>Price (ETB) *</Label>
                    <Input type="number" value={form.price} onChange={e => setForm(p => ({ ...p, price: e.target.value }))} required className="mt-1" />
                  </div>
                  <div>
                    <Label>Original Price (ETB)</Label>
                    <Input type="number" value={form.originalPrice} onChange={e => setForm(p => ({ ...p, originalPrice: e.target.value }))} className="mt-1" />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <Label>Stock *</Label>
                    <Input type="number" value={form.stock} onChange={e => setForm(p => ({ ...p, stock: e.target.value }))} required className="mt-1" />
                  </div>
                  <div>
                    <Label>Category *</Label>
                    <Select value={form.categoryId} onValueChange={v => setForm(p => ({ ...p, categoryId: v }))}>
                      <SelectTrigger className="mt-1"><SelectValue placeholder="Select" /></SelectTrigger>
                      <SelectContent>{categories?.map((c: any) => <SelectItem key={c.id} value={String(c.id)}>{c.name}</SelectItem>)}</SelectContent>
                    </Select>
                  </div>
                </div>
                <div>
                  <Label>Image URLs (comma-separated)</Label>
                  <Input value={form.images} onChange={e => setForm(p => ({ ...p, images: e.target.value }))} placeholder="https://..." className="mt-1" />
                </div>
                <Button type="submit" className="w-full" disabled={submitting}>
                  {submitting ? "Submitting..." : "Submit for Review"}
                </Button>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        {isLoading ? (
          <div className="space-y-3">{Array.from({ length: 5 }).map((_, i) => <Skeleton key={i} className="h-16 rounded-xl" />)}</div>
        ) : (
          <div className="bg-card border rounded-xl overflow-hidden">
            <table className="w-full text-sm">
              <thead className="border-b bg-muted/30">
                <tr>
                  <th className="text-left p-4 font-medium">Product</th>
                  <th className="text-left p-4 font-medium">Price</th>
                  <th className="text-left p-4 font-medium">Stock</th>
                  <th className="text-left p-4 font-medium">Sold</th>
                  <th className="text-left p-4 font-medium">Status</th>
                </tr>
              </thead>
              <tbody>
                {data?.products?.map((p: any) => (
                  <tr key={p.id} className="border-b hover:bg-muted/20">
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <img src={p.images?.[0] || "https://placehold.co/40x40"} alt={p.name} className="w-10 h-10 rounded-lg object-cover border" />
                        <span className="font-medium">{p.name}</span>
                      </div>
                    </td>
                    <td className="p-4">ETB {parseFloat(p.price).toLocaleString()}</td>
                    <td className="p-4">{p.stock}</td>
                    <td className="p-4">{p.sold || 0}</td>
                    <td className="p-4">
                      <Badge className={`${STATUS_COLORS[p.status] || ""} border-0`}>{p.status}</Badge>
                    </td>
                  </tr>
                ))}
                {(!data?.products?.length) && (
                  <tr><td colSpan={5} className="p-8 text-center text-muted-foreground">No products yet. Add your first product!</td></tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </SellerLayout>
  );
}
