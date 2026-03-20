import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Truck, ShieldCheck, Zap, TrendingUp, MapPin } from "lucide-react";

export default function HomePage() {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white border-b border-gray-200">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="text-2xl font-bold text-blue-600">EthioMart</div>
          <div className="flex gap-4">
            <Button variant="ghost" size="sm" asChild>
              <Link href="/search">Search</Link>
            </Button>
            <Button variant="ghost" size="sm" asChild>
              <Link href="/cart">Cart</Link>
            </Button>
            <Button variant="ghost" size="sm" asChild>
              <Link href="/login">Login</Link>
            </Button>
          </div>
        </div>
      </header>
      
      <main className="flex-1">
        {/* Hero Section */}
        <section className="w-full bg-gradient-to-r from-blue-600 to-blue-800 text-white py-24">
          <div className="container mx-auto px-4 max-w-4xl">
            <h1 className="text-5xl font-bold mb-6">Ethiopia's Premium Marketplace</h1>
            <p className="text-xl mb-8 text-blue-100">
              Shop millions of authentic products from local and global brands. Fast delivery to your doorstep.
            </p>
            <div className="flex gap-4 flex-wrap">
              <Button size="lg" className="bg-white text-blue-600 hover:bg-gray-100" asChild>
                <Link href="/search">Shop Now</Link>
              </Button>
              <Button size="lg" variant="outline" className="border-white text-white hover:bg-white/20" asChild>
                <Link href="/search">Browse Products</Link>
              </Button>
            </div>
          </div>
        </section>

        {/* Features Bar */}
        <section className="bg-gray-50 py-8 border-b">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
              <div className="flex gap-4">
                <Truck className="w-8 h-8 text-blue-600 shrink-0" />
                <div>
                  <h4 className="font-bold">Fast Delivery</h4>
                  <p className="text-sm text-gray-600">Across all regions</p>
                </div>
              </div>
              <div className="flex gap-4">
                <ShieldCheck className="w-8 h-8 text-green-600 shrink-0" />
                <div>
                  <h4 className="font-bold">Secure Payment</h4>
                  <p className="text-sm text-gray-600">Telebirr & CBE Birr</p>
                </div>
              </div>
              <div className="flex gap-4">
                <Zap className="w-8 h-8 text-yellow-600 shrink-0" />
                <div>
                  <h4 className="font-bold">Daily Deals</h4>
                  <p className="text-sm text-gray-600">Save up to 50%</p>
                </div>
              </div>
              <div className="flex gap-4">
                <TrendingUp className="w-8 h-8 text-purple-600 shrink-0" />
                <div>
                  <h4 className="font-bold">Top Brands</h4>
                  <p className="text-sm text-gray-600">100% Authentic</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Categories Section */}
        <section className="py-16 container mx-auto px-4">
          <h2 className="text-4xl font-bold mb-4">Shop by Category</h2>
          <p className="text-gray-600 mb-12">Browse our most popular categories</p>
          
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {[
              { name: "Electronics", slug: "electronics" },
              { name: "Fashion", slug: "fashion" },
              { name: "Home & Garden", slug: "home-garden" },
              { name: "Beauty", slug: "beauty" },
              { name: "Sports", slug: "sports" },
              { name: "Books", slug: "books" },
              { name: "Toys", slug: "toys" },
              { name: "Food & Drinks", slug: "food" },
            ].map((category) => (
              <div 
                key={category.slug}
                className="bg-white border border-gray-200 rounded-lg p-6 text-center hover:shadow-lg transition-shadow cursor-pointer"
              >
                <div className="w-16 h-16 bg-gradient-to-br from-blue-400 to-blue-600 rounded-lg mx-auto mb-4"></div>
                <h3 className="font-semibold text-gray-900">{category.name}</h3>
              </div>
            ))}
          </div>
        </section>

        {/* Promotional Banner */}
        <section className="bg-blue-600 text-white py-12 my-12">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-3xl font-bold mb-4">Weekend Flash Sale</h2>
            <p className="text-blue-100 mb-8">Get up to 60% off on selected items. Limited time only!</p>
            <Button size="lg" className="bg-white text-blue-600 hover:bg-gray-100" asChild>
              <Link href="/search">View Deals</Link>
            </Button>
          </div>
        </section>

        {/* Why Shop With Us */}
        <section className="py-16 container mx-auto px-4 bg-gray-50 rounded-lg">
          <h2 className="text-4xl font-bold mb-12 text-center">Why Shop With Us?</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-12 h-12 bg-blue-600 text-white rounded-full flex items-center justify-center mx-auto mb-4 text-xl font-bold">✓</div>
              <h3 className="font-bold text-lg mb-2">Local Expertise</h3>
              <p className="text-gray-600">We understand the Ethiopian market and serve our community with pride.</p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-green-600 text-white rounded-full flex items-center justify-center mx-auto mb-4 text-xl font-bold">✓</div>
              <h3 className="font-bold text-lg mb-2">Trusted Sellers</h3>
              <p className="text-gray-600">All sellers are verified and reviewed. Shop with confidence.</p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-purple-600 text-white rounded-full flex items-center justify-center mx-auto mb-4 text-xl font-bold">✓</div>
              <h3 className="font-bold text-lg mb-2">Best Prices</h3>
              <p className="text-gray-600">Price match guarantee. Find the best deals on quality products.</p>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12 mt-20">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div>
              <h4 className="font-bold text-lg mb-4">EthioMart</h4>
              <p className="text-gray-400">Your trusted marketplace for quality products and exceptional service.</p>
            </div>
            <div>
              <h4 className="font-bold mb-4">Quick Links</h4>
              <ul className="space-y-2 text-gray-400">
                <li><Link href="/search">Shop</Link></li>
                <li><Link href="/become-seller">Become a Seller</Link></li>
                <li><Link href="/">Contact Us</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold mb-4">Customer Service</h4>
              <ul className="space-y-2 text-gray-400">
                <li><Link href="/">Help Center</Link></li>
                <li><Link href="/">Shipping Info</Link></li>
                <li><Link href="/">Returns</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold mb-4">Legal</h4>
              <ul className="space-y-2 text-gray-400">
                <li><Link href="/">Privacy Policy</Link></li>
                <li><Link href="/">Terms & Conditions</Link></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 pt-8 text-center text-gray-400">
            <p>&copy; 2024 EthioMart. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
