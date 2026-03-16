import { Link } from "wouter";
import { Facebook, Twitter, Instagram, Youtube, MapPin, Phone, Mail } from "lucide-react";

export function Footer() {
  return (
    <footer className="bg-card border-t border-border pt-16 pb-8 mt-20">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 mb-12">
          {/* Brand Info */}
          <div className="space-y-4">
            <Link href="/" className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-white font-bold text-lg shadow-md shadow-primary/20">
                E
              </div>
              <span className="text-2xl font-display font-extrabold tracking-tight text-gradient-primary">
                EthioMart
              </span>
            </Link>
            <p className="text-muted-foreground text-sm leading-relaxed mt-4">
              Ethiopia's premier e-commerce destination. Discover thousands of products with fast delivery and secure local payment options.
            </p>
            <div className="flex gap-4 pt-2">
              <a href="#" className="w-8 h-8 rounded-full bg-muted flex items-center justify-center text-foreground hover:bg-primary hover:text-white transition-colors">
                <Facebook className="w-4 h-4" />
              </a>
              <a href="#" className="w-8 h-8 rounded-full bg-muted flex items-center justify-center text-foreground hover:bg-primary hover:text-white transition-colors">
                <Twitter className="w-4 h-4" />
              </a>
              <a href="#" className="w-8 h-8 rounded-full bg-muted flex items-center justify-center text-foreground hover:bg-primary hover:text-white transition-colors">
                <Instagram className="w-4 h-4" />
              </a>
              <a href="#" className="w-8 h-8 rounded-full bg-muted flex items-center justify-center text-foreground hover:bg-primary hover:text-white transition-colors">
                <Youtube className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-display font-bold text-lg mb-4">Quick Links</h3>
            <ul className="space-y-3">
              <li><Link href="/about" className="text-muted-foreground hover:text-primary transition-colors text-sm">About Us</Link></li>
              <li><Link href="/contact" className="text-muted-foreground hover:text-primary transition-colors text-sm">Contact Us</Link></li>
              <li><Link href="/faq" className="text-muted-foreground hover:text-primary transition-colors text-sm">FAQ</Link></li>
              <li><Link href="/terms" className="text-muted-foreground hover:text-primary transition-colors text-sm">Terms & Conditions</Link></li>
              <li><Link href="/privacy" className="text-muted-foreground hover:text-primary transition-colors text-sm">Privacy Policy</Link></li>
            </ul>
          </div>

          {/* Customer Service */}
          <div>
            <h3 className="font-display font-bold text-lg mb-4">Customer Service</h3>
            <ul className="space-y-3">
              <li><Link href="/orders" className="text-muted-foreground hover:text-primary transition-colors text-sm">Track Order</Link></li>
              <li><Link href="/returns" className="text-muted-foreground hover:text-primary transition-colors text-sm">Returns & Refunds</Link></li>
              <li><Link href="/shipping" className="text-muted-foreground hover:text-primary transition-colors text-sm">Shipping Info</Link></li>
              <li><Link href="/seller/register" className="text-muted-foreground hover:text-primary transition-colors text-sm">Sell on EthioMart</Link></li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="font-display font-bold text-lg mb-4">Contact Us</h3>
            <ul className="space-y-4">
              <li className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                <span className="text-muted-foreground text-sm">Bole Road, Dembel City Center, Addis Ababa, Ethiopia</span>
              </li>
              <li className="flex items-center gap-3">
                <Phone className="w-5 h-5 text-primary shrink-0" />
                <span className="text-muted-foreground text-sm">+251 911 234 567</span>
              </li>
              <li className="flex items-center gap-3">
                <Mail className="w-5 h-5 text-primary shrink-0" />
                <span className="text-muted-foreground text-sm">support@ethiomart.com</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-border pt-8 mt-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-sm text-muted-foreground">
            &copy; {new Date().getFullYear()} EthioMart. All rights reserved.
          </p>
          <div className="flex items-center gap-4">
            <span className="text-sm text-muted-foreground mr-2">Secure Payments:</span>
            <img src={`${import.meta.env.BASE_URL}images/telebirr.png`} alt="Telebirr" className="h-8 object-contain rounded drop-shadow-sm" />
            <img src={`${import.meta.env.BASE_URL}images/cbe-birr.png`} alt="CBE Birr" className="h-8 object-contain rounded drop-shadow-sm" />
          </div>
        </div>
      </div>
    </footer>
  );
}
