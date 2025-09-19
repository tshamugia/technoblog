"use client";

import { LogOut, Settings, User } from "lucide-react";
import { signOut, useSession } from "next-auth/react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default function DashboardPage() {
  const { data: session, status } = useSession();

  if (status === "loading") {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!session) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <h2 className="text-xl font-semibold mb-2">Not authenticated</h2>
          <p className="text-muted-foreground">
            Please sign in to access the dashboard.
          </p>
        </div>
      </div>
    );
  }

  const handleSignOut = () => {
    signOut({ callbackUrl: "/" });
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
            <p className="text-muted-foreground">
              Welcome back, {session.user.name || session.user.email}
            </p>
          </div>
          <Button onClick={handleSignOut} variant="outline">
            <LogOut className="w-4 h-4 mr-2" />
            Sign Out
          </Button>
        </div>

        {/* User Profile Card */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="w-5 h-5" />
              Profile Information
            </CardTitle>
            <CardDescription>
              Your account information and settings
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-4">
              <Avatar className="w-16 h-16">
                <AvatarImage
                  src={session.user.image || ""}
                  alt={session.user.name || ""}
                />
                <AvatarFallback>
                  {session.user.name?.charAt(0).toUpperCase() ||
                    session.user.email?.charAt(0).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <div className="space-y-1">
                <h3 className="text-lg font-semibold">{session.user.name}</h3>
                <p className="text-sm text-muted-foreground">
                  {session.user.email}
                </p>
                {session.user.username && (
                  <p className="text-sm text-muted-foreground">
                    @{session.user.username}
                  </p>
                )}
                <Badge variant="secondary">{session.user.role || "user"}</Badge>
              </div>
            </div>

            <div className="pt-4">
              <Button variant="outline">
                <Settings className="w-4 h-4 mr-2" />
                Edit Profile
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Recent Activity</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                No recent activity to display.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">My Posts</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                You haven't created any posts yet.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Settings</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Manage your account preferences.
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Debug Information (Development Only) */}
        {process.env.NODE_ENV === "development" && (
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Debug Information</CardTitle>
              <CardDescription>
                Development information (not shown in production)
              </CardDescription>
            </CardHeader>
            <CardContent>
              <pre className="text-xs bg-muted p-3 rounded-md overflow-x-auto">
                {JSON.stringify(session, null, 2)}
              </pre>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
