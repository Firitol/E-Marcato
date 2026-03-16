import { useState } from "react";
import { useSearch, useCategories } from "@/lib/api";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { ProductCard } from "@/components/product/ProductCard";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { SlidersHorizontal, Search, X } from "lucide-react";
import { useLocation } from "wouter";

export default function SearchPage() {
  const [, setLocation] = useLocation();
  const params = new URLSearchParams(window.location.search);
  const [query, setQuery] = useState(params.get("q") || "");
  const [activeQuery, setActiveQuery] = useState(params.get("q") || "");
  const [category, setCategory] = useState(params.get("category") || "");
  const [sort, setSort] = useState("rating");
  const [priceRange, setPriceRange] = useState([0, 50000]);
  const [page, setPage] = useState(1);

  const { data: searchData, isLoading } = useSearch(activeQuery, {
    category: category || undefined,
    minPrice: priceRange[0] || undefined,
    maxPrice: priceRange[1] < 50000 ? priceRange[1] : undefined,
    sort,
    page,
  });
  const { data: categories } = useCategories();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setActiveQuery(query);
    setPage(1);
    setLocation(`/search?q=${encodeURIComponent(query)}`);
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="container mx-auto px-4 py-6 max-w-7xl">
        {/* Search Bar */}
        <form onSubmit={handleSearch} className="mb-6">
          <div className="flex gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground w-4 h-4" />
              <Input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search products..."
                className="pl-10"
              />
            </div>
            <Button type="submit" className="bg-primary text-white">Search</Button>
          </div>
        </form>

        <div className="flex gap-6">
          {/* Filters */}
          <aside className="w-64 shrink-0 hidden md:block">
            <div className="bg-card rounded-xl border p-4 space-y-5">
              <div className="flex items-center gap-2 font-semibold">
                <SlidersHorizontal className="w-4 h-4" /> Filters
              </div>

              <div>
                <Label className="text-sm font-medium mb-2 block">Category</Label>
                <div className="space-y-1">
                  <button
                    onClick={() => setCategory("")}
                    className={`w-full text-left px-2 py-1 rounded text-sm hover:bg-muted ${!category ? "bg-primary/10 text-primary font-medium" : ""}`}
                  >
                    All Categories
                  </button>
                  {categories?.map((cat: any) => (
                    <button
                      key={cat.id}
                      onClick={() => setCategory(cat.slug)}
                      className={`w-full text-left px-2 py-1 rounded text-sm hover:bg-muted ${category === cat.slug ? "bg-primary/10 text-primary font-medium" : ""}`}
                    >
                      {cat.icon} {cat.name} <span className="text-muted-foreground">({cat.productCount})</span>
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <Label className="text-sm font-medium mb-3 block">Price Range (ETB)</Label>
                <Slider
                  min={0} max={50000} step={100}
                  value={priceRange}
                  onValueChange={setPriceRange}
                  className="mb-2"
                />
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>ETB {priceRange[0].toLocaleString()}</span>
                  <span>ETB {priceRange[1].toLocaleString()}</span>
                </div>
              </div>
            </div>
          </aside>

          {/* Results */}
          <div className="flex-1">
            <div className="flex items-center justify-between mb-4">
              <div>
                {activeQuery && (
                  <p className="text-muted-foreground text-sm">
                    {isLoading ? "Searching..." : `${searchData?.total || 0} results for "${activeQuery}"`}
                  </p>
                )}
              </div>
              <Select value={sort} onValueChange={setSort}>
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="rating">Best Rating</SelectItem>
                  <SelectItem value="popular">Most Popular</SelectItem>
                  <SelectItem value="price_asc">Price: Low to High</SelectItem>
                  <SelectItem value="price_desc">Price: High to Low</SelectItem>
                  <SelectItem value="newest">Newest</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {isLoading ? (
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {Array.from({ length: 8 }).map((_, i) => (
                  <div key={i} className="bg-card rounded-xl p-3 border">
                    <Skeleton className="h-40 w-full rounded-lg mb-3" />
                    <Skeleton className="h-4 w-3/4 mb-2" />
                    <Skeleton className="h-4 w-1/2" />
                  </div>
                ))}
              </div>
            ) : searchData?.products?.length > 0 ? (
              <>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                  {searchData.products.map((p: any) => <ProductCard key={p.id} product={p} />)}
                </div>
                {searchData.totalPages > 1 && (
                  <div className="flex justify-center gap-2 mt-6">
                    {Array.from({ length: searchData.totalPages }, (_, i) => (
                      <Button
                        key={i + 1}
                        variant={page === i + 1 ? "default" : "outline"}
                        size="sm"
                        onClick={() => setPage(i + 1)}
                      >
                        {i + 1}
                      </Button>
                    ))}
                  </div>
                )}
              </>
            ) : (
              <div className="text-center py-16">
                <p className="text-4xl mb-4">🔍</p>
                <h3 className="text-lg font-semibold mb-2">No results found</h3>
                <p className="text-muted-foreground">Try different keywords or adjust your filters</p>
              </div>
            )}
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}
