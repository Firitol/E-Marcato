import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowRight, Zap, ShieldCheck, Truck, TrendingUp } from "lucide-react";

export default function HomePage() {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      {/* Simple Header */}
      <header className="sticky top-0 z-50 bg-white border-b border-gray-200">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/">
            <a className="text-2xl font-bold text-primary">EthioMart</a>
          </Link>
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

        {/* Featured Categories */}
        <section className="py-16 container mx-auto px-4">
          <h2 className="text-3xl font-bold mb-4">Featured Categories</h2>
          <p className="text-gray-600 mb-12">Browse our most popular product categories</p>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {["Electronics", "Fashion", "Home & Garden", "Books", "Sports", "Beauty", "Toys", "Groceries"].map((category) => (
              <Link key={category} href={`/search?category=${category.toLowerCase()}`}>
                <a className="bg-white border border-gray-200 rounded-lg p-8 text-center hover:shadow-lg transition-shadow">
                  <div className="w-16 h-16 bg-blue-100 rounded-full mx-auto mb-4 flex items-center justify-center">
                    <span className="text-2xl">📦</span>
                  </div>
                  <h3 className="font-bold">{category}</h3>
                </a>
              </Link>
            ))}
          </div>
        </section>

        {/* Promo Banner */}
        <section className="py-16 container mx-auto px-4">
          <div className="bg-gradient-to-r from-green-500 to-emerald-700 text-white rounded-2xl p-12">
            <Badge className="bg-white/20 text-white border-white/30 mb-4">Holiday Special</Badge>
            <h2 className="text-4xl font-bold mb-4">Big Saving Days Are Here!</h2>
            <p className="text-lg mb-6 max-w-2xl">Get extra 20% off on all electronics when you pay with CBE Birr. Limited time offer.</p>
            <Button size="lg" className="bg-white text-green-600 hover:bg-gray-100">
              Shop Electronics
            </Button>
          </div>
        </section>

        {/* Why Shop With Us */}
        <section className="py-16 container mx-auto px-4 bg-gray-50 -mx-4 px-8">
          <h2 className="text-3xl font-bold mb-12 text-center">Why Shop With EthioMart?</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            <div className="bg-white p-8 rounded-lg">
              <div className="text-4xl mb-4">🚚</div>
              <h3 className="font-bold text-lg mb-2">Fast & Reliable</h3>
              <p className="text-gray-600">Quick delivery to all regions of Ethiopia with tracking</p>
            </div>
            <div className="bg-white p-8 rounded-lg">
              <div className="text-4xl mb-4">🛡️</div>
              <h3 className="font-bold text-lg mb-2">Secure Transactions</h3>
              <p className="text-gray-600">Your payments and personal data are fully protected</p>
            </div>
            <div className="bg-white p-8 rounded-lg">
              <div className="text-4xl mb-4">⭐</div>
              <h3 className="font-bold text-lg mb-2">Quality Assured</h3>
              <p className="text-gray-600">All products are verified and 100% authentic</p>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12 mt-16">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
            <div>
              <h4 className="font-bold mb-4">About EthioMart</h4>
              <ul className="space-y-2 text-gray-400">
                <li><Link href="/"><a>Home</a></Link></li>
                <li><Link href="/search"><a>Shop</a></Link></li>
                <li><Link href="/about"><a>About</a></Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold mb-4">Customer Service</h4>
              <ul className="space-y-2 text-gray-400">
                <li><Link href="/contact"><a>Contact Us</a></Link></li>
                <li><Link href="/faq"><a>FAQs</a></Link></li>
                <li><Link href="/returns"><a>Returns</a></Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold mb-4">For Sellers</h4>
              <ul className="space-y-2 text-gray-400">
                <li><Link href="/become-seller"><a>Become a Seller</a></Link></li>
                <li><Link href="/seller"><a>Seller Dashboard</a></Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold mb-4">Legal</h4>
              <ul className="space-y-2 text-gray-400">
                <li><Link href="/terms"><a>Terms</a></Link></li>
                <li><Link href="/privacy"><a>Privacy</a></Link></li>
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
