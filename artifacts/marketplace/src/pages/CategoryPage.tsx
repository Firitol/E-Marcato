import { useState } from "react";
import { useParams } from "wouter";
import { useProducts, useCategories } from "@/lib/api";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { ProductCard } from "@/components/product/ProductCard";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Label } from "@/components/ui/label";

export default function CategoryPage() {
  const { slug } = useParams<{ slug: string }>();
  const [sort, setSort] = useState("newest");
  const [priceRange, setPriceRange] = useState([0, 50000]);
  const [page, setPage] = useState(1);

  const { data: categoriesData } = useCategories();
  const category = categoriesData?.find((c: any) => c.slug === slug);

  const { data, isLoading } = useProducts({
    category: slug,
    sort,
    minPrice: priceRange[0] || undefined,
    maxPrice: priceRange[1] < 50000 ? priceRange[1] : undefined,
    page,
  });

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="container mx-auto px-4 py-6 max-w-7xl">
        {/* Category Header */}
        <div className="mb-6 p-6 bg-gradient-to-r from-primary/10 to-secondary/10 rounded-2xl">
          <p className="text-4xl mb-2">{category?.icon || "🛍️"}</p>
          <h1 className="text-2xl font-bold">{category?.name || slug}</h1>
          <p className="text-muted-foreground">{data?.total || 0} products available</p>
        </div>

        <div className="flex gap-6">
          {/* Sidebar filters */}
          <aside className="w-60 shrink-0 hidden md:block">
            <div className="bg-card rounded-xl border p-4 space-y-5">
              <h3 className="font-semibold">Filter & Sort</h3>
              <div>
                <Label className="text-sm mb-3 block">Price Range (ETB)</Label>
                <Slider min={0} max={50000} step={100} value={priceRange} onValueChange={setPriceRange} className="mb-2" />
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>ETB {priceRange[0].toLocaleString()}</span>
                  <span>ETB {priceRange[1].toLocaleString()}</span>
                </div>
              </div>
            </div>
          </aside>

          {/* Products grid */}
          <div className="flex-1">
            <div className="flex justify-between items-center mb-4">
              <p className="text-sm text-muted-foreground">{data?.total || 0} products</p>
              <Select value={sort} onValueChange={setSort}>
                <SelectTrigger className="w-44">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="newest">Newest First</SelectItem>
                  <SelectItem value="popular">Most Popular</SelectItem>
                  <SelectItem value="rating">Best Rated</SelectItem>
                  <SelectItem value="price_asc">Price: Low to High</SelectItem>
                  <SelectItem value="price_desc">Price: High to Low</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {isLoading ? (
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {Array.from({ length: 8 }).map((_, i) => (
                  <div key={i} className="bg-card rounded-xl border p-3">
                    <Skeleton className="h-40 w-full rounded-lg mb-3" />
                    <Skeleton className="h-4 w-3/4 mb-2" />
                    <Skeleton className="h-4 w-1/2" />
                  </div>
                ))}
              </div>
            ) : (
              <>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                  {data?.products?.map((p: any) => <ProductCard key={p.id} product={p} />)}
                </div>
                {data?.totalPages > 1 && (
                  <div className="flex justify-center gap-2 mt-6">
                    {Array.from({ length: data.totalPages }, (_, i) => (
                      <Button key={i + 1} variant={page === i + 1 ? "default" : "outline"} size="sm" onClick={() => setPage(i + 1)}>
                        {i + 1}
                      </Button>
                    ))}
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}
