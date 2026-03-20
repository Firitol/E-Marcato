import { Link, useLocation } from "wouter";
import { Search, ShoppingCart, Heart, User as UserIcon, Menu, LogOut, Package, Store } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuLabel, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { useAuth } from "@/lib/auth-context";
import { useCart } from "@/lib/api";
import { useState } from "react";

export function Navbar() {
  const [, setLocation] = useLocation();
  const { user, logout, isLoading: isUserLoading } = useAuth();
  const [searchQuery, setSearchQuery] = useState("");
  const { data: cart, error: cartError } = useCart();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      setLocation(`/search?q=${encodeURIComponent(searchQuery)}`);
    }
  };

  const cartItemsCount = !cartError && cart ? (cart?.items?.length || cart?.itemCount || 0) : 0;

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80 shadow-sm">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between gap-4">
        {/* Mobile Menu */}
        <div className="md:hidden flex items-center">
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="mr-2">
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-[300px] sm:w-[400px]">
              <div className="flex flex-col gap-6 mt-6">
                <Link href="/" className="text-xl font-display font-bold text-gradient-primary">
                  EthioMart
                </Link>
                <nav className="flex flex-col gap-4">
                  <Link href="/categories" className="text-lg font-medium hover:text-primary transition-colors">Categories</Link>
                  <Link href="/deals" className="text-lg font-medium hover:text-primary transition-colors">Today's Deals</Link>
                  <Link href="/new-arrivals" className="text-lg font-medium hover:text-primary transition-colors">New Arrivals</Link>
                </nav>
              </div>
            </SheetContent>
          </Sheet>
        </div>

        {/* Logo */}
        <Link href="/" className="hidden md:flex items-center gap-2 mr-6 shrink-0">
          {/* ethio mart logo */}
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-white font-bold text-lg shadow-md shadow-primary/20">
            E
          </div>
          <span className="text-2xl font-display font-extrabold tracking-tight text-gradient-primary">
            EthioMart
          </span>
        </Link>

        {/* Search */}
        <div className="flex-1 max-w-2xl mx-auto hidden sm:block">
          <form onSubmit={handleSearch} className="relative group">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
            <Input 
              type="search" 
              placeholder="Search products, brands and categories..." 
              className="w-full pl-10 pr-4 rounded-full border-border bg-muted/50 focus-visible:bg-background focus-visible:ring-primary/20 transition-all h-10"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </form>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-1 sm:gap-2 shrink-0">
          <Link href="/wishlist" className="hidden sm:inline-flex">
            <Button variant="ghost" size="icon" className="hover:text-primary hover:bg-primary/5 rounded-full">
              <Heart className="h-5 w-5" />
            </Button>
          </Link>
          
          <Link href="/cart">
            <Button variant="ghost" size="icon" className="relative hover:text-primary hover:bg-primary/5 rounded-full">
              <ShoppingCart className="h-5 w-5" />
              {cartItemsCount > 0 && (
                <Badge className="absolute -top-1 -right-1 h-5 w-5 p-0 flex items-center justify-center bg-primary text-primary-foreground border-none">
                  {cartItemsCount > 99 ? '99+' : cartItemsCount}
                </Badge>
              )}
            </Button>
          </Link>

          {!isUserLoading && (
            user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="pl-2 pr-4 h-9 rounded-full ml-1 border border-border/50 hover:border-primary/30 transition-colors">
                    <div className="w-6 h-6 rounded-full bg-primary/10 text-primary flex items-center justify-center mr-2 font-bold text-xs">
                      {user.firstName.charAt(0)}
                    </div>
                    <span className="text-sm font-medium hidden md:inline-block max-w-[100px] truncate">
                      Hi, {user.firstName}
                    </span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56 mt-2 rounded-xl p-2">
                  <DropdownMenuLabel className="font-normal px-2 py-2">
                    <div className="flex flex-col space-y-1">
                      <p className="text-sm font-medium leading-none">{user.firstName} {user.lastName}</p>
                      <p className="text-xs leading-none text-muted-foreground">{user.email}</p>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild className="cursor-pointer rounded-lg">
                    <Link href="/orders" className="flex w-full items-center">
                      <Package className="mr-2 h-4 w-4 text-muted-foreground" />
                      <span>My Orders</span>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild className="cursor-pointer rounded-lg">
                    <Link href="/wishlist" className="flex w-full items-center">
                      <Heart className="mr-2 h-4 w-4 text-muted-foreground" />
                      <span>Wishlist</span>
                    </Link>
                  </DropdownMenuItem>
                  
                  {(user.role === 'seller' || user.role === 'admin') && (
                    <>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem asChild className="cursor-pointer rounded-lg">
                        <Link href={`/${user.role}`} className="flex w-full items-center text-primary font-medium">
                          <Store className="mr-2 h-4 w-4" />
                          <span>{user.role === 'admin' ? 'Admin Panel' : 'Seller Dashboard'}</span>
                        </Link>
                      </DropdownMenuItem>
                    </>
                  )}
                  
                  <DropdownMenuSeparator />
                  <DropdownMenuItem 
                    className="cursor-pointer text-destructive focus:text-destructive rounded-lg"
                    onClick={() => { logout(); setLocation("/"); }}
                  >
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Log out</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <div className="flex items-center ml-2">
                <Link href="/login">
                  <Button variant="ghost" className="hidden sm:inline-flex rounded-full px-4 font-medium hover:text-primary">
                    Login
                  </Button>
                </Link>
                <Link href="/register">
                  <Button className="rounded-full px-5 bg-gradient-to-r from-primary to-primary/90 text-primary-foreground shadow-md shadow-primary/20 hover:shadow-lg hover:shadow-primary/30 transition-all ml-2">
                    Sign Up
                  </Button>
                </Link>
              </div>
            )
          )}
        </div>
      </div>
      
      {/* Category Nav - Desktop Only */}
      <div className="hidden md:flex bg-muted/30 border-t border-border/40">
        <div className="container mx-auto px-4 h-10 flex items-center gap-6 text-sm font-medium text-muted-foreground">
          <Link href="/categories" className="flex items-center gap-2 hover:text-primary transition-colors">
            <Menu className="w-4 h-4" /> All Categories
          </Link>
          <div className="h-4 w-px bg-border"></div>
          <Link href="/search?category=electronics" className="hover:text-primary transition-colors">Electronics</Link>
          <Link href="/search?category=fashion" className="hover:text-primary transition-colors">Fashion</Link>
          <Link href="/search?category=home" className="hover:text-primary transition-colors">Home & Kitchen</Link>
          <Link href="/search?category=beauty" className="hover:text-primary transition-colors">Beauty & Health</Link>
          <Link href="/search?category=grocery" className="hover:text-primary transition-colors">Groceries</Link>
        </div>
      </div>
    </header>
  );
}
