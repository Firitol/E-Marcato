import { useParams, useLocation } from "wouter";
import { useOrder } from "@/lib/api";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { ArrowLeft, Package, Truck, CheckCircle, Clock, XCircle } from "lucide-react";
import { format } from "date-fns";

const STATUS_CONFIG: Record<string, { label: string; color: string; icon: any }> = {
  pending: { label: "Pending", color: "bg-yellow-100 text-yellow-800", icon: Clock },
  confirmed: { label: "Confirmed", color: "bg-blue-100 text-blue-800", icon: CheckCircle },
  processing: { label: "Processing", color: "bg-purple-100 text-purple-800", icon: Package },
  shipped: { label: "Shipped", color: "bg-indigo-100 text-indigo-800", icon: Truck },
  delivered: { label: "Delivered", color: "bg-green-100 text-green-800", icon: CheckCircle },
  cancelled: { label: "Cancelled", color: "bg-red-100 text-red-800", icon: XCircle },
};

const TRACKING_STEPS = ["pending", "confirmed", "processing", "shipped", "delivered"];

export default function OrderDetailPage() {
  const { id } = useParams<{ id: string }>();
  const [, setLocation] = useLocation();
  const { data: order, isLoading } = useOrder(id ? parseInt(id) : null);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="container mx-auto px-4 py-8 max-w-4xl">
          <Skeleton className="h-8 w-48 mb-6" />
          <div className="space-y-4">
            {Array.from({ length: 3 }).map((_, i) => <Skeleton key={i} className="h-24 w-full rounded-xl" />)}
          </div>
        </div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="text-center py-16"><p className="text-muted-foreground">Order not found</p></div>
      </div>
    );
  }

  const statusConfig = STATUS_CONFIG[order.status] || STATUS_CONFIG.pending;
  const StatusIcon = statusConfig.icon;
  const currentStepIdx = TRACKING_STEPS.indexOf(order.status);

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <button onClick={() => setLocation("/orders")} className="flex items-center gap-2 text-muted-foreground hover:text-foreground mb-6 text-sm">
          <ArrowLeft className="w-4 h-4" /> Back to Orders
        </button>

        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold">Order {order.orderNumber}</h1>
            <p className="text-muted-foreground text-sm">
              Placed on {order.createdAt ? format(new Date(order.createdAt), "MMMM d, yyyy") : "-"}
            </p>
          </div>
          <Badge className={`${statusConfig.color} border-0 flex items-center gap-1.5 px-3 py-1`}>
            <StatusIcon className="w-3.5 h-3.5" />
            {statusConfig.label}
          </Badge>
        </div>

        {/* Tracking Timeline */}
        {order.status !== "cancelled" && (
          <div className="bg-card border rounded-xl p-6 mb-6">
            <h2 className="font-semibold mb-4">Order Tracking</h2>
            <div className="flex items-center gap-0">
              {TRACKING_STEPS.map((step, idx) => {
                const stepConfig = STATUS_CONFIG[step];
                const StepIcon = stepConfig.icon;
                const done = idx <= currentStepIdx;
                return (
                  <div key={step} className="flex-1 flex flex-col items-center">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center ${done ? "bg-primary text-white" : "bg-muted text-muted-foreground"}`}>
                      <StepIcon className="w-4 h-4" />
                    </div>
                    <p className={`text-xs mt-1 text-center ${done ? "text-primary font-medium" : "text-muted-foreground"}`}>
                      {stepConfig.label}
                    </p>
                    {idx < TRACKING_STEPS.length - 1 && (
                      <div className={`absolute ml-8 h-0.5 flex-1 ${done ? "bg-primary" : "bg-muted"}`} style={{ width: "calc(100% - 2rem)" }} />
                    )}
                  </div>
                );
              })}
            </div>
            {order.trackingNumber && (
              <p className="text-sm text-muted-foreground mt-4">Tracking #: <span className="font-mono font-medium text-foreground">{order.trackingNumber}</span></p>
            )}
          </div>
        )}

        {/* Items */}
        <div className="bg-card border rounded-xl p-6 mb-6">
          <h2 className="font-semibold mb-4">Order Items ({order.items?.length || 0})</h2>
          <div className="space-y-4">
            {order.items?.map((item: any) => (
              <div key={item.id} className="flex gap-4 items-center">
                <img
                  src={item.product?.images?.[0] || "https://placehold.co/60x60"}
                  alt={item.product?.name}
                  className="w-16 h-16 rounded-lg object-cover border"
                />
                <div className="flex-1">
                  <p className="font-medium text-sm">{item.product?.name}</p>
                  <p className="text-muted-foreground text-sm">Qty: {item.quantity} × ETB {item.price?.toLocaleString()}</p>
                </div>
                <p className="font-semibold">ETB {item.subtotal?.toLocaleString()}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {/* Shipping Address */}
          <div className="bg-card border rounded-xl p-6">
            <h2 className="font-semibold mb-3">Delivery Address</h2>
            <p className="font-medium">{order.shippingAddress?.fullName}</p>
            <p className="text-sm text-muted-foreground">{order.shippingAddress?.street}</p>
            <p className="text-sm text-muted-foreground">{order.shippingAddress?.city}, {order.shippingAddress?.region}</p>
            <p className="text-sm text-muted-foreground">Phone: {order.shippingAddress?.phone}</p>
          </div>

          {/* Payment Summary */}
          <div className="bg-card border rounded-xl p-6">
            <h2 className="font-semibold mb-3">Payment Summary</h2>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between"><span className="text-muted-foreground">Subtotal</span><span>ETB {order.subtotal?.toLocaleString()}</span></div>
              <div className="flex justify-between"><span className="text-muted-foreground">Shipping</span><span>ETB {order.shipping?.toLocaleString()}</span></div>
              <div className="flex justify-between font-semibold text-base border-t pt-2">
                <span>Total</span><span>ETB {order.total?.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>Payment Method</span>
                <span className="capitalize">{order.paymentMethod?.replace(/_/g, " ")}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}
