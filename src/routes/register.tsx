import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState, type FormEvent } from "react";
import { useAuth } from "@/lib/auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import { AuthShell } from "./login";

export const Route = createFileRoute("/register")({ component: RegisterPage });

function RegisterPage() {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await register(name, email, password);
      toast.success("Account created — welcome to Sentio!");
      navigate({ to: "/dashboard" });
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Sign-up failed");
    } finally { setLoading(false); }
  };

  return <AuthShell title="Create your account" subtitle="Start analyzing sentiment in minutes">
    <form onSubmit={onSubmit} className="space-y-4">
      <div className="space-y-2"><Label htmlFor="name">Full name</Label>
        <Input id="name" value={name} onChange={(e) => setName(e.target.value)} required /></div>
      <div className="space-y-2"><Label htmlFor="email">Work email</Label>
        <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required /></div>
      <div className="space-y-2"><Label htmlFor="password">Password</Label>
        <Input id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required minLength={6} /></div>
      <Button type="submit" disabled={loading} className="w-full bg-gradient-primary text-primary-foreground shadow-glow hover:opacity-90">
        {loading ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" />Creating…</> : "Create account"}
      </Button>
      <p className="text-center text-sm text-muted-foreground">
        Already have one? <Link to="/login" className="text-primary hover:underline">Sign in</Link>
      </p>
    </form>
  </AuthShell>;
}
