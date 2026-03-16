import { useState } from "react";
import { useSellerAnalytics } from "@/lib/api";
import { SellerLayout } from "@/components/layout/SellerLayout";
import { useAuth } from "@/lib/auth-context";
import { useLocation } from "wouter";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts";

const COLORS = ["hsl(var(--chart-1))", "hsl(var(--chart-2))", "hsl(var(--chart-3))", "hsl(var(--chart-4))", "hsl(var(--chart-5))"];

export default function SellerAnalytics() {
  const { user } = useAuth();
  const [, setLocation] = useLocation();
  const [period, setPeriod] = useState("30d");
  const { data: analytics, isLoading } = useSellerAnalytics(period);

  if (!user) { setLocation("/login"); return null; }

  return (
    <SellerLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">Analytics</h1>
            <p className="text-muted-foreground">Track your store performance</p>
          </div>
          <Select value={period} onValueChange={setPeriod}>
            <SelectTrigger className="w-32"><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="7d">Last 7 days</SelectItem>
              <SelectItem value="30d">Last 30 days</SelectItem>
              <SelectItem value="90d">Last 90 days</SelectItem>
              <SelectItem value="1y">Last year</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { label: "Revenue", value: `ETB ${(analytics?.revenue || 0).toLocaleString()}` },
            { label: "Orders", value: analytics?.orders || 0 },
            { label: "Products", value: analytics?.products || 0 },
            { label: "Views", value: (analytics?.views || 0).toLocaleString() },
          ].map(stat => (
            <div key={stat.label} className="bg-card border rounded-xl p-5">
              <p className="text-sm text-muted-foreground">{stat.label}</p>
              <p className="text-2xl font-bold mt-1">{stat.value}</p>
            </div>
          ))}
        </div>

        <div className="grid lg:grid-cols-2 gap-6">
          <div className="bg-card border rounded-xl p-5">
            <h2 className="font-semibold mb-4">Revenue Over Time</h2>
            <ResponsiveContainer width="100%" height={220}>
              <AreaChart data={analytics?.revenueChart || []}>
                <defs>
                  <linearGradient id="rev" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.15} />
                    <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis dataKey="date" tick={{ fontSize: 10 }} />
                <YAxis tick={{ fontSize: 10 }} />
                <Tooltip formatter={(v: any) => [`ETB ${v.toLocaleString()}`, "Revenue"]} />
                <Area type="monotone" dataKey="value" stroke="hsl(var(--primary))" fill="url(#rev)" strokeWidth={2} />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          <div className="bg-card border rounded-xl p-5">
            <h2 className="font-semibold mb-4">Order Status</h2>
            <ResponsiveContainer width="100%" height={220}>
              <PieChart>
                <Pie data={analytics?.orderStatusBreakdown || []} dataKey="count" nameKey="status" cx="50%" cy="50%" outerRadius={80}>
                  {(analytics?.orderStatusBreakdown || []).map((_: any, idx: number) => (
                    <Cell key={idx} fill={COLORS[idx % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </SellerLayout>
  );
}
