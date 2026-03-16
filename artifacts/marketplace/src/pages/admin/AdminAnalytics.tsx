import { useState } from "react";
import { useAdminAnalytics } from "@/lib/api";
import { AdminLayout } from "@/components/layout/AdminLayout";
import { useAuth } from "@/lib/auth-context";
import { useLocation } from "wouter";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts";

const COLORS = ["hsl(var(--chart-1))", "hsl(var(--chart-2))", "hsl(var(--chart-3))", "hsl(var(--chart-4))", "hsl(var(--chart-5))"];

export default function AdminAnalytics() {
  const { user } = useAuth();
  const [, setLocation] = useLocation();
  const [period, setPeriod] = useState("30d");
  const { data, isLoading } = useAdminAnalytics(period);

  if (!user || user.role !== "admin") { setLocation("/login"); return null; }

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">Platform Analytics</h1>
            <p className="text-muted-foreground">Comprehensive platform performance data</p>
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
            { label: "Total Revenue", value: `ETB ${(data?.revenue || 0).toLocaleString()}` },
            { label: "Total Orders", value: (data?.orders || 0).toLocaleString() },
            { label: "Total Users", value: (data?.users || 0).toLocaleString() },
            { label: "Active Sellers", value: (data?.sellers || 0).toLocaleString() },
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
              <AreaChart data={data?.revenueChart || []}>
                <defs>
                  <linearGradient id="plat-rev" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.15} />
                    <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis dataKey="date" tick={{ fontSize: 10 }} />
                <YAxis tick={{ fontSize: 10 }} />
                <Tooltip formatter={(v: any) => [`ETB ${v.toLocaleString()}`, "Revenue"]} />
                <Area type="monotone" dataKey="value" stroke="hsl(var(--primary))" fill="url(#plat-rev)" strokeWidth={2} />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          <div className="bg-card border rounded-xl p-5">
            <h2 className="font-semibold mb-4">User Growth</h2>
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={data?.userGrowthChart || []}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis dataKey="date" tick={{ fontSize: 10 }} />
                <YAxis tick={{ fontSize: 10 }} />
                <Tooltip />
                <Bar dataKey="value" fill="hsl(var(--chart-2))" radius={[4, 4, 0, 0]} name="New Users" />
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="bg-card border rounded-xl p-5">
            <h2 className="font-semibold mb-4">Revenue by Category</h2>
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={data?.categoryRevenue || []} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis type="number" tick={{ fontSize: 10 }} />
                <YAxis type="category" dataKey="name" tick={{ fontSize: 10 }} width={100} />
                <Tooltip formatter={(v: any) => [`ETB ${v.toLocaleString()}`, "Revenue"]} />
                <Bar dataKey="revenue" fill="hsl(var(--primary))" radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="bg-card border rounded-xl p-5">
            <h2 className="font-semibold mb-4">Payment Methods</h2>
            <ResponsiveContainer width="100%" height={220}>
              <PieChart>
                <Pie data={data?.paymentMethods || []} dataKey="count" nameKey="status" cx="50%" cy="50%" outerRadius={80} label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}>
                  {(data?.paymentMethods || []).map((_: any, idx: number) => <Cell key={idx} fill={COLORS[idx % COLORS.length]} />)}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
