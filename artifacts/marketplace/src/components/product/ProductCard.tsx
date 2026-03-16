import { Link } from "wouter";
import { Star, ShoppingCart, Heart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { api } from "@/lib/api";
import { useToast } from "@/hooks/use-toast";
import { useQueryClient } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { useAuth } from "@/lib/auth-context";

interface ProductCardProps {
  product: any;
}

export function ProductCard({ product }: ProductCardProps) {
  const { toast } = useToast();
  const qc = useQueryClient();
  const { user } = useAuth();

  const handleAddToCart = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!user) {
      toast({ variant: "destructive", title: "Please sign in", description: "Sign in to add items to your cart" });
      return;
    }
    try {
      await api.post("/cart", { productId: product.id, quantity: 1 });
      qc.invalidateQueries({ queryKey: ["cart"] });
      toast({ title: "Added to cart!", description: `${product.name} added to your cart.` });
    } catch (err: any) {
      toast({ variant: "destructive", title: "Failed to add", description: err.message });
    }
  };

  const mainImage = product.images && product.images.length > 0
    ? product.images[0]
    : `https://placehold.co/400x400?text=${encodeURIComponent(product.name || "Product")}`;

  const price = typeof product.price === "number" ? product.price : parseFloat(product.price) || 0;
  const originalPrice = product.originalPrice ? (typeof product.originalPrice === "number" ? product.originalPrice : parseFloat(product.originalPrice)) : null;
  const discount = product.discount || (originalPrice && originalPrice > price ? Math.round((1 - price / originalPrice) * 100) : null);

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="group relative bg-card rounded-2xl border border-border/50 overflow-hidden hover:shadow-xl hover:shadow-primary/5 hover:border-primary/20 transition-all duration-300 flex flex-col h-full"
    >
      <Link href={`/product/${product.id}`} className="flex-1 flex flex-col">
        <div className="relative aspect-square overflow-hidden bg-muted/30">
          {discount && discount > 0 && (
            <Badge className="absolute top-3 left-3 z-10 bg-destructive text-destructive-foreground hover:bg-destructive shadow-md">
              -{discount}%
            </Badge>
          )}
          <img
            src={mainImage}
            alt={product.name}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            loading="lazy"
            onError={(e) => {
              (e.target as HTMLImageElement).src = `https://placehold.co/400x400?text=${encodeURIComponent(product.name || "Product")}`;
            }}
          />
        </div>

        <div className="p-4 flex flex-col flex-1">
          <div className="text-xs font-medium text-primary/80 mb-1">{product.categoryName || product.category?.name}</div>
          <h3 className="font-semibold text-foreground line-clamp-2 mb-2 group-hover:text-primary transition-colors">
            {product.name}
          </h3>

          <div className="flex items-center gap-1 mb-3 mt-auto">
            <div className="flex text-amber-400">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className={`w-3.5 h-3.5 ${i < Math.floor(product.rating || 0) ? "fill-current" : "text-muted-foreground/30"}`} />
              ))}
            </div>
            <span className="text-xs text-muted-foreground ml-1">({product.reviewCount || 0})</span>
          </div>

          <div className="flex items-end justify-between mt-1">
            <div>
              <div className="font-bold text-lg text-foreground">ETB {price.toLocaleString()}</div>
              {originalPrice && originalPrice > price && (
                <span className="text-xs text-muted-foreground line-through">ETB {originalPrice.toLocaleString()}</span>
              )}
            </div>
            <Button
              size="icon"
              className="rounded-full w-10 h-10 shadow-md bg-primary hover:bg-primary/90 text-primary-foreground shrink-0 transition-transform active:scale-95"
              onClick={handleAddToCart}
              disabled={product.stock <= 0}
            >
              <ShoppingCart className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
