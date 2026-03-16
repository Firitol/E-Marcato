import { useParams, Link } from "wouter";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { ProductCard } from "@/components/product/ProductCard";
import { useProduct, useSimilarProducts, useProductReviews } from "@/lib/api";
import { api } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Star, Shield, Truck, RotateCcw, Heart, Share2, Plus, Minus, ShoppingCart } from "lucide-react";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { useQueryClient } from "@tanstack/react-query";
import { useAuth } from "@/lib/auth-context";

export default function ProductDetails() {
  const { id } = useParams<{ id: string }>();
  const productId = id ? parseInt(id) : null;
  const { toast } = useToast();
  const qc = useQueryClient();
  const { user } = useAuth();

  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState(0);

  const { data: product, isLoading } = useProduct(productId);
  const { data: similar } = useSimilarProducts(productId);
  const { data: reviews } = useProductReviews(productId);

  const handleAddToCart = async () => {
    if (!user) {
      toast({ variant: "destructive", title: "Please sign in", description: "Sign in to add items to your cart" });
      return;
    }
    try {
      await api.post("/cart", { productId: product.id, quantity });
      qc.invalidateQueries({ queryKey: ["cart"] });
      toast({ title: "Added to cart!", description: `${quantity} × ${product.name}` });
    } catch (err: any) {
      toast({ variant: "destructive", title: "Failed", description: err.message });
    }
  };

  const handleWishlist = async () => {
    if (!user) { toast({ variant: "destructive", title: "Please sign in" }); return; }
    try {
      await api.post("/wishlist", { productId: product.id });
      qc.invalidateQueries({ queryKey: ["wishlist"] });
      toast({ title: "Added to wishlist!" });
    } catch {
      toast({ variant: "destructive", title: "Failed to add to wishlist" });
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <div className="container mx-auto px-4 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            <Skeleton className="aspect-square w-full rounded-3xl" />
            <div className="space-y-6">
              <Skeleton className="h-8 w-3/4" />
              <Skeleton className="h-12 w-1/3" />
              <Skeleton className="h-24 w-full" />
              <Skeleton className="h-12 w-full" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!product) return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />
      <div className="text-center py-20 text-xl font-bold">Product not found.</div>
    </div>
  );

  const images = product.images?.length ? product.images : [`https://placehold.co/600x600?text=${encodeURIComponent(product.name)}`];
  const price = typeof product.price === "number" ? product.price : parseFloat(product.price) || 0;
  const originalPrice = product.originalPrice ? (typeof product.originalPrice === "number" ? product.originalPrice : parseFloat(product.originalPrice)) : null;

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />
      <main className="flex-1 container mx-auto px-4 py-8">
        <div className="flex items-center text-sm text-muted-foreground mb-8 gap-2">
          <Link href="/" className="hover:text-primary">Home</Link>
          <span>/</span>
          <Link href={`/category/${product.categorySlug || product.categoryName}`} className="hover:text-primary">{product.categoryName}</Link>
          <span>/</span>
          <span className="text-foreground font-medium truncate max-w-[200px]">{product.name}</span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16">
          <div className="space-y-4">
            <div className="relative aspect-square rounded-3xl overflow-hidden bg-muted border border-border/50 shadow-sm">
              {product.discount && product.discount > 0 && (
                <Badge className="absolute top-4 left-4 z-10 text-base py-1 px-3 bg-destructive text-destructive-foreground shadow-lg">
                  -{product.discount}% OFF
                </Badge>
              )}
              <img src={images[selectedImage]} alt={product.name} className="w-full h-full object-cover" onError={(e) => { (e.target as HTMLImageElement).src = `https://placehold.co/600x600?text=${encodeURIComponent(product.name)}`; }} />
            </div>
            {images.length > 1 && (
              <div className="flex gap-3 overflow-x-auto pb-2">
                {images.map((img: string, idx: number) => (
                  <button key={idx} onClick={() => setSelectedImage(idx)}
                    className={`relative w-20 h-20 rounded-xl overflow-hidden border-2 shrink-0 transition-all ${selectedImage === idx ? "border-primary ring-2 ring-primary/20" : "border-transparent opacity-70 hover:opacity-100"}`}>
                    <img src={img} alt="" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          <div className="flex flex-col">
            <div className="mb-6">
              <h1 className="text-3xl font-bold text-foreground mb-4 leading-tight">{product.name}</h1>
              <div className="flex items-center gap-4 mb-4">
                <div className="flex text-amber-400">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className={`w-4 h-4 ${i < Math.floor(product.rating || 0) ? "fill-current" : "text-muted-foreground/30"}`} />
                  ))}
                </div>
                <span className="text-sm font-medium">{product.rating}</span>
                <span className="text-sm text-muted-foreground">({product.reviewCount || 0} reviews)</span>
                <span className="text-sm text-muted-foreground">{product.sold || 0} sold</span>
              </div>
              <div className="flex items-end gap-3 p-4 bg-muted/50 rounded-2xl border border-border/50">
                <span className="text-4xl font-bold text-primary">ETB {price.toLocaleString()}</span>
                {originalPrice && originalPrice > price && (
                  <span className="text-lg text-muted-foreground line-through mb-1">ETB {originalPrice.toLocaleString()}</span>
                )}
              </div>
            </div>

            <p className="text-base text-muted-foreground mb-8 leading-relaxed">{product.description || "No description available."}</p>
            <div className="h-px w-full bg-border mb-8" />

            <div className="space-y-6">
              <div className="flex items-center gap-4">
                <span className="font-medium">Quantity</span>
                <div className="flex items-center border border-border rounded-full h-11 bg-background">
                  <button onClick={() => setQuantity(Math.max(1, quantity - 1))} className="w-10 h-full flex items-center justify-center text-muted-foreground hover:text-primary" disabled={quantity <= 1}>
                    <Minus className="w-4 h-4" />
                  </button>
                  <span className="w-12 text-center font-semibold">{quantity}</span>
                  <button onClick={() => setQuantity(Math.min(product.stock, quantity + 1))} className="w-10 h-full flex items-center justify-center text-muted-foreground hover:text-primary" disabled={quantity >= product.stock}>
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
                <span className="text-sm text-muted-foreground">{product.stock} available</span>
              </div>

              <div className="flex gap-4">
                <Button size="lg" className="flex-1 rounded-full h-14 text-lg shadow-lg shadow-primary/25" onClick={handleAddToCart} disabled={product.stock <= 0}>
                  <ShoppingCart className="mr-2 w-5 h-5" />
                  {product.stock > 0 ? "Add to Cart" : "Out of Stock"}
                </Button>
                <Button size="icon" variant="outline" className="w-14 h-14 rounded-full border-2 hover:text-red-500 hover:bg-red-50 hover:border-red-200" onClick={handleWishlist}>
                  <Heart className="w-5 h-5" />
                </Button>
              </div>
            </div>

            <div className="mt-8 grid grid-cols-3 gap-4 pt-8 border-t border-border">
              <div className="flex flex-col items-center text-center p-4 rounded-xl bg-card border border-border shadow-sm">
                <Shield className="w-8 h-8 text-green-500 mb-2" />
                <span className="font-semibold text-sm">Authentic</span>
                <span className="text-xs text-muted-foreground">100% Genuine</span>
              </div>
              <div className="flex flex-col items-center text-center p-4 rounded-xl bg-card border border-border shadow-sm">
                <Truck className="w-8 h-8 text-primary mb-2" />
                <span className="font-semibold text-sm">Fast Delivery</span>
                <span className="text-xs text-muted-foreground">Local network</span>
              </div>
              <div className="flex flex-col items-center text-center p-4 rounded-xl bg-card border border-border shadow-sm">
                <RotateCcw className="w-8 h-8 text-orange-500 mb-2" />
                <span className="font-semibold text-sm">Free Returns</span>
                <span className="text-xs text-muted-foreground">Within 7 days</span>
              </div>
            </div>

            {product.seller && (
              <div className="mt-6 flex items-center justify-between p-4 bg-muted/30 rounded-xl border border-border">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-sm border border-border">
                    <span className="font-bold text-primary">{product.seller.storeName?.[0]}</span>
                  </div>
                  <div>
                    <h4 className="font-semibold text-sm">Sold by {product.seller.storeName}</h4>
                    <div className="flex items-center text-xs text-muted-foreground">
                      <Star className="w-3 h-3 text-amber-400 fill-current mr-1" />
                      {product.seller.rating} rating
                    </div>
                  </div>
                </div>
                <Button variant="outline" size="sm" className="rounded-full">Visit Store</Button>
              </div>
            )}
          </div>
        </div>

        {/* Reviews */}
        {reviews?.length > 0 && (
          <section id="reviews" className="py-12 border-t border-border mb-12">
            <h2 className="text-2xl font-bold mb-6">Customer Reviews</h2>
            <div className="grid md:grid-cols-2 gap-4">
              {reviews.slice(0, 4).map((r: any) => (
                <div key={r.id} className="bg-card border rounded-xl p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center text-primary font-semibold text-sm">
                      {r.user?.firstName?.[0]}
                    </div>
                    <span className="font-medium text-sm">{r.user?.firstName} {r.user?.lastName}</span>
                    <div className="flex text-amber-400 ml-auto">
                      {[...Array(5)].map((_, i) => <Star key={i} className={`w-3 h-3 ${i < r.rating ? "fill-current" : "text-muted-foreground/30"}`} />)}
                    </div>
                  </div>
                  <p className="text-sm text-muted-foreground">{r.comment}</p>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Similar Products */}
        {similar?.length > 0 && (
          <section className="py-12 border-t border-border">
            <h2 className="text-2xl font-bold mb-8">You Might Also Like</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-6">
              {similar.slice(0, 5).map((p: any) => <ProductCard key={p.id} product={p} />)}
            </div>
          </section>
        )}
      </main>
      <Footer />
    </div>
  );
}
