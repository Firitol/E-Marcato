import { Link } from "wouter";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { ProductCard } from "@/components/product/ProductCard";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useRecommendations, useCategories } from "@/lib/api";
import { ArrowRight, Zap, TrendingUp, ShieldCheck, Truck } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { motion } from "framer-motion";

export default function HomePage() {
  const { data, isLoading } = useRecommendations();

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />
      
      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative w-full h-[500px] md:h-[600px] flex items-center justify-center overflow-hidden">
          {/* Background image with overlay wash */}
          <div className="absolute inset-0 z-0">
            <img 
              src={`${import.meta.env.BASE_URL}images/hero-bg.png`} 
              alt="EthioMart Marketplace" 
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/60 to-transparent"></div>
          </div>
          
          <div className="container mx-auto px-4 relative z-10 flex flex-col items-start max-w-4xl ml-4 md:ml-auto">
            <motion.span 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="px-4 py-1.5 rounded-full bg-primary/20 text-primary-foreground border border-primary/30 backdrop-blur-md text-sm font-semibold mb-6 shadow-lg shadow-black/10"
            >
              New Arrivals Daily
            </motion.span>
            
            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-4xl md:text-6xl lg:text-7xl font-display font-extrabold text-white leading-tight mb-6"
            >
              Ethiopia's <span className="text-secondary">Premium</span> <br/>
              Marketplace
            </motion.h1>
            
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-lg md:text-xl text-gray-200 mb-8 max-w-lg leading-relaxed"
            >
              Shop millions of authentic products from local and global brands. Fast delivery to your doorstep.
            </motion.p>
            
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="flex flex-wrap gap-4"
            >
              <Button size="lg" className="rounded-full px-8 h-14 text-base font-bold bg-primary text-primary-foreground hover:bg-primary/90 shadow-xl shadow-primary/30" asChild>
                <Link href="/search">Shop Now</Link>
              </Button>
              <Button size="lg" variant="outline" className="rounded-full px-8 h-14 text-base font-bold bg-white/10 text-white border-white/20 hover:bg-white/20 backdrop-blur-md" asChild>
                <Link href="/categories">Browse Categories</Link>
              </Button>
            </motion.div>
          </div>
        </section>

        {/* Features Bar */}
        <section className="bg-card border-b border-border shadow-sm relative z-20">
          <div className="container mx-auto px-4 py-6">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 divide-x divide-border/50">
              <div className="flex items-center gap-4 pl-0 md:pl-4">
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-primary shrink-0">
                  <Truck className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="font-bold text-sm">Fast Delivery</h4>
                  <p className="text-xs text-muted-foreground">Across all regions</p>
                </div>
              </div>
              <div className="flex items-center gap-4 pl-4 md:pl-8">
                <div className="w-12 h-12 rounded-full bg-secondary/10 flex items-center justify-center text-secondary shrink-0">
                  <ShieldCheck className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="font-bold text-sm">Secure Payment</h4>
                  <p className="text-xs text-muted-foreground">Telebirr & CBE Birr</p>
                </div>
              </div>
              <div className="flex items-center gap-4 pl-4 md:pl-8">
                <div className="w-12 h-12 rounded-full bg-accent/10 flex items-center justify-center text-accent shrink-0">
                  <Zap className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="font-bold text-sm">Daily Deals</h4>
                  <p className="text-xs text-muted-foreground">Save up to 50%</p>
                </div>
              </div>
              <div className="flex items-center gap-4 pl-4 md:pl-8">
                <div className="w-12 h-12 rounded-full bg-blue-500/10 flex items-center justify-center text-blue-500 shrink-0">
                  <TrendingUp className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="font-bold text-sm">Top Brands</h4>
                  <p className="text-xs text-muted-foreground">100% Authentic</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Featured Products */}
        <section className="py-16 container mx-auto px-4">
          <div className="flex items-end justify-between mb-8">
            <div>
              <h2 className="text-3xl font-display font-bold text-foreground">Featured Products</h2>
              <p className="text-muted-foreground mt-2">Handpicked quality items just for you</p>
            </div>
            <Button variant="ghost" className="hidden sm:flex group" asChild>
              <Link href="/search?sort=popular">
                View All <ArrowRight className="ml-2 w-4 h-4 transition-transform group-hover:translate-x-1" />
              </Link>
            </Button>
          </div>

          {isLoading ? (
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-6">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="flex flex-col gap-3">
                  <Skeleton className="w-full aspect-square rounded-2xl" />
                  <Skeleton className="h-4 w-3/4" />
                  <Skeleton className="h-4 w-1/2" />
                  <Skeleton className="h-8 w-1/3 mt-2" />
                </div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-6">
              {data?.featured?.slice(0, 5).map((product: any) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}
        </section>

        {/* Promotional Banner */}
        <section className="py-8 container mx-auto px-4">
          <div className="w-full rounded-3xl overflow-hidden bg-gradient-to-r from-accent to-emerald-700 text-white relative flex flex-col md:flex-row items-center p-8 md:p-12 shadow-2xl">
            <div className="relative z-10 flex-1 md:pr-8">
              <Badge className="bg-white/20 text-white border-white/30 hover:bg-white/30 mb-4 backdrop-blur-sm font-bold no-default-active-elevate">Holiday Special</Badge>
              <h2 className="text-3xl md:text-5xl font-display font-bold mb-4 leading-tight">Big Saving Days Are Here!</h2>
              <p className="text-emerald-50 text-lg mb-8 max-w-xl">Get extra 20% off on all electronics when you pay with CBE Birr. Limited time offer.</p>
              <Button size="lg" className="bg-white text-accent hover:bg-gray-100 font-bold rounded-full px-8 shadow-lg">
                Shop Electronics
              </Button>
            </div>
            <div className="mt-8 md:mt-0 relative z-10 w-full md:w-1/3 flex justify-center">
              {/* ecommerce electronics gadgets unsplash */}
              <img src="https://images.unsplash.com/photo-1498049794561-7780e7231661?w=600&q=80" alt="Electronics Promo" className="rounded-2xl shadow-2xl rotate-[-5deg] hover:rotate-0 transition-transform duration-500 border-4 border-white/10" />
            </div>
            {/* Decorative background circles */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
            <div className="absolute bottom-0 left-0 w-96 h-96 bg-black/10 rounded-full blur-3xl translate-y-1/2 -translate-x-1/4"></div>
          </div>
        </section>

        {/* Trending */}
        <section className="py-16 container mx-auto px-4 bg-muted/30 rounded-3xl my-8 border border-border/50">
          <div className="flex items-end justify-between mb-8">
            <div>
              <h2 className="text-3xl font-display font-bold text-foreground">Trending Now</h2>
              <p className="text-muted-foreground mt-2">What everyone is buying</p>
            </div>
          </div>

          {isLoading ? (
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-6">
               {[...Array(5)].map((_, i) => (
                <Skeleton key={i} className="w-full aspect-[3/4] rounded-2xl" />
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-6">
              {data?.trending?.slice(0, 5).map((product: any) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}
        </section>
        
      </main>

      <Footer />
    </div>
  );
}
