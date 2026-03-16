import { useState } from "react";
import { useAdminUsers } from "@/lib/api";
import { AdminLayout } from "@/components/layout/AdminLayout";
import { useAuth } from "@/lib/auth-context";
import { useLocation } from "wouter";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { format } from "date-fns";
import { Search } from "lucide-react";

const ROLE_COLORS: Record<string, string> = {
  admin: "bg-red-100 text-red-800",
  seller: "bg-blue-100 text-blue-800",
  customer: "bg-green-100 text-green-800",
};

export default function AdminUsers() {
  const { user } = useAuth();
  const [, setLocation] = useLocation();
  const [search, setSearch] = useState("");
  const [role, setRole] = useState("");
  const [page, setPage] = useState(1);
  const { data, isLoading } = useAdminUsers({ search: search || undefined, role: role || undefined, page });

  if (!user || user.role !== "admin") { setLocation("/login"); return null; }

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold">Users</h1>
          <p className="text-muted-foreground">Manage platform users</p>
        </div>

        <div className="flex gap-3">
          <div className="relative flex-1 max-w-xs">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input placeholder="Search users..." value={search} onChange={e => setSearch(e.target.value)} className="pl-9" />
          </div>
          <Select value={role} onValueChange={setRole}>
            <SelectTrigger className="w-36"><SelectValue placeholder="All Roles" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="">All Roles</SelectItem>
              <SelectItem value="customer">Customer</SelectItem>
              <SelectItem value="seller">Seller</SelectItem>
              <SelectItem value="admin">Admin</SelectItem>
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
                  <th className="text-left p-4 font-medium">User</th>
                  <th className="text-left p-4 font-medium">Email</th>
                  <th className="text-left p-4 font-medium">Phone</th>
                  <th className="text-left p-4 font-medium">City</th>
                  <th className="text-left p-4 font-medium">Role</th>
                  <th className="text-left p-4 font-medium">Joined</th>
                </tr>
              </thead>
              <tbody>
                {data?.users?.map((u: any) => (
                  <tr key={u.id} className="border-b hover:bg-muted/20">
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center text-primary font-semibold text-sm">
                          {u.firstName?.[0]}
                        </div>
                        <span className="font-medium">{u.firstName} {u.lastName}</span>
                      </div>
                    </td>
                    <td className="p-4 text-muted-foreground">{u.email}</td>
                    <td className="p-4 text-muted-foreground">{u.phone || "-"}</td>
                    <td className="p-4 text-muted-foreground">{u.city || "-"}</td>
                    <td className="p-4">
                      <Badge className={`${ROLE_COLORS[u.role] || ""} border-0`}>{u.role}</Badge>
                    </td>
                    <td className="p-4 text-muted-foreground">{u.createdAt ? format(new Date(u.createdAt), "MMM d, yyyy") : "-"}</td>
                  </tr>
                ))}
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
