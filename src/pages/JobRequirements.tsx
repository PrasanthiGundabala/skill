import { useState } from "react";
import { Plus, Calendar, MapPin, Users, Search } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/components/ui/use-toast";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { JobUploadForm } from "@/components/forms/JobUploadForm";
import { useJobs } from "@/contexts/JobContext";

export default function JobRequirements() {
  const { state } = useJobs();
  const [searchTerm, setSearchTerm] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleViewCandidates = (jobId: number) => {
    const job = state.jobs.find(j => j.id === jobId);
    navigate(`/candidates?job=${jobId}&role=${encodeURIComponent(job?.title || '')}`);
    toast({
      title: "Viewing Candidates",
      description: `Showing candidates for ${job?.title}`,
    });
  };

  const filteredJobs = state.jobs.filter(
    (job) =>
      job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      job.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
      job.skills.some((skill) =>
        skill.toLowerCase().includes(searchTerm.toLowerCase())
      )
  );

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Job Requirements</h1>
          <p className="text-muted-foreground">
            Manage job postings and recruitment requirements
          </p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-gradient-primary hover:opacity-90">
              <Plus className="mr-2 h-4 w-4" />
              New Job Requirement
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Add New Job Requirement</DialogTitle>
              <DialogDescription>
                Upload job description and specify requirements for candidate matching.
              </DialogDescription>
            </DialogHeader>
            <JobUploadForm onClose={() => setIsDialogOpen(false)} />
          </DialogContent>
        </Dialog>
      </div>

      {/* Search and Filters */}
      <Card className="shadow-card">
        <CardContent className="p-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search by job title, company, or skills..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </CardContent>
      </Card>

      {/* Job Cards Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {filteredJobs.map((job) => (
          <Card
            key={job.id}
            className="shadow-card hover:shadow-elevated transition-shadow cursor-pointer"
          >
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="space-y-1">
                  <CardTitle className="text-lg text-foreground">
                    {job.title}
                  </CardTitle>
                  <CardDescription className="font-medium">
                    {job.company}
                  </CardDescription>
                </div>
                <Badge
                  variant={job.status === "active" ? "default" : "secondary"}
                  className={
                    job.status === "active"
                      ? "bg-success text-success-foreground"
                      : ""
                  }
                >
                  {job.status}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Location and Date */}
              <div className="flex items-center gap-4 text-sm text-muted-foreground">
                <div className="flex items-center gap-1">
                  <MapPin className="h-3 w-3" />
                  <span>{job.location}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Calendar className="h-3 w-3" />
                  <span>{job.datePosted}</span>
                </div>
              </div>

              {/* Applications Count */}
              <div className="flex items-center gap-2 text-sm">
                <Users className="h-4 w-4 text-primary" />
                <span className="font-medium text-foreground">
                  {job.applications} applications
                </span>
              </div>

              {/* Skills */}
              <div className="space-y-2">
                <p className="text-sm font-medium text-foreground">
                  Required Skills:
                </p>
                <div className="flex flex-wrap gap-1">
                  {job.skills.map((skill) => (
                    <Badge
                      key={skill}
                      variant="outline"
                      className="text-xs"
                    >
                      {skill}
                    </Badge>
                  ))}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-2 pt-2">
                <Button 
                  size="sm" 
                  className="w-full"
                  onClick={() => handleViewCandidates(job.id)}
                >
                  <Users className="mr-2 h-3 w-3" />
                  View Candidates
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredJobs.length === 0 && (
        <Card className="shadow-card">
          <CardContent className="py-12 text-center">
            <Users className="mx-auto h-12 w-12 text-muted-foreground" />
            <p className="mt-4 text-lg font-medium text-foreground">
              No job requirements found
            </p>
            <p className="text-muted-foreground">
              {searchTerm
                ? "Try adjusting your search terms"
                : "Get started by adding your first job requirement"}
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}