import { useState } from "react";
import { Settings as SettingsIcon, User, Bell, Shield, Database, Sliders } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/components/ui/use-toast";

export default function Settings() {
  const [settings, setSettings] = useState({
    profile: {
      name: "Admin User",
      email: "admin@innomatics.in",
      phone: "+91 9876543210",
      organization: "Innomatics Research Labs",
      bio: "Placement coordinator managing resume evaluation system",
    },
    notifications: {
      emailNotifications: true,
      newApplications: true,
      shortlistUpdates: false,
      systemAlerts: true,
    },
    scoring: {
      skillsWeight: 40,
      experienceWeight: 30,
      educationWeight: 20,
      projectsWeight: 10,
      minimumScore: 60,
    },
    system: {
      duplicateThreshold: 85,
      autoShortlistThreshold: 80,
      maxResumeSize: 10,
      allowedFormats: ["pdf", "docx", "doc"],
    },
  });

  const { toast } = useToast();

  const handleSave = (section: string) => {
    toast({
      title: "Settings saved",
      description: `${section} settings have been updated successfully`,
    });
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-3xl font-bold text-foreground">Settings</h1>
        <p className="text-muted-foreground">
          Configure system preferences and evaluation parameters
        </p>
      </div>

      <Tabs defaultValue="profile" className="space-y-6">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="profile" className="flex items-center gap-2">
            <User className="h-4 w-4" />
            Profile
          </TabsTrigger>
          <TabsTrigger value="notifications" className="flex items-center gap-2">
            <Bell className="h-4 w-4" />
            Notifications
          </TabsTrigger>
          <TabsTrigger value="scoring" className="flex items-center gap-2">
            <Sliders className="h-4 w-4" />
            Scoring
          </TabsTrigger>
          <TabsTrigger value="system" className="flex items-center gap-2">
            <Database className="h-4 w-4" />
            System
          </TabsTrigger>
          <TabsTrigger value="security" className="flex items-center gap-2">
            <Shield className="h-4 w-4" />
            Security
          </TabsTrigger>
        </TabsList>

        {/* Profile Settings */}
        <TabsContent value="profile" className="space-y-6">
          <Card className="shadow-card">
            <CardHeader>
              <CardTitle>Profile Information</CardTitle>
              <CardDescription>
                Update your personal information and organization details
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Full Name</Label>
                  <Input
                    id="name"
                    value={settings.profile.name}
                    onChange={(e) =>
                      setSettings({
                        ...settings,
                        profile: { ...settings.profile, name: e.target.value },
                      })
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email Address</Label>
                  <Input
                    id="email"
                    type="email"
                    value={settings.profile.email}
                    onChange={(e) =>
                      setSettings({
                        ...settings,
                        profile: { ...settings.profile, email: e.target.value },
                      })
                    }
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="phone">Phone Number</Label>
                  <Input
                    id="phone"
                    value={settings.profile.phone}
                    onChange={(e) =>
                      setSettings({
                        ...settings,
                        profile: { ...settings.profile, phone: e.target.value },
                      })
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="organization">Organization</Label>
                  <Input
                    id="organization"
                    value={settings.profile.organization}
                    onChange={(e) =>
                      setSettings({
                        ...settings,
                        profile: { ...settings.profile, organization: e.target.value },
                      })
                    }
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="bio">Bio</Label>
                <Textarea
                  id="bio"
                  value={settings.profile.bio}
                  onChange={(e) =>
                    setSettings({
                      ...settings,
                      profile: { ...settings.profile, bio: e.target.value },
                    })
                  }
                  rows={3}
                />
              </div>
              <Button onClick={() => handleSave("Profile")}>Save Changes</Button>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Notification Settings */}
        <TabsContent value="notifications" className="space-y-6">
          <Card className="shadow-card">
            <CardHeader>
              <CardTitle>Notification Preferences</CardTitle>
              <CardDescription>
                Configure how you want to receive notifications
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Email Notifications</Label>
                  <p className="text-sm text-muted-foreground">
                    Receive notifications via email
                  </p>
                </div>
                <Switch
                  checked={settings.notifications.emailNotifications}
                  onCheckedChange={(checked) =>
                    setSettings({
                      ...settings,
                      notifications: {
                        ...settings.notifications,
                        emailNotifications: checked,
                      },
                    })
                  }
                />
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>New Applications</Label>
                  <p className="text-sm text-muted-foreground">
                    Get notified when new resumes are uploaded
                  </p>
                </div>
                <Switch
                  checked={settings.notifications.newApplications}
                  onCheckedChange={(checked) =>
                    setSettings({
                      ...settings,
                      notifications: {
                        ...settings.notifications,
                        newApplications: checked,
                      },
                    })
                  }
                />
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Shortlist Updates</Label>
                  <p className="text-sm text-muted-foreground">
                    Get notified when shortlists are shared or updated
                  </p>
                </div>
                <Switch
                  checked={settings.notifications.shortlistUpdates}
                  onCheckedChange={(checked) =>
                    setSettings({
                      ...settings,
                      notifications: {
                        ...settings.notifications,
                        shortlistUpdates: checked,
                      },
                    })
                  }
                />
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>System Alerts</Label>
                  <p className="text-sm text-muted-foreground">
                    Get notified about system maintenance and updates
                  </p>
                </div>
                <Switch
                  checked={settings.notifications.systemAlerts}
                  onCheckedChange={(checked) =>
                    setSettings({
                      ...settings,
                      notifications: {
                        ...settings.notifications,
                        systemAlerts: checked,
                      },
                    })
                  }
                />
              </div>
              <Button onClick={() => handleSave("Notification")}>Save Changes</Button>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Scoring Settings */}
        <TabsContent value="scoring" className="space-y-6">
          <Card className="shadow-card">
            <CardHeader>
              <CardTitle>Scoring Parameters</CardTitle>
              <CardDescription>
                Configure how resumes are scored and evaluated
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Skills Weight (%)</Label>
                  <Input
                    type="number"
                    min="0"
                    max="100"
                    value={settings.scoring.skillsWeight}
                    onChange={(e) =>
                      setSettings({
                        ...settings,
                        scoring: {
                          ...settings.scoring,
                          skillsWeight: parseInt(e.target.value) || 0,
                        },
                      })
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label>Experience Weight (%)</Label>
                  <Input
                    type="number"
                    min="0"
                    max="100"
                    value={settings.scoring.experienceWeight}
                    onChange={(e) =>
                      setSettings({
                        ...settings,
                        scoring: {
                          ...settings.scoring,
                          experienceWeight: parseInt(e.target.value) || 0,
                        },
                      })
                    }
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Education Weight (%)</Label>
                  <Input
                    type="number"
                    min="0"
                    max="100"
                    value={settings.scoring.educationWeight}
                    onChange={(e) =>
                      setSettings({
                        ...settings,
                        scoring: {
                          ...settings.scoring,
                          educationWeight: parseInt(e.target.value) || 0,
                        },
                      })
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label>Projects Weight (%)</Label>
                  <Input
                    type="number"
                    min="0"
                    max="100"
                    value={settings.scoring.projectsWeight}
                    onChange={(e) =>
                      setSettings({
                        ...settings,
                        scoring: {
                          ...settings.scoring,
                          projectsWeight: parseInt(e.target.value) || 0,
                        },
                      })
                    }
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label>Minimum Passing Score (%)</Label>
                <Input
                  type="number"
                  min="0"
                  max="100"
                  value={settings.scoring.minimumScore}
                  onChange={(e) =>
                    setSettings({
                      ...settings,
                      scoring: {
                        ...settings.scoring,
                        minimumScore: parseInt(e.target.value) || 0,
                      },
                    })
                  }
                />
              </div>
              <div className="p-4 bg-accent rounded-lg">
                <p className="text-sm text-muted-foreground">
                  Total Weight: {
                    settings.scoring.skillsWeight +
                    settings.scoring.experienceWeight +
                    settings.scoring.educationWeight +
                    settings.scoring.projectsWeight
                  }% (should equal 100%)
                </p>
              </div>
              <Button onClick={() => handleSave("Scoring")}>Save Changes</Button>
            </CardContent>
          </Card>
        </TabsContent>

        {/* System Settings */}
        <TabsContent value="system" className="space-y-6">
          <Card className="shadow-card">
            <CardHeader>
              <CardTitle>System Configuration</CardTitle>
              <CardDescription>
                Configure system-wide settings and thresholds
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Duplicate Detection Threshold (%)</Label>
                  <Input
                    type="number"
                    min="50"
                    max="100"
                    value={settings.system.duplicateThreshold}
                    onChange={(e) =>
                      setSettings({
                        ...settings,
                        system: {
                          ...settings.system,
                          duplicateThreshold: parseInt(e.target.value) || 85,
                        },
                      })
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label>Auto-Shortlist Threshold (%)</Label>
                  <Input
                    type="number"
                    min="0"
                    max="100"
                    value={settings.system.autoShortlistThreshold}
                    onChange={(e) =>
                      setSettings({
                        ...settings,
                        system: {
                          ...settings.system,
                          autoShortlistThreshold: parseInt(e.target.value) || 80,
                        },
                      })
                    }
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label>Maximum Resume File Size (MB)</Label>
                <Input
                  type="number"
                  min="1"
                  max="50"
                  value={settings.system.maxResumeSize}
                  onChange={(e) =>
                    setSettings({
                      ...settings,
                      system: {
                        ...settings.system,
                        maxResumeSize: parseInt(e.target.value) || 10,
                      },
                    })
                  }
                />
              </div>
              <Button onClick={() => handleSave("System")}>Save Changes</Button>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Security Settings */}
        <TabsContent value="security" className="space-y-6">
          <Card className="shadow-card">
            <CardHeader>
              <CardTitle>Security Settings</CardTitle>
              <CardDescription>
                Manage your account security and access controls
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Current Password</Label>
                <Input type="password" placeholder="Enter current password" />
              </div>
              <div className="space-y-2">
                <Label>New Password</Label>
                <Input type="password" placeholder="Enter new password" />
              </div>
              <div className="space-y-2">
                <Label>Confirm New Password</Label>
                <Input type="password" placeholder="Confirm new password" />
              </div>
              <Button onClick={() => handleSave("Security")}>Update Password</Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}