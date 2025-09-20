import { BarChart3, FileText, Users, Upload, TrendingUp, Clock, CheckCircle } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/components/ui/use-toast";

const statsCards = [
  {
    title: "Total Resumes",
    value: "2,847",
    change: "+12.3%",
    icon: FileText,
    color: "text-primary",
  },
  {
    title: "Active Jobs",
    value: "18",
    change: "+3 this week",
    icon: Upload,
    color: "text-success",
  },
  {
    title: "Candidates Shortlisted",
    value: "342",
    change: "+8.1%",
    icon: Users,
    color: "text-warning",
  },
  {
    title: "Processing Queue",
    value: "156",
    change: "24 completed today",
    icon: Clock,
    color: "text-destructive",
  },
];

const recentJobs = [
  {
    title: "Senior Software Engineer",
    company: "TechCorp Solutions",
    applications: 124,
    processed: 98,
    status: "active",
  },
  {
    title: "Data Analyst",
    company: "Analytics Pro",
    applications: 89,
    processed: 89,
    status: "completed",
  },
  {
    title: "Frontend Developer", 
    company: "WebDev Inc",
    applications: 156,
    processed: 76,
    status: "active",
  },
];

export default function Dashboard() {
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleQuickAction = (action: string, path: string) => {
    navigate(path);
    toast({
      title: "Navigating",
      description: `Opening ${action}...`,
    });
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-3xl font-bold text-foreground">Dashboard</h1>
        <p className="text-muted-foreground">
          Overview of resume evaluation and recruitment activities
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
        {statsCards.map((stat) => (
          <Card key={stat.title} className="shadow-card hover:shadow-elevated transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {stat.title}
              </CardTitle>
              <stat.icon className={`h-4 w-4 ${stat.color}`} />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-foreground">{stat.value}</div>
              <p className="text-xs text-muted-foreground">
                {stat.change}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Main Content Grid */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Recent Job Postings */}
        <Card className="lg:col-span-2 shadow-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5 text-primary" />
              Recent Job Postings
            </CardTitle>
            <CardDescription>
              Active recruitment drives and their progress
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {recentJobs.map((job) => (
              <div
                key={job.title}
                className="flex items-center justify-between rounded-lg border p-4 hover:bg-accent/50 transition-colors"
              >
                <div className="space-y-1">
                  <p className="font-medium text-foreground">{job.title}</p>
                  <p className="text-sm text-muted-foreground">{job.company}</p>
                  <div className="flex items-center gap-4 text-xs text-muted-foreground">
                    <span>{job.applications} applications</span>
                    <span>{job.processed} processed</span>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Progress 
                    value={(job.processed / job.applications) * 100} 
                    className="w-20" 
                  />
                  <span
                    className={`rounded-full px-2 py-1 text-xs font-medium ${
                      job.status === "completed"
                        ? "bg-success-light text-success"
                        : "bg-warning-light text-warning"
                    }`}
                  >
                    {job.status}
                  </span>
                </div>
              </div>
            ))}
            <Button className="w-full" variant="outline">
              View All Jobs
            </Button>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <Card className="shadow-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-primary" />
              Quick Actions
            </CardTitle>
            <CardDescription>
              Common tasks and shortcuts
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <Button 
              className="w-full justify-start bg-gradient-primary hover:opacity-90" 
              size="lg"
              onClick={() => handleQuickAction("Upload New Job", "/jobs")}
            >
              <Upload className="mr-2 h-4 w-4" />
              Upload New Job
            </Button>
            <Button 
              className="w-full justify-start" 
              variant="outline" 
              size="lg"
              onClick={() => handleQuickAction("Bulk Resume Upload", "/upload")}
            >
              <FileText className="mr-2 h-4 w-4" />
              Bulk Resume Upload
            </Button>
            <Button 
              className="w-full justify-start" 
              variant="outline" 
              size="lg"
              onClick={() => handleQuickAction("Review Candidates", "/candidates")}
            >
              <Users className="mr-2 h-4 w-4" />
              Review Candidates
            </Button>
            <Button 
              className="w-full justify-start" 
              variant="outline" 
              size="lg"
              onClick={() => handleQuickAction("Export Shortlists", "/shortlists")}
            >
              <CheckCircle className="mr-2 h-4 w-4" />
              Export Shortlists
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}