"use client";

import type React from "react";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { DashboardHeader } from "@/components/dashboard-header";
import { DashboardSidebar } from "@/components/dashboard-sidebar";
// Add the Database import at the top of the file
import { User, Bell, Shield, Moon, Sun, Database } from "lucide-react";
// Import the SetupDatabase component
import { DbConnectionTest } from "@/components/db-connection-test";
import { SetupDatabase } from "@/dashboard/settings/setup-database";
import { DbSeed } from "@/components/db-seed";

export default function Settings() {
  const [userEmail, setUserEmail] = useState<string>("");
  const [userProfile, setUserProfile] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const email = localStorage.getItem("userEmail");

    if (email) {
      setUserEmail(email);
    }
  }, []);

  // Fetch user profile data when email is available
  useEffect(() => {
    async function fetchUserProfile() {
      if (!userEmail) return;

      setIsLoading(true);
      setError(null);

      try {
        const response = await fetch("/api/user-profile", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email: userEmail }),
        });

        if (!response.ok) {
          throw new Error("Failed to fetch profile data");
        }

        const data = await response.json();
        console.log("User Profile Data:", data);
        setUserProfile(data);
      } catch (err) {
        console.error("Error fetching user profile:", err);
        setError("Could not load your profile data");
      } finally {
        setIsLoading(false);
      }
    }

    fetchUserProfile();
  }, [userEmail]);

  const [notificationSettings, setNotificationSettings] = useState({
    workoutReminders: true,
    progressUpdates: true,
    achievements: true,
    weeklyReports: false,
  });

  const [theme, setTheme] = useState("dark");

  const handleProfileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setUserProfile((prev: any) => ({ ...prev, [name]: value }));
  };

  const handleNotificationChange = (key: string, checked: boolean) => {
    setNotificationSettings((prev) => ({ ...prev, [key]: checked }));
  };

  const handleThemeChange = (value: string) => {
    setTheme(value);
    // In a real app, this would update the theme in the database and apply it to the UI
  };

  const handleProfileSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // In a real app, this would update the profile in the database
    alert("Profile updated successfully!");
  };

  return (
    <div className="flex min-h-screen flex-col">
      <DashboardHeader />

      <div className="flex flex-1">
        <DashboardSidebar />

        <main className="flex-1 overflow-y-auto">
          <div className="container py-6">
            <div className="mb-6">
              <h1 className="text-2xl font-bold">Settings</h1>
              <p className="text-muted-foreground">
                Manage your account settings and preferences
              </p>
            </div>

            <Tabs defaultValue="profile" className="space-y-6">
              {/* Add a new tab for database settings */}
              <TabsList>
                <TabsTrigger
                  value="profile"
                  className="flex items-center gap-2"
                >
                  <User className="h-4 w-4" /> Profile
                </TabsTrigger>
                <TabsTrigger
                  value="notifications"
                  className="flex items-center gap-2"
                >
                  <Bell className="h-4 w-4" /> Notifications
                </TabsTrigger>
                <TabsTrigger
                  value="appearance"
                  className="flex items-center gap-2"
                >
                  <Moon className="h-4 w-4" /> Appearance
                </TabsTrigger>
                <TabsTrigger
                  value="privacy"
                  className="flex items-center gap-2"
                >
                  <Shield className="h-4 w-4" /> Privacy
                </TabsTrigger>
                <TabsTrigger
                  value="database"
                  className="flex items-center gap-2"
                >
                  <Database className="h-4 w-4" /> Database
                </TabsTrigger>
              </TabsList>

              <TabsContent value="profile">
                <Card className="dashboard-tile">
                  <CardHeader className="pb-2">
                    <CardTitle>Profile Information</CardTitle>
                    <CardDescription>
                      Update your personal information
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <form onSubmit={handleProfileSubmit} className="space-y-6">
                      <div className="grid gap-4 md:grid-cols-2">
                        <div className="space-y-2">
                          <Label htmlFor="name">Full Name</Label>
                          <Input
                            id="name"
                            name="name"
                            value={userProfile && userProfile.userData.name}
                            onChange={handleProfileChange}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="email">Email</Label>
                          <Input
                            id="email"
                            name="email"
                            type="email"
                            value={userProfile && userProfile.userData.email}
                            onChange={handleProfileChange}
                          />
                        </div>
                      </div>

                      <div className="grid gap-4 md:grid-cols-3">
                        <div className="space-y-2">
                          <Label htmlFor="height">Height (cm)</Label>
                          <Input
                            id="height"
                            name="height"
                            type="number"
                            value={userProfile && userProfile.height}
                            onChange={handleProfileChange}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="weight">Weight (kg)</Label>
                          <Input
                            id="weight"
                            name="weight"
                            type="number"
                            value={userProfile && userProfile.weight}
                            onChange={handleProfileChange}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="age">Age</Label>
                          <Input
                            id="age"
                            name="age"
                            type="number"
                            value={userProfile && userProfile.age}
                            onChange={handleProfileChange}
                          />
                        </div>
                      </div>

                      <div className="flex justify-end">
                        <Button type="submit">Save Changes</Button>
                      </div>
                    </form>
                  </CardContent>
                </Card>

                <Card className="dashboard-tile mt-6">
                  <CardHeader className="pb-2">
                    <CardTitle>Change Password</CardTitle>
                    <CardDescription>
                      Update your password to keep your account secure
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <form className="space-y-6">
                      <div className="grid gap-4 md:grid-cols-2">
                        <div className="space-y-2">
                          <Label htmlFor="current-password">
                            Current Password
                          </Label>
                          <Input
                            id="current-password"
                            type="password"
                            placeholder="••••••••"
                          />
                        </div>
                      </div>

                      <div className="grid gap-4 md:grid-cols-2">
                        <div className="space-y-2">
                          <Label htmlFor="new-password">New Password</Label>
                          <Input
                            id="new-password"
                            type="password"
                            placeholder="••••••••"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="confirm-password">
                            Confirm New Password
                          </Label>
                          <Input
                            id="confirm-password"
                            type="password"
                            placeholder="••••••••"
                          />
                        </div>
                      </div>

                      <div className="flex justify-end">
                        <Button type="submit">Update Password</Button>
                      </div>
                    </form>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="notifications">
                <Card className="dashboard-tile">
                  <CardHeader className="pb-2">
                    <CardTitle>Notification Preferences</CardTitle>
                    <CardDescription>
                      Choose what notifications you want to receive
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-6">
                      <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                          <Label htmlFor="workout-reminders">
                            Workout Reminders
                          </Label>
                          <p className="text-sm text-muted-foreground">
                            Receive reminders for upcoming workouts
                          </p>
                        </div>
                        <Switch
                          id="workout-reminders"
                          checked={notificationSettings.workoutReminders}
                          onCheckedChange={(checked) =>
                            handleNotificationChange(
                              "workoutReminders",
                              checked
                            )
                          }
                        />
                      </div>

                      <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                          <Label htmlFor="progress-updates">
                            Progress Updates
                          </Label>
                          <p className="text-sm text-muted-foreground">
                            Get notified about your fitness progress
                          </p>
                        </div>
                        <Switch
                          id="progress-updates"
                          checked={notificationSettings.progressUpdates}
                          onCheckedChange={(checked) =>
                            handleNotificationChange("progressUpdates", checked)
                          }
                        />
                      </div>

                      <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                          <Label htmlFor="achievements">Achievements</Label>
                          <p className="text-sm text-muted-foreground">
                            Receive notifications when you earn achievements
                          </p>
                        </div>
                        <Switch
                          id="achievements"
                          checked={notificationSettings.achievements}
                          onCheckedChange={(checked) =>
                            handleNotificationChange("achievements", checked)
                          }
                        />
                      </div>

                      <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                          <Label htmlFor="weekly-reports">Weekly Reports</Label>
                          <p className="text-sm text-muted-foreground">
                            Receive weekly summary of your workouts and progress
                          </p>
                        </div>
                        <Switch
                          id="weekly-reports"
                          checked={notificationSettings.weeklyReports}
                          onCheckedChange={(checked) =>
                            handleNotificationChange("weeklyReports", checked)
                          }
                        />
                      </div>

                      <div className="flex justify-end">
                        <Button>Save Preferences</Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="appearance">
                <Card className="dashboard-tile">
                  <CardHeader className="pb-2">
                    <CardTitle>Appearance Settings</CardTitle>
                    <CardDescription>
                      Customize how WorkItOut looks for you
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-6">
                      <div className="space-y-2">
                        <Label htmlFor="theme">Theme</Label>
                        <Select value={theme} onValueChange={handleThemeChange}>
                          <SelectTrigger
                            id="theme"
                            className="w-full md:w-[200px]"
                          >
                            <SelectValue placeholder="Select theme" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem
                              value="light"
                              className="flex items-center gap-2"
                            >
                              <Sun className="h-4 w-4" /> Light
                            </SelectItem>
                            <SelectItem
                              value="dark"
                              className="flex items-center gap-2"
                            >
                              <Moon className="h-4 w-4" /> Dark
                            </SelectItem>
                            <SelectItem
                              value="system"
                              className="flex items-center gap-2"
                            >
                              <div className="flex">
                                <Sun className="h-4 w-4" />
                                <Moon className="h-4 w-4 -ml-1" />
                              </div>
                              System
                            </SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="flex justify-end">
                        <Button>Save Preferences</Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="privacy">
                <Card className="dashboard-tile">
                  <CardHeader className="pb-2">
                    <CardTitle>Privacy Settings</CardTitle>
                    <CardDescription>
                      Manage your data and privacy preferences
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-6">
                      <div className="space-y-4">
                        <h3 className="text-lg font-medium">Data Usage</h3>
                        <div className="space-y-2">
                          <div className="flex items-center gap-2">
                            <Switch id="analytics" defaultChecked />
                            <Label htmlFor="analytics">
                              Allow anonymous usage analytics
                            </Label>
                          </div>
                          <p className="text-sm text-muted-foreground pl-7">
                            Help us improve WorkItOut by allowing anonymous
                            usage data collection
                          </p>
                        </div>
                      </div>

                      <div className="space-y-4">
                        <h3 className="text-lg font-medium">Account Actions</h3>
                        <div className="space-y-2">
                          <Button
                            variant="outline"
                            className="w-full md:w-auto"
                          >
                            Download My Data
                          </Button>
                          <p className="text-sm text-muted-foreground">
                            Get a copy of all your personal data
                          </p>
                        </div>
                        <div className="space-y-2">
                          <Button
                            variant="destructive"
                            className="w-full md:w-auto"
                          >
                            Delete Account
                          </Button>
                          <p className="text-sm text-muted-foreground">
                            Permanently delete your account and all your data
                          </p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Add the Database tab content */}
              <TabsContent value="database">
                <Card className="dashboard-tile">
                  <CardHeader className="pb-2">
                    <CardTitle>Database Connection</CardTitle>
                    <CardDescription>
                      Verify the connection to the MySQL database
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <DbConnectionTest />
                  </CardContent>
                </Card>

                <Card className="dashboard-tile mt-6">
                  <CardHeader className="pb-2">
                    <CardTitle>Database Setup</CardTitle>
                    <CardDescription>
                      Initialize or reset the database
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <SetupDatabase />
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </main>
      </div>
    </div>
  );
}
