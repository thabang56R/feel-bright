import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/lib/auth";
import { toast } from "sonner";

export const Route = createFileRoute("/_authenticated/settings")({ component: SettingsPage });

function SettingsPage() {
  const { user, updateUser, logout } = useAuth();
  const [name, setName] = useState(user?.name ?? "");
  const [email, setEmail] = useState(user?.email ?? "");
  const [notif, setNotif] = useState({ email: true, push: false, weekly: true });

  const save = () => { updateUser({ name, email }); toast.success("Profile updated"); };

  return (
    <div className="space-y-6 animate-fade-up max-w-4xl">
      <div>
        <h1 className="font-display text-3xl font-bold tracking-tight">Profile & Settings</h1>
        <p className="mt-1 text-muted-foreground">Manage your account, preferences, and notifications.</p>
      </div>

      <Card className="glass border-border/60">
        <CardHeader>
          <CardTitle className="font-display">Profile</CardTitle>
          <CardDescription>This information appears across your workspace.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-5">
          <div className="flex items-center gap-4">
            <Avatar className="h-16 w-16 ring-2 ring-primary/30">
              <AvatarFallback className="bg-gradient-primary text-primary-foreground font-semibold">
                {user?.name?.slice(0, 2).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div>
              <p className="font-medium">{user?.name}</p>
              <Badge variant="secondary" className="mt-1 bg-primary/15 text-primary">{user?.plan} plan</Badge>
            </div>
          </div>
          <Separator />
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2"><Label>Full name</Label><Input value={name} onChange={(e) => setName(e.target.value)} /></div>
            <div className="space-y-2"><Label>Email</Label><Input value={email} type="email" onChange={(e) => setEmail(e.target.value)} /></div>
          </div>
          <Button onClick={save} className="bg-gradient-primary text-primary-foreground shadow-glow">Save changes</Button>
        </CardContent>
      </Card>

      <Card className="glass border-border/60">
        <CardHeader>
          <CardTitle className="font-display">Notifications</CardTitle>
          <CardDescription>Choose how Sentio reaches you.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-1">
          {([
            ["email", "Email alerts", "Sentiment spike alerts via email"],
            ["push", "Push notifications", "Real-time in-app pings"],
            ["weekly", "Weekly digest", "Every Monday at 9am"],
          ] as const).map(([key, title, desc]) => (
            <div key={key} className="flex items-center justify-between rounded-xl px-3 py-3 hover:bg-card/40">
              <div>
                <p className="text-sm font-medium">{title}</p>
                <p className="text-xs text-muted-foreground">{desc}</p>
              </div>
              <Switch checked={notif[key]} onCheckedChange={(v) => setNotif((p) => ({ ...p, [key]: v }))} />
            </div>
          ))}
        </CardContent>
      </Card>

      <Card className="glass border-destructive/30">
        <CardHeader>
          <CardTitle className="font-display text-destructive">Danger zone</CardTitle>
          <CardDescription>Sign out of your account on this device.</CardDescription>
        </CardHeader>
        <CardContent>
          <Button variant="outline" className="border-destructive/40 text-destructive hover:bg-destructive/10" onClick={logout}>
            Sign out
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
