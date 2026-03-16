import { useState } from "react";
import { api } from "@/lib/api";
import { useAuth } from "@/lib/auth-context";
import { useLocation, Link } from "wouter";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { Store, CheckCircle } from "lucide-react";

const CATEGORIES = ["Electronics", "Fashion", "Home & Garden", "Food & Beverages", "Health & Beauty", "Sports & Outdoors", "Books & Education", "Traditional Crafts", "Other"];
const CITIES = ["Addis Ababa", "Dire Dawa", "Mekelle", "Gondar", "Hawassa", "Bahir Dar", "Adama", "Jimma", "Jijiga", "Shashamane"];

export default function BecomeSellerPage() {
  const { user } = useAuth();
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [form, setForm] = useState({
    storeName: "", storeDescription: "", category: "", phone: "", address: "", city: "", bankName: "", accountNumber: "", tinNumber: ""
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) { setLocation("/login"); return; }
    setIsLoading(true);
    try {
      await api.post("/sellers/register", form);
      setSubmitted(true);
    } catch (err: any) {
      toast({ variant: "destructive", title: "Registration failed", description: err.message });
    } finally {
      setIsLoading(false);
    }
  };

  if (submitted) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="container mx-auto px-4 py-16 text-center max-w-md">
          <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
          <h1 className="text-2xl font-bold mb-2">Application Submitted!</h1>
          <p className="text-muted-foreground mb-6">Your seller application is under review. We'll notify you within 24-48 hours.</p>
          <Button onClick={() => setLocation("/")}>Continue Shopping</Button>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="container mx-auto px-4 py-8 max-w-2xl">
        <div className="text-center mb-8">
          <Store className="w-12 h-12 text-primary mx-auto mb-3" />
          <h1 className="text-3xl font-bold">Become a Seller</h1>
          <p className="text-muted-foreground">Start selling on EthioMart and reach millions of customers</p>
        </div>

        <div className="bg-card border rounded-2xl p-8">
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <Label>Store Name *</Label>
              <Input name="storeName" value={form.storeName} onChange={handleChange} placeholder="My Amazing Store" required className="mt-1" />
            </div>
            <div>
              <Label>Store Description</Label>
              <Textarea name="storeDescription" value={form.storeDescription} onChange={handleChange} placeholder="Tell customers about your store..." className="mt-1 resize-none" rows={3} />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Category *</Label>
                <Select value={form.category} onValueChange={v => setForm(p => ({ ...p, category: v }))}>
                  <SelectTrigger className="mt-1"><SelectValue placeholder="Select category" /></SelectTrigger>
                  <SelectContent>{CATEGORIES.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}</SelectContent>
                </Select>
              </div>
              <div>
                <Label>City *</Label>
                <Select value={form.city} onValueChange={v => setForm(p => ({ ...p, city: v }))}>
                  <SelectTrigger className="mt-1"><SelectValue placeholder="Select city" /></SelectTrigger>
                  <SelectContent>{CITIES.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}</SelectContent>
                </Select>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Phone *</Label>
                <Input name="phone" value={form.phone} onChange={handleChange} placeholder="+251 9XX XXX XXX" required className="mt-1" />
              </div>
              <div>
                <Label>Address *</Label>
                <Input name="address" value={form.address} onChange={handleChange} placeholder="Street address" required className="mt-1" />
              </div>
            </div>
            <div className="border-t pt-4">
              <p className="text-sm font-medium mb-3 text-muted-foreground">Bank Details (for payments)</p>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Bank Name</Label>
                  <Input name="bankName" value={form.bankName} onChange={handleChange} placeholder="Commercial Bank of Ethiopia" className="mt-1" />
                </div>
                <div>
                  <Label>Account Number</Label>
                  <Input name="accountNumber" value={form.accountNumber} onChange={handleChange} placeholder="1000xxxxxxxxx" className="mt-1" />
                </div>
              </div>
              <div className="mt-3">
                <Label>TIN Number</Label>
                <Input name="tinNumber" value={form.tinNumber} onChange={handleChange} placeholder="Tax ID number" className="mt-1" />
              </div>
            </div>
            <Button type="submit" className="w-full" size="lg" disabled={isLoading || !form.storeName || !form.category || !form.city}>
              {isLoading ? "Submitting..." : "Submit Application"}
            </Button>
          </form>
        </div>
      </div>
      <Footer />
    </div>
  );
}
