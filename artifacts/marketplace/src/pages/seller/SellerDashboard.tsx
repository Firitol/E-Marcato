import { useSellerProfile, useSellerAnalytics } from "@/lib/api";
import { SellerLayout } from "@/components/layout/SellerLayout";
import { useAuth } from "@/lib/auth-context";
import { useLocation } from "wouter";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { TrendingUp, Package, ShoppingBag, Eye } from "lucide-react";

function StatCard({ label, value, icon: Icon, color }: any) {
  return (
    <div className="bg-card border rounded-xl p-5 flex items-center gap-4">
      <div className={`w-12 h-12 rounded-xl ${color} flex items-center justify-center text-white`}>
        <Icon className="w-6 h-6" />
      </div>
      <div>
        <p className="text-muted-foreground text-sm">{label}</p>
        <p className="text-2xl font-bold">{value}</p>
      </div>
    </div>
  );
}

export default function SellerDashboard() {
  const { user } = useAuth();
  const [, setLocation] = useLocation();
  const { data: profile, isLoading: profileLoading } = useSellerProfile();
  const { data: analytics } = useSellerAnalytics();

  if (!user) { setLocation("/login"); return null; }
  if (profileLoading) return <SellerLayout><div className="space-y-4">{Array.from({ length: 4 }).map((_, i) => <Skeleton key={i} className="h-24 rounded-xl" />)}</div></SellerLayout>;

  if (!profile || profile?.status === "pending") {
    return (
      <SellerLayout>
        <div className="text-center py-16">
          <Package className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
          <h2 className="text-2xl font-bold mb-2">
            {!profile ? "Become a Seller" : "Application Pending"}
          </h2>
          <p className="text-muted-foreground mb-6">
            {!profile ? "Register to start selling on EthioMart" : "Your seller application is under review. We'll notify you soon."}
          </p>
          {!profile && <Button onClick={() => setLocation("/become-seller")}>Register as Seller</Button>}
        </div>
      </SellerLayout>
    );
  }

  return (
    <SellerLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold">Welcome back, {user.firstName}!</h1>
          <p className="text-muted-foreground">{profile.storeName} — Your store overview</p>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard label="Revenue (ETB)" value={(analytics?.revenue || 0).toLocaleString()} icon={TrendingUp} color="bg-primary" />
          <StatCard label="Total Orders" value={analytics?.orders || 0} icon={ShoppingBag} color="bg-blue-500" />
          <StatCard label="Products" value={analytics?.products || 0} icon={Package} color="bg-purple-500" />
          <StatCard label="Store Views" value={(analytics?.views || 0).toLocaleString()} icon={Eye} color="bg-orange-500" />
        </div>

        {/* Revenue Chart */}
        {analytics?.revenueChart && (
          <div className="bg-card border rounded-xl p-5">
            <h2 className="font-semibold mb-4">Revenue (Last 7 Days)</h2>
            <ResponsiveContainer width="100%" height={200}>
              <AreaChart data={analytics.revenueChart}>
                <defs>
                  <linearGradient id="rv" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.15} />
                    <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis dataKey="date" tick={{ fontSize: 11 }} />
                <YAxis tick={{ fontSize: 11 }} />
                <Tooltip formatter={(v: any) => [`ETB ${v.toLocaleString()}`, "Revenue"]} />
                <Area type="monotone" dataKey="value" stroke="hsl(var(--primary))" fill="url(#rv)" strokeWidth={2} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        )}

        {/* Top Products */}
        {analytics?.topProducts?.length > 0 && (
          <div className="bg-card border rounded-xl p-5">
            <h2 className="font-semibold mb-4">Top Products</h2>
            <div className="space-y-3">
              {analytics.topProducts.map((p: any, i: number) => (
                <div key={p.id} className="flex items-center gap-3">
                  <span className="w-6 text-sm text-muted-foreground font-medium">#{i + 1}</span>
                  <img src={p.image || "https://placehold.co/40x40"} alt={p.name} className="w-10 h-10 rounded-lg object-cover border" />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">{p.name}</p>
                    <p className="text-xs text-muted-foreground">{p.sales} sold</p>
                  </div>
                  <p className="text-sm font-semibold">ETB {(p.revenue || 0).toLocaleString()}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </SellerLayout>
  );
}
