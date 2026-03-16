import { ReactNode } from "react";
import { Link, useLocation } from "wouter";
import { useAuth } from "@/lib/auth-context";
import { LayoutDashboard, Package, ShoppingBag, BarChart2, LogOut, ChevronRight, Store } from "lucide-react";
import { Button } from "@/components/ui/button";

const NAV = [
  { href: "/seller", label: "Dashboard", icon: LayoutDashboard },
  { href: "/seller/products", label: "Products", icon: Package },
  { href: "/seller/orders", label: "Orders", icon: ShoppingBag },
  { href: "/seller/analytics", label: "Analytics", icon: BarChart2 },
];

export function SellerLayout({ children }: { children: ReactNode }) {
  const [location] = useLocation();
  const { user, logout } = useAuth();

  return (
    <div className="min-h-screen bg-background flex">
      {/* Sidebar */}
      <aside className="w-60 bg-card border-r shrink-0 flex flex-col">
        <div className="p-4 border-b">
          <Link href="/" className="flex items-center gap-2 text-primary font-bold text-lg">
            <Store className="w-6 h-6" />
            EthioMart
          </Link>
          <p className="text-xs text-muted-foreground mt-1">Seller Portal</p>
        </div>
        <nav className="flex-1 p-3 space-y-1">
          {NAV.map(item => {
            const Icon = item.icon;
            const active = location === item.href;
            return (
              <Link key={item.href} href={item.href}
                className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${active ? "bg-primary text-white" : "hover:bg-muted text-foreground"}`}>
                <Icon className="w-4 h-4" />
                {item.label}
              </Link>
            );
          })}
        </nav>
        <div className="p-3 border-t">
          <div className="flex items-center gap-2 px-3 py-2 mb-2">
            <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center text-primary font-semibold text-sm">
              {user?.firstName?.[0]}
            </div>
            <div className="text-sm">
              <p className="font-medium">{user?.firstName} {user?.lastName}</p>
              <p className="text-muted-foreground text-xs">Seller</p>
            </div>
          </div>
          <button onClick={logout} className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-muted-foreground hover:bg-muted hover:text-foreground">
            <LogOut className="w-4 h-4" /> Sign Out
          </button>
        </div>
      </aside>
      {/* Main content */}
      <main className="flex-1 overflow-auto p-6">{children}</main>
    </div>
  );
}
