import { useAdminDashboard } from "@/lib/api";
import { AdminLayout } from "@/components/layout/AdminLayout";
import { useAuth } from "@/lib/auth-context";
import { useLocation, Link } from "wouter";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { Users, Store, Package, ShoppingBag, TrendingUp, AlertTriangle } from "lucide-react";
import { format } from "date-fns";

function StatCard({ label, value, icon: Icon, color, alert }: any) {
  return (
    <div className="bg-card border rounded-xl p-5 flex items-center gap-4">
      <div className={`w-12 h-12 rounded-xl ${color} flex items-center justify-center text-white`}>
        <Icon className="w-6 h-6" />
      </div>
      <div>
        <p className="text-muted-foreground text-sm">{label}</p>
        <p className="text-2xl font-bold">{value}</p>
        {alert && <p className="text-xs text-amber-600 font-medium">{alert} pending</p>}
      </div>
    </div>
  );
}

const STATUS_COLORS: Record<string, string> = {
  pending: "bg-yellow-100 text-yellow-800",
  confirmed: "bg-blue-100 text-blue-800",
  processing: "bg-purple-100 text-purple-800",
  shipped: "bg-indigo-100 text-indigo-800",
  delivered: "bg-green-100 text-green-800",
  cancelled: "bg-red-100 text-red-800",
};

export default function AdminDashboard() {
  const { user } = useAuth();
  const [, setLocation] = useLocation();
  const { data, isLoading } = useAdminDashboard();

  if (!user || user.role !== "admin") { setLocation("/login"); return null; }

  if (isLoading) {
    return (
      <AdminLayout>
        <div className="space-y-4">{Array.from({ length: 6 }).map((_, i) => <Skeleton key={i} className="h-24 rounded-xl" />)}</div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold">Admin Dashboard</h1>
          <p className="text-muted-foreground">Platform overview and management</p>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
          <StatCard label="Total Users" value={data?.totalUsers?.toLocaleString() || 0} icon={Users} color="bg-blue-500" />
          <StatCard label="Sellers" value={data?.totalSellers?.toLocaleString() || 0} icon={Store} color="bg-purple-500" alert={data?.pendingSellers > 0 ? data.pendingSellers : null} />
          <StatCard label="Products" value={data?.totalProducts?.toLocaleString() || 0} icon={Package} color="bg-orange-500" alert={data?.pendingProducts > 0 ? data.pendingProducts : null} />
          <StatCard label="Total Orders" value={data?.totalOrders?.toLocaleString() || 0} icon={ShoppingBag} color="bg-green-500" />
          <StatCard label="Revenue (ETB)" value={(data?.totalRevenue || 0).toLocaleString()} icon={TrendingUp} color="bg-primary" />
          {(data?.pendingSellers > 0 || data?.pendingProducts > 0) && (
            <div className="bg-amber-50 border border-amber-200 rounded-xl p-5 flex items-center gap-4">
              <AlertTriangle className="w-8 h-8 text-amber-500" />
              <div>
                <p className="font-medium text-amber-800">Action Required</p>
                <p className="text-sm text-amber-600">{data.pendingSellers} sellers, {data.pendingProducts} products</p>
              </div>
            </div>
          )}
        </div>

        {/* Revenue Chart */}
        <div className="bg-card border rounded-xl p-5">
          <h2 className="font-semibold mb-4">Revenue (Last 30 Days)</h2>
          <ResponsiveContainer width="100%" height={220}>
            <AreaChart data={data?.revenueChart || []}>
              <defs>
                <linearGradient id="admin-rev" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.15} />
                  <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis dataKey="date" tick={{ fontSize: 10 }} />
              <YAxis tick={{ fontSize: 10 }} />
              <Tooltip formatter={(v: any) => [`ETB ${v.toLocaleString()}`, "Revenue"]} />
              <Area type="monotone" dataKey="value" stroke="hsl(var(--primary))" fill="url(#admin-rev)" strokeWidth={2} />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Recent Orders */}
        <div className="bg-card border rounded-xl p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-semibold">Recent Orders</h2>
            <Link href="/admin/orders" className="text-sm text-primary hover:underline">View all</Link>
          </div>
          <div className="space-y-3">
            {data?.recentOrders?.map((order: any) => (
              <div key={order.id} className="flex items-center gap-3 text-sm">
                <span className="font-mono text-xs text-muted-foreground">{order.orderNumber}</span>
                <span className="flex-1">ETB {order.total?.toLocaleString()}</span>
                <span className="text-muted-foreground">{order.createdAt ? format(new Date(order.createdAt), "MMM d") : "-"}</span>
                <Badge className={`${STATUS_COLORS[order.status] || ""} border-0 text-xs`}>{order.status}</Badge>
              </div>
            ))}
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
