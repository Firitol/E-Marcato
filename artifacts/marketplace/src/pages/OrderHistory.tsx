import { Link } from "wouter";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { useOrders } from "@/lib/api";
import { Package, Clock, CheckCircle2, XCircle, Truck, ChevronRight } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/lib/auth-context";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { format } from "date-fns";

export default function OrderHistory() {
  const { user } = useAuth();
  const [, setLocation] = useLocation();
  const { data, isLoading } = useOrders();

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "delivered": return <Badge className="bg-green-500 text-white border-0"><CheckCircle2 className="w-3 h-3 mr-1" /> Delivered</Badge>;
      case "processing": return <Badge className="bg-blue-500 text-white border-0"><Clock className="w-3 h-3 mr-1" /> Processing</Badge>;
      case "shipped": return <Badge className="bg-primary text-white border-0"><Truck className="w-3 h-3 mr-1" /> Shipped</Badge>;
      case "cancelled": return <Badge variant="destructive"><XCircle className="w-3 h-3 mr-1" /> Cancelled</Badge>;
      default: return <Badge variant="secondary" className="capitalize">{status}</Badge>;
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen flex flex-col bg-background">
        <Navbar />
        <div className="container mx-auto px-4 py-16 text-center">
          <Package className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
          <h2 className="text-2xl font-bold mb-2">My Orders</h2>
          <p className="text-muted-foreground mb-6">Please sign in to view your orders</p>
          <Button onClick={() => setLocation("/login")}>Sign In</Button>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />
      <main className="flex-1 container mx-auto px-4 py-8 max-w-5xl">
        <h1 className="text-3xl font-bold text-foreground mb-8">My Orders</h1>

        {isLoading ? (
          <div className="space-y-4">
            {[1, 2, 3].map(i => <div key={i} className="h-32 bg-muted animate-pulse rounded-2xl" />)}
          </div>
        ) : !data?.orders?.length ? (
          <div className="text-center py-20 bg-card rounded-3xl border border-border shadow-sm">
            <Package className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
            <h2 className="text-xl font-bold mb-2">No orders yet</h2>
            <p className="text-muted-foreground mb-6">When you place orders, they will appear here.</p>
            <Link href="/" className="text-primary font-medium hover:underline">Start Shopping</Link>
          </div>
        ) : (
          <div className="space-y-6">
            {data.orders.map((order: any) => (
              <div key={order.id} className="bg-card rounded-2xl border border-border shadow-sm overflow-hidden hover:shadow-md transition-shadow">
                <div className="bg-muted/50 px-6 py-4 flex flex-col sm:flex-row items-start sm:items-center justify-between border-b border-border gap-4">
                  <div className="flex gap-8">
                    <div>
                      <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1">Order Placed</p>
                      <p className="text-sm font-medium">{order.createdAt ? format(new Date(order.createdAt), "MMM dd, yyyy") : "-"}</p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1">Total</p>
                      <p className="text-sm font-medium text-primary">ETB {order.total?.toLocaleString()}</p>
                    </div>
                    <div className="hidden sm:block">
                      <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1">Order #</p>
                      <p className="text-sm font-medium font-mono">{order.orderNumber}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    {getStatusBadge(order.status)}
                    <Link href={`/orders/${order.id}`} className="text-sm text-primary hover:underline flex items-center font-medium">
                      View Details <ChevronRight className="w-4 h-4 ml-1" />
                    </Link>
                  </div>
                </div>
                <div className="p-6">
                  {order.items?.slice(0, 2).map((item: any, idx: number) => (
                    <div key={item.id} className={`flex items-center gap-4 ${idx > 0 ? "mt-4 pt-4 border-t border-border" : ""}`}>
                      <div className="w-16 h-16 bg-muted rounded-lg border overflow-hidden shrink-0">
                        {item.product?.images?.[0] && <img src={item.product.images[0]} alt="" className="w-full h-full object-cover" />}
                      </div>
                      <div className="flex-1 min-w-0">
                        <Link href={`/product/${item.productId}`} className="font-semibold hover:text-primary line-clamp-1">
                          {item.product?.name || `Product #${item.productId}`}
                        </Link>
                        <p className="text-sm text-muted-foreground">Qty: {item.quantity}</p>
                      </div>
                    </div>
                  ))}
                  {order.items?.length > 2 && (
                    <p className="text-sm text-muted-foreground mt-4 pt-4 border-t border-border">
                      + {order.items.length - 2} more items
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
}
