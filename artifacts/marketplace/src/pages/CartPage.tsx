import { Link, useLocation } from "wouter";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { useCart } from "@/lib/api";
import { api } from "@/lib/api";
import { Trash2, Plus, Minus, ArrowRight, ShoppingBag } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { useQueryClient } from "@tanstack/react-query";
import { useAuth } from "@/lib/auth-context";

export default function CartPage() {
  const [, setLocation] = useLocation();
  const qc = useQueryClient();
  const { user } = useAuth();
  const { data: cart, isLoading } = useCart();

  const handleUpdate = async (productId: number, qty: number) => {
    await api.put(`/cart/${productId}`, { quantity: qty });
    qc.invalidateQueries({ queryKey: ["cart"] });
  };

  const handleRemove = async (productId: number) => {
    await api.delete(`/cart/${productId}`);
    qc.invalidateQueries({ queryKey: ["cart"] });
  };

  if (!user) {
    return (
      <div className="min-h-screen flex flex-col bg-background">
        <Navbar />
        <div className="container mx-auto px-4 py-16 text-center">
          <ShoppingBag className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
          <h2 className="text-2xl font-bold mb-2">Your Cart</h2>
          <p className="text-muted-foreground mb-6">Please sign in to view your cart</p>
          <Button onClick={() => setLocation("/login")}>Sign In</Button>
        </div>
        <Footer />
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col bg-background">
        <Navbar />
        <div className="container mx-auto px-4 py-8">
          <Skeleton className="h-10 w-48 mb-8" />
          <div className="flex flex-col lg:flex-row gap-8">
            <div className="flex-1 space-y-4">
              {[1, 2].map(i => <Skeleton key={i} className="h-32 w-full rounded-2xl" />)}
            </div>
            <Skeleton className="w-full lg:w-[400px] h-64 rounded-2xl" />
          </div>
        </div>
      </div>
    );
  }

  const items = cart?.items || [];
  const isEmpty = items.length === 0;

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />
      <main className="flex-1 container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-foreground mb-8">Your Cart {items.length > 0 ? `(${items.length})` : ""}</h1>

        {isEmpty ? (
          <div className="flex flex-col items-center justify-center py-20 px-4 text-center bg-card rounded-3xl border border-border shadow-sm">
            <div className="w-24 h-24 bg-muted rounded-full flex items-center justify-center mb-6">
              <ShoppingBag className="w-12 h-12 text-muted-foreground" />
            </div>
            <h2 className="text-2xl font-bold mb-2">Your cart is empty</h2>
            <p className="text-muted-foreground max-w-md mb-8">Discover great products and deals today!</p>
            <Button size="lg" className="rounded-full px-8 bg-primary hover:bg-primary/90" asChild>
              <Link href="/">Start Shopping</Link>
            </Button>
          </div>
        ) : (
          <div className="flex flex-col lg:flex-row gap-8 items-start">
            <div className="flex-1 w-full space-y-4">
              {items.map((item: any) => (
                <div key={item.productId} className="flex flex-col sm:flex-row items-start sm:items-center gap-4 p-4 bg-card rounded-2xl border border-border shadow-sm">
                  <div className="w-24 h-24 rounded-xl bg-muted overflow-hidden shrink-0">
                    <img
                      src={item.product?.images?.[0] || "https://placehold.co/96x96"}
                      alt={item.product?.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <Link href={`/product/${item.productId}`} className="text-lg font-semibold hover:text-primary transition-colors line-clamp-1">
                      {item.product?.name}
                    </Link>
                    <p className="text-sm text-muted-foreground mb-3">{item.product?.categoryName}</p>
                    <div className="flex items-center justify-between w-full">
                      <div className="flex items-center border border-border rounded-full h-9 bg-background">
                        <button onClick={() => handleUpdate(item.productId, Math.max(1, item.quantity - 1))} className="w-9 h-full flex items-center justify-center text-muted-foreground hover:text-primary">
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="w-8 text-center text-sm font-semibold">{item.quantity}</span>
                        <button onClick={() => handleUpdate(item.productId, item.quantity + 1)} className="w-9 h-full flex items-center justify-center text-muted-foreground hover:text-primary">
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>
                      <p className="font-bold text-lg text-primary">ETB {(item.subtotal || (item.price * item.quantity)).toLocaleString()}</p>
                    </div>
                  </div>
                  <button onClick={() => handleRemove(item.productId)} className="p-2 text-muted-foreground hover:text-destructive hover:bg-destructive/10 rounded-full">
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
              ))}
            </div>

            <div className="w-full lg:w-[400px] sticky top-24">
              <div className="bg-card rounded-3xl border border-border shadow-md p-6">
                <h3 className="text-xl font-bold mb-6">Order Summary</h3>
                <div className="space-y-4 mb-6 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Subtotal ({items.length} items)</span>
                    <span className="font-medium">ETB {(cart?.subtotal || 0).toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Shipping</span>
                    <span className="font-medium">ETB {(cart?.shipping || 50).toLocaleString()}</span>
                  </div>
                  <div className="h-px bg-border my-2"></div>
                  <div className="flex justify-between text-lg font-bold">
                    <span>Total</span>
                    <span className="text-primary">ETB {(cart?.total || 0).toLocaleString()}</span>
                  </div>
                </div>
                <Button size="lg" className="w-full rounded-full h-14 text-lg font-bold" onClick={() => setLocation("/checkout")}>
                  Proceed to Checkout <ArrowRight className="ml-2 w-5 h-5" />
                </Button>
                <div className="mt-6 flex items-center justify-center gap-2">
                  <span className="text-xs text-muted-foreground">Secured with Telebirr & CBE Birr</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
}
