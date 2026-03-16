import { useWishlist } from "@/lib/api";
import { api } from "@/lib/api";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { ProductCard } from "@/components/product/ProductCard";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Heart } from "lucide-react";
import { useAuth } from "@/lib/auth-context";
import { useLocation } from "wouter";
import { useQueryClient } from "@tanstack/react-query";

export default function WishlistPage() {
  const { user } = useAuth();
  const [, setLocation] = useLocation();
  const { data: wishlist, isLoading } = useWishlist();
  const qc = useQueryClient();

  if (!user) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="container mx-auto px-4 py-16 text-center">
          <Heart className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
          <h2 className="text-2xl font-bold mb-2">Your Wishlist</h2>
          <p className="text-muted-foreground mb-6">Please sign in to view your wishlist</p>
          <Button onClick={() => setLocation("/login")}>Sign In</Button>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        <div className="flex items-center gap-3 mb-6">
          <Heart className="w-6 h-6 text-red-500" />
          <h1 className="text-2xl font-bold">My Wishlist</h1>
          <span className="text-muted-foreground">({wishlist?.length || 0} items)</span>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="bg-card rounded-xl border p-3">
                <Skeleton className="h-40 w-full rounded-lg mb-3" />
                <Skeleton className="h-4 w-3/4 mb-2" />
                <Skeleton className="h-4 w-1/2" />
              </div>
            ))}
          </div>
        ) : wishlist?.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
            {wishlist.map((p: any) => (
              <div key={p.id} className="relative">
                <ProductCard product={p} />
                <button
                  onClick={async () => {
                    await api.delete(`/wishlist/${p.id}`);
                    qc.invalidateQueries({ queryKey: ["wishlist"] });
                  }}
                  className="absolute top-2 right-2 z-10 bg-white rounded-full p-1 shadow-sm hover:bg-red-50"
                >
                  <Heart className="w-4 h-4 fill-red-500 text-red-500" />
                </button>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <Heart className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
            <h3 className="text-lg font-semibold mb-2">Your wishlist is empty</h3>
            <p className="text-muted-foreground mb-6">Save items you love to your wishlist</p>
            <Button onClick={() => setLocation("/")}>Start Shopping</Button>
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
}
