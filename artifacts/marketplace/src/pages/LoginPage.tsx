import { useState } from "react";
import { useAuth } from "@/lib/auth-context";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { ShoppingBag } from "lucide-react";
import { Link } from "wouter";

export default function LoginPage() {
  const { login } = useAuth();
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      await login(email, password);
      toast({ title: "Welcome back!", description: "You are now logged in." });
      setLocation("/");
    } catch (err: any) {
      toast({ variant: "destructive", title: "Login failed", description: err.message });
    } finally {
      setIsLoading(false);
    }
  };

  const handleDemoLogin = async (role: string) => {
    const demos: Record<string, { email: string; password: string }> = {
      customer: { email: "customer@ethiomart.com", password: "customer123" },
      seller: { email: "seller1@ethiomart.com", password: "seller123" },
      admin: { email: "admin@ethiomart.com", password: "admin123" },
    };
    const demo = demos[role];
    setEmail(demo.email);
    setPassword(demo.password);
    setIsLoading(true);
    try {
      await login(demo.email, demo.password);
      toast({ title: `Logged in as ${role}!` });
      setLocation(role === "seller" ? "/seller" : role === "admin" ? "/admin" : "/");
    } catch (err: any) {
      toast({ variant: "destructive", title: "Login failed", description: err.message });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-2 text-2xl font-bold text-primary mb-4">
            <ShoppingBag className="w-8 h-8" />
            EthioMart
          </Link>
          <h1 className="text-2xl font-bold">Welcome back</h1>
          <p className="text-muted-foreground">Sign in to your account</p>
        </div>

        <div className="bg-card border rounded-2xl p-8 shadow-sm">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="you@example.com" required className="mt-1" />
            </div>
            <div>
              <Label htmlFor="password">Password</Label>
              <Input id="password" type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="••••••••" required className="mt-1" />
            </div>
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? "Signing in..." : "Sign In"}
            </Button>
          </form>

          <div className="mt-4 pt-4 border-t">
            <p className="text-center text-sm text-muted-foreground mb-3">Demo accounts:</p>
            <div className="grid grid-cols-3 gap-2">
              {["customer", "seller", "admin"].map(role => (
                <Button key={role} variant="outline" size="sm" onClick={() => handleDemoLogin(role)} disabled={isLoading} className="capitalize text-xs">
                  {role}
                </Button>
              ))}
            </div>
          </div>

          <p className="text-center text-sm text-muted-foreground mt-4">
            Don't have an account?{" "}
            <Link href="/register" className="text-primary font-medium hover:underline">Sign up</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
