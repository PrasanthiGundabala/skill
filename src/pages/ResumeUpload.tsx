import { useState } from "react";
import { Upload, FileText, X, CheckCircle, AlertCircle } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { useToast } from "@/components/ui/use-toast";
import { useApp } from "@/contexts/AppContext";

interface UploadedResume {
  id: string;
  name: string;
  size: number;
  status: "uploading" | "success" | "error" | "duplicate";
  progress: number;
  candidateName?: string;
  jobRole?: string;
}

export default function ResumeUpload() {
  const { dispatch } = useApp();
  const [dragActive, setDragActive] = useState(false);
  const [uploadedResumes, setUploadedResumes] = useState<UploadedResume[]>([]);
  const { toast } = useToast();

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    const files = Array.from(e.dataTransfer.files);
    processFiles(files);
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    processFiles(files);
  };

  const processFiles = (files: File[]) => {
    const validFiles = files.filter(file => 
      file.type === "application/pdf" || 
      file.name.endsWith('.docx') || 
      file.name.endsWith('.doc')
    );

    if (validFiles.length !== files.length) {
      toast({
        title: "Invalid files detected",
        description: "Only PDF and DOC/DOCX files are supported",
        variant: "destructive",
      });
    }

    validFiles.forEach((file) => {
      const resumeId = Math.random().toString(36).substr(2, 9);
      const newResume: UploadedResume = {
        id: resumeId,
        name: file.name,
        size: file.size,
        status: "uploading",
        progress: 0,
      };

      setUploadedResumes(prev => [...prev, newResume]);

      // Simulate upload process
      simulateUpload(resumeId);
    });
  };

  const simulateUpload = (resumeId: string) => {
    let progress = 0;
    const interval = setInterval(() => {
      progress += Math.random() * 30;
      
      setUploadedResumes(prev => 
        prev.map(resume => 
          resume.id === resumeId 
            ? { ...resume, progress: Math.min(progress, 100) }
            : resume
        )
      );

      if (progress >= 100) {
        clearInterval(interval);
        // Simulate different outcomes
        const outcomes = ["success", "duplicate", "error"];
        const randomOutcome = outcomes[Math.floor(Math.random() * outcomes.length)] as "success" | "duplicate" | "error";
        
        setUploadedResumes(prev => {
          const updatedResumes = prev.map(resume => 
            resume.id === resumeId 
              ? { 
                  ...resume, 
                  status: randomOutcome,
                  progress: 100,
                  candidateName: randomOutcome === "success" ? "John Doe" : undefined,
                  jobRole: randomOutcome === "success" ? "Software Engineer" : undefined,
                }
              : resume
          );

          // If successful, add candidate to the list
          if (randomOutcome === "success") {
            const updatedResume = updatedResumes.find(r => r.id === resumeId);
            if (updatedResume) {
              // Generate more realistic candidate data based on file name
              const fileName = updatedResume.name.toLowerCase();
              const candidateNames = [
                "Alex Johnson", "Sarah Williams", "Michael Chen", "Emily Davis", 
                "David Rodriguez", "Lisa Anderson", "James Wilson", "Maria Garcia"
              ];
              const jobRoles = [
                "Software Engineer", "Frontend Developer", "Backend Developer", 
                "Full Stack Developer", "Data Analyst", "DevOps Engineer"
              ];
              const locations = ["Bangalore", "Hyderabad", "Pune", "Delhi NCR", "Mumbai", "Chennai"];
              const skillSets = [
                ["JavaScript", "React", "Node.js", "MongoDB"],
                ["Python", "Django", "PostgreSQL", "AWS"],
                ["Java", "Spring Boot", "MySQL", "Docker"],
                ["TypeScript", "Angular", "Express", "Redis"],
                ["C#", ".NET", "SQL Server", "Azure"],
                ["Go", "Gin", "PostgreSQL", "Kubernetes"]
              ];
              
              const randomName = candidateNames[Math.floor(Math.random() * candidateNames.length)];
              const randomRole = jobRoles[Math.floor(Math.random() * jobRoles.length)];
              const randomLocation = locations[Math.floor(Math.random() * locations.length)];
              const randomSkills = skillSets[Math.floor(Math.random() * skillSets.length)];
              const randomScore = Math.floor(Math.random() * 40) + 60;
              
              const newCandidate = {
                id: Date.now() + Math.random(), // Generate unique ID
                name: randomName,
                email: `${randomName.toLowerCase().replace(/\s+/g, '.')}@email.com`,
                phone: `+91 ${Math.floor(Math.random() * 9000000000) + 1000000000}`,
                location: randomLocation,
                experience: `${Math.floor(Math.random() * 5) + 1}+ years`,
                jobRole: randomRole,
                relevanceScore: randomScore,
                verdict: randomScore >= 80 ? "High" as const : randomScore >= 65 ? "Medium" as const : "Low" as const,
                skills: randomSkills,
                appliedDate: new Date().toISOString().split('T')[0],
                isDuplicate: false,
                missingSkills: ["AWS", "Docker", "Testing"],
              };
              
              dispatch({ type: 'ADD_UPLOADED_CANDIDATE', payload: newCandidate });
              
              toast({
                title: "Resume processed successfully",
                description: `${randomName} has been added to the candidates list`,
              });
            }
          }

          return updatedResumes;
        });
      }
    }, 200);
  };

  const removeResume = (id: string) => {
    setUploadedResumes(prev => prev.filter(resume => resume.id !== id));
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "success":
        return <CheckCircle className="h-4 w-4 text-success" />;
      case "error":
        return <AlertCircle className="h-4 w-4 text-destructive" />;
      case "duplicate":
        return <AlertCircle className="h-4 w-4 text-warning" />;
      default:
        return <Upload className="h-4 w-4 text-primary animate-pulse" />;
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case "success":
        return "Processed";
      case "error":
        return "Failed";
      case "duplicate":
        return "Duplicate";
      default:
        return "Processing";
    }
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-3xl font-bold text-foreground">Resume Upload</h1>
        <p className="text-muted-foreground">
          Bulk upload resumes for automated processing and evaluation
        </p>
      </div>

      {/* Upload Area */}
      <Card
        className={`border-2 border-dashed transition-colors ${
          dragActive
            ? "border-primary bg-primary-light/20"
            : "border-muted-foreground/25 hover:border-muted-foreground/50"
        }`}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
      >
        <CardContent className="p-12">
          <div className="text-center">
            <Upload className="mx-auto h-16 w-16 text-muted-foreground" />
            <h3 className="mt-4 text-lg font-semibold">Upload Resumes</h3>
            <p className="mt-2 text-sm text-muted-foreground">
              Drag and drop your resume files here, or{" "}
              <label className="cursor-pointer text-primary hover:underline">
                browse
                <input
                  type="file"
                  className="hidden"
                  multiple
                  accept=".pdf,.docx,.doc"
                  onChange={handleFileSelect}
                />
              </label>
            </p>
            <div className="mt-4 flex justify-center gap-4 text-xs text-muted-foreground">
              <span>• Supports PDF, DOC, DOCX</span>
              <span>• Max 10MB per file</span>
              <span>• Bulk upload supported</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Uploaded Resumes */}
      {uploadedResumes.length > 0 && (
        <Card className="shadow-card">
          <CardHeader>
            <CardTitle>Uploaded Resumes ({uploadedResumes.length})</CardTitle>
            <CardDescription>
              Processing status and candidate extraction results
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {uploadedResumes.map((resume) => (
                <div key={resume.id} className="flex items-center gap-4 rounded-lg border p-4">
                  <div className="flex-shrink-0">
                    {getStatusIcon(resume.status)}
                  </div>
                  
                  <div className="flex-1 space-y-2">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium text-foreground">{resume.name}</p>
                        <p className="text-sm text-muted-foreground">
                          {(resume.size / 1024).toFixed(1)} KB
                        </p>
                      </div>
                      <Badge 
                        variant={resume.status === "success" ? "default" : "outline"}
                        className={
                          resume.status === "success" 
                            ? "bg-success text-success-foreground"
                            : resume.status === "error"
                            ? "bg-destructive text-destructive-foreground"
                            : resume.status === "duplicate"
                            ? "bg-warning text-warning-foreground"
                            : ""
                        }
                      >
                        {getStatusText(resume.status)}
                      </Badge>
                    </div>

                    {resume.status === "uploading" && (
                      <Progress value={resume.progress} className="w-full" />
                    )}

                    {resume.status === "success" && resume.candidateName && (
                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <span>Candidate: {resume.candidateName}</span>
                        <span>Role: {resume.jobRole}</span>
                      </div>
                    )}

                    {resume.status === "duplicate" && (
                      <p className="text-sm text-warning">
                        Similar resume already exists in the system
                      </p>
                    )}

                    {resume.status === "error" && (
                      <p className="text-sm text-destructive">
                        Failed to process resume. Please check file format.
                      </p>
                    )}
                  </div>

                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => removeResume(resume.id)}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Stats */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-foreground">
              {uploadedResumes.filter(r => r.status === "success").length}
            </div>
            <p className="text-sm text-muted-foreground">Successfully Processed</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-warning">
              {uploadedResumes.filter(r => r.status === "duplicate").length}
            </div>
            <p className="text-sm text-muted-foreground">Duplicates Detected</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-destructive">
              {uploadedResumes.filter(r => r.status === "error").length}
            </div>
            <p className="text-sm text-muted-foreground">Failed Processing</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-primary">
              {uploadedResumes.filter(r => r.status === "uploading").length}
            </div>
            <p className="text-sm text-muted-foreground">Currently Processing</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}