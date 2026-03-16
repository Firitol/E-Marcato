import { useState } from "react";
import { useLocation } from "wouter";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useCart } from "@/lib/api";
import { api } from "@/lib/api";
import { MapPin, CreditCard, CheckCircle2, Loader2 } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { useQueryClient } from "@tanstack/react-query";
import { useAuth } from "@/lib/auth-context";

const addressSchema = z.object({
  fullName: z.string().min(2, "Full name is required"),
  phone: z.string().min(9, "Valid phone number is required"),
  region: z.string().min(1, "Region is required"),
  city: z.string().min(1, "City is required"),
  street: z.string().min(5, "Street address required"),
});

type PAYMENT = "telebirr" | "cbe_birr" | "cash_on_delivery";

export default function CheckoutPage() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const qc = useQueryClient();
  const { user } = useAuth();
  const { data: cart } = useCart();
  const [step, setStep] = useState<1 | 2>(1);
  const [paymentMethod, setPaymentMethod] = useState<PAYMENT>("telebirr");
  const [isPending, setIsPending] = useState(false);

  const form = useForm<z.infer<typeof addressSchema>>({
    resolver: zodResolver(addressSchema),
    defaultValues: { fullName: "", phone: "", region: "", city: "", street: "" }
  });

  if (!user) { setLocation("/login"); return null; }
  const items = cart?.items || [];
  if (!cart || items.length === 0) { setLocation("/cart"); return null; }

  const onSubmit = async (values: z.infer<typeof addressSchema>) => {
    setIsPending(true);
    try {
      const order = await api.post("/orders", {
        items: items.map((i: any) => ({ productId: i.productId, quantity: i.quantity })),
        shippingAddress: { ...values, country: "Ethiopia" },
        paymentMethod,
      });
      qc.invalidateQueries({ queryKey: ["cart"] });
      qc.invalidateQueries({ queryKey: ["orders"] });
      toast({ title: "Order placed successfully!", description: `Order #${order.orderNumber}` });
      setLocation("/orders");
    } catch (err: any) {
      toast({ variant: "destructive", title: "Checkout failed", description: err.message });
    } finally {
      setIsPending(false);
    }
  };

  const PAYMENT_OPTIONS: { id: PAYMENT; label: string; desc: string; img?: string }[] = [
    { id: "telebirr", label: "Telebirr", desc: "Pay securely via your phone", img: `${import.meta.env.BASE_URL}images/telebirr.png` },
    { id: "cbe_birr", label: "CBE Birr", desc: "Direct bank transfer", img: `${import.meta.env.BASE_URL}images/cbe-birr.png` },
    { id: "cash_on_delivery", label: "Cash on Delivery", desc: "Pay when you receive" },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />
      <main className="flex-1 container mx-auto px-4 py-8 max-w-6xl">
        <h1 className="text-3xl font-bold text-foreground mb-8">Checkout</h1>
        <div className="flex flex-col lg:flex-row gap-8">
          <div className="flex-1 space-y-6">
            {/* Step 1: Address */}
            <div className={`p-6 rounded-3xl border ${step === 1 ? "border-primary bg-card shadow-md" : "border-border bg-muted/30 opacity-70"} transition-all`}>
              <div className="flex items-center gap-3 mb-6">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm ${step >= 1 ? "bg-primary text-white" : "bg-muted text-muted-foreground"}`}>1</div>
                <h2 className="text-xl font-bold flex items-center gap-2"><MapPin className="w-5 h-5 text-primary" /> Shipping Address</h2>
                {step > 1 && <CheckCircle2 className="w-5 h-5 text-green-500 ml-auto" />}
              </div>
              {step === 1 && (
                <Form {...form}>
                  <form className="space-y-4" onSubmit={form.handleSubmit(() => setStep(2))}>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <FormField control={form.control} name="fullName" render={({ field }) => (
                        <FormItem><FormLabel>Full Name</FormLabel><FormControl><Input placeholder="Abebe Bikila" {...field} /></FormControl><FormMessage /></FormItem>
                      )} />
                      <FormField control={form.control} name="phone" render={({ field }) => (
                        <FormItem><FormLabel>Phone Number</FormLabel><FormControl><Input placeholder="+251 912 345 678" {...field} /></FormControl><FormMessage /></FormItem>
                      )} />
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <FormField control={form.control} name="region" render={({ field }) => (
                        <FormItem>
                          <FormLabel>Region</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl><SelectTrigger><SelectValue placeholder="Select region" /></SelectTrigger></FormControl>
                            <SelectContent>
                              <SelectItem value="Addis Ababa">Addis Ababa</SelectItem>
                              <SelectItem value="Dire Dawa">Dire Dawa</SelectItem>
                              <SelectItem value="Oromia">Oromia</SelectItem>
                              <SelectItem value="Amhara">Amhara</SelectItem>
                              <SelectItem value="Tigray">Tigray</SelectItem>
                              <SelectItem value="Sidama">Sidama</SelectItem>
                              <SelectItem value="SNNPR">SNNPR</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )} />
                      <FormField control={form.control} name="city" render={({ field }) => (
                        <FormItem><FormLabel>City/Subcity</FormLabel><FormControl><Input placeholder="Bole" {...field} /></FormControl><FormMessage /></FormItem>
                      )} />
                    </div>
                    <FormField control={form.control} name="street" render={({ field }) => (
                      <FormItem><FormLabel>Street Address</FormLabel><FormControl><Input placeholder="House No, area description" {...field} /></FormControl><FormMessage /></FormItem>
                    )} />
                    <Button type="submit" size="lg" className="rounded-full px-8">Continue to Payment</Button>
                  </form>
                </Form>
              )}
            </div>

            {/* Step 2: Payment */}
            <div className={`p-6 rounded-3xl border ${step === 2 ? "border-primary bg-card shadow-md" : "border-border bg-muted/30 opacity-70"} transition-all`}>
              <div className="flex items-center gap-3 mb-6">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm ${step === 2 ? "bg-primary text-white" : "bg-muted text-muted-foreground"}`}>2</div>
                <h2 className="text-xl font-bold flex items-center gap-2"><CreditCard className="w-5 h-5 text-primary" /> Payment Method</h2>
              </div>
              {step === 2 && (
                <div className="space-y-4">
                  <div className="grid gap-4">
                    {PAYMENT_OPTIONS.map(opt => (
                      <div key={opt.id} className={`relative flex items-center justify-between p-4 border-2 rounded-2xl cursor-pointer transition-all ${paymentMethod === opt.id ? "border-primary bg-primary/5" : "border-border hover:border-primary/50"}`} onClick={() => setPaymentMethod(opt.id)}>
                        <div className="flex items-center gap-4">
                          <div className={`w-5 h-5 rounded-full border flex items-center justify-center ${paymentMethod === opt.id ? "border-primary" : "border-muted-foreground"}`}>
                            {paymentMethod === opt.id && <div className="w-3 h-3 bg-primary rounded-full" />}
                          </div>
                          <div>
                            <p className="font-bold">{opt.label}</p>
                            <p className="text-xs text-muted-foreground">{opt.desc}</p>
                          </div>
                        </div>
                        {opt.img && <img src={opt.img} alt={opt.label} className="h-8" onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }} />}
                      </div>
                    ))}
                  </div>
                  <div className="flex gap-4 pt-4">
                    <Button variant="outline" onClick={() => setStep(1)} className="rounded-full">Back</Button>
                    <Button className="rounded-full flex-1" onClick={form.handleSubmit(onSubmit)} disabled={isPending}>
                      {isPending && <Loader2 className="w-4 h-4 animate-spin mr-2" />}
                      Place Order (ETB {(cart.total || 0).toLocaleString()})
                    </Button>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Cart Summary Sidebar */}
          <div className="w-full lg:w-[350px]">
            <div className="bg-card rounded-3xl border border-border shadow-md p-6 sticky top-24">
              <h3 className="font-bold text-lg mb-4 pb-4 border-b">Your Order</h3>
              <div className="space-y-4 mb-6 max-h-[300px] overflow-y-auto pr-2">
                {items.map((item: any) => (
                  <div key={item.productId} className="flex gap-3 text-sm">
                    <div className="w-12 h-12 bg-muted rounded border shrink-0 overflow-hidden">
                      <img src={item.product?.images?.[0] || "https://placehold.co/48x48"} alt="" className="w-full h-full object-cover" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="truncate font-medium">{item.product?.name}</p>
                      <p className="text-muted-foreground">Qty: {item.quantity}</p>
                    </div>
                    <div className="font-semibold text-primary shrink-0">ETB {(item.subtotal || item.price * item.quantity || 0).toLocaleString()}</div>
                  </div>
                ))}
              </div>
              <div className="space-y-3 pt-4 border-t text-sm">
                <div className="flex justify-between"><span className="text-muted-foreground">Subtotal</span><span>ETB {(cart.subtotal || 0).toLocaleString()}</span></div>
                <div className="flex justify-between"><span className="text-muted-foreground">Shipping</span><span>ETB {(cart.shipping || 50).toLocaleString()}</span></div>
                <div className="h-px bg-border" />
                <div className="flex justify-between font-bold text-lg"><span>Total</span><span className="text-primary">ETB {(cart.total || 0).toLocaleString()}</span></div>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
