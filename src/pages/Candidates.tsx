import { useState, useEffect } from "react";
import { Search, Filter, Download, Star, MapPin, Calendar, FileText, User } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Progress } from "@/components/ui/progress";
import { useToast } from "@/components/ui/use-toast";
import { useSearchParams } from "react-router-dom";
import { useApp } from "@/contexts/AppContext";
import { exportToPDF, exportToCSV } from "@/lib/pdfExport";

export default function Candidates() {
  const { state, dispatch } = useApp();
  const [searchParams] = useSearchParams();
  const [searchTerm, setSearchTerm] = useState(searchParams.get("search") || "");
  const [filterVerdict, setFilterVerdict] = useState("all");
  const [filterRole, setFilterRole] = useState("all");
  const [showDuplicates, setShowDuplicates] = useState(true);
  const [selectedCandidates, setSelectedCandidates] = useState<number[]>([]);
  const { toast } = useToast();

  useEffect(() => {
    const searchParam = searchParams.get("search");
    if (searchParam) {
      setSearchTerm(searchParam);
    }
  }, [searchParams]);

  const filteredCandidates = state.candidates.filter((candidate) => {
    const matchesSearch = 
      candidate.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      candidate.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      candidate.jobRole.toLowerCase().includes(searchTerm.toLowerCase()) ||
      candidate.skills.some(skill => skill.toLowerCase().includes(searchTerm.toLowerCase()));

    const matchesVerdict = filterVerdict === "all" || candidate.verdict.toLowerCase() === filterVerdict;
    const matchesRole = filterRole === "all" || candidate.jobRole === filterRole;
    const matchesDuplicates = showDuplicates || !candidate.isDuplicate;

    return matchesSearch && matchesVerdict && matchesRole && matchesDuplicates;
  });

  const handleSelectCandidate = (candidateId: number) => {
    setSelectedCandidates(prev => 
      prev.includes(candidateId) 
        ? prev.filter(id => id !== candidateId)
        : [...prev, candidateId]
    );
  };

  const handleShortlist = (candidateId: number) => {
    dispatch({ type: 'SHORTLIST_CANDIDATE', payload: candidateId });
    toast({
      title: "Candidate shortlisted",
      description: "Candidate has been added to the shortlist successfully",
    });
  };

  const handleExportSelected = (format: "excel" | "pdf") => {
    if (selectedCandidates.length === 0) {
      toast({
        title: "No candidates selected",
        description: "Please select candidates to export",
        variant: "destructive",
      });
      return;
    }

    const candidatesToExport = state.candidates.filter(c => selectedCandidates.includes(c.id));
    
    // Format data for export
    const exportData = candidatesToExport.map(candidate => ({
      'Name': candidate.name,
      'Email': candidate.email,
      'Phone': candidate.phone,
      'Location': candidate.location,
      'Experience': candidate.experience,
      'Job Role': candidate.jobRole,
      'Relevance Score': candidate.relevanceScore,
      'Verdict': candidate.verdict,
      'Skills': candidate.skills.join(', '),
      'Applied Date': candidate.appliedDate
    }));

    if (format === 'pdf') {
      exportToPDF(exportData, `candidates_export_${new Date().toISOString().split('T')[0]}.pdf`);
    } else {
      exportToCSV(exportData, `candidates_export_${new Date().toISOString().split('T')[0]}.csv`);
    }
    
    toast({
      title: "Export completed",
      description: `${selectedCandidates.length} candidates exported as ${format.toUpperCase()}`,
    });
  };

  const handleViewResume = (candidateId: number) => {
    const candidate = state.candidates.find(c => c.id === candidateId);
    if (candidate) {
      // Create a simple resume view
      const resumeContent = `
        <html>
          <head>
            <style>
              body { font-family: Arial, sans-serif; margin: 40px; line-height: 1.6; }
              .header { text-align: center; border-bottom: 2px solid #2563eb; padding-bottom: 20px; margin-bottom: 30px; }
              .name { font-size: 28px; font-weight: bold; color: #2563eb; margin-bottom: 10px; }
              .contact { color: #666; margin-bottom: 5px; }
              .section { margin-bottom: 25px; }
              .section-title { font-size: 18px; font-weight: bold; color: #2563eb; margin-bottom: 10px; border-bottom: 1px solid #eee; padding-bottom: 5px; }
              .skills { display: flex; flex-wrap: wrap; gap: 8px; }
              .skill { background: #e3f2fd; color: #1976d2; padding: 4px 8px; border-radius: 4px; font-size: 12px; }
              .score { font-size: 24px; font-weight: bold; color: #4caf50; }
            </style>
          </head>
          <body>
            <div class="header">
              <div class="name">${candidate.name}</div>
              <div class="contact">${candidate.email}</div>
              <div class="contact">${candidate.phone}</div>
              <div class="contact">${candidate.location}</div>
            </div>
            
            <div class="section">
              <div class="section-title">Professional Summary</div>
              <p>Experienced ${candidate.jobRole} with ${candidate.experience} of professional experience. 
              Relevance Score: <span class="score">${candidate.relevanceScore}%</span> - ${candidate.verdict} Fit</p>
            </div>
            
            <div class="section">
              <div class="section-title">Technical Skills</div>
              <div class="skills">
                ${candidate.skills.map(skill => `<span class="skill">${skill}</span>`).join('')}
              </div>
            </div>
            
            <div class="section">
              <div class="section-title">Experience</div>
              <p><strong>Applied for:</strong> ${candidate.jobRole}</p>
              <p><strong>Experience Level:</strong> ${candidate.experience}</p>
              <p><strong>Application Date:</strong> ${candidate.appliedDate}</p>
            </div>
            
            ${candidate.missingSkills.length > 0 ? `
            <div class="section">
              <div class="section-title">Areas for Development</div>
              <div class="skills">
                ${candidate.missingSkills.map(skill => `<span class="skill" style="background: #ffebee; color: #d32f2f;">${skill}</span>`).join('')}
              </div>
            </div>
            ` : ''}
          </body>
        </html>
      `;
      
      const printWindow = window.open('', '_blank');
      if (printWindow) {
        printWindow.document.write(resumeContent);
        printWindow.document.close();
        printWindow.focus();
        setTimeout(() => {
          printWindow.print();
        }, 250);
      }
    }
  };

  const getVerdictColor = (verdict: string) => {
    switch (verdict) {
      case "High":
        return "bg-success text-success-foreground";
      case "Medium":
        return "bg-warning text-warning-foreground";
      case "Low":
        return "bg-destructive text-destructive-foreground";
      default:
        return "bg-muted";
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return "text-success";
    if (score >= 60) return "text-warning";
    return "text-destructive";
  };

  const uniqueRoles = Array.from(new Set(state.candidates.map(c => c.jobRole)));

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Candidates</h1>
          <p className="text-muted-foreground">
            Review and evaluate candidate applications
          </p>
        </div>
        <div className="flex gap-2">
          <Button 
            variant="outline"
            onClick={() => handleExportSelected("excel")}
            disabled={selectedCandidates.length === 0}
          >
            <Download className="mr-2 h-4 w-4" />
            Export Excel ({selectedCandidates.length})
          </Button>
          <Button 
            variant="outline"
            onClick={() => handleExportSelected("pdf")}
            disabled={selectedCandidates.length === 0}
          >
            <FileText className="mr-2 h-4 w-4" />
            Export PDF ({selectedCandidates.length})
          </Button>
        </div>
      </div>

      {/* Filters */}
      <Card className="shadow-card">
        <CardContent className="p-4">
          <div className="flex flex-col gap-4 md:flex-row md:items-center">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search candidates by name, email, role, or skills..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <div className="flex gap-2">
              <Select value={filterVerdict} onValueChange={setFilterVerdict}>
                <SelectTrigger className="w-32">
                  <SelectValue placeholder="Verdict" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Verdicts</SelectItem>
                  <SelectItem value="high">High</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="low">Low</SelectItem>
                </SelectContent>
              </Select>
              <Select value={filterRole} onValueChange={setFilterRole}>
                <SelectTrigger className="w-48">
                  <SelectValue placeholder="Job Role" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Roles</SelectItem>
                  {uniqueRoles.map((role) => (
                    <SelectItem key={role} value={role}>
                      {role}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="duplicates"
                  checked={showDuplicates}
                  onCheckedChange={(checked) => setShowDuplicates(checked === true)}
                />
                <label
                  htmlFor="duplicates"
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  Show Duplicates
                </label>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Candidates List */}
      <div className="space-y-4">
        {filteredCandidates.map((candidate) => (
          <Card key={candidate.id} className="shadow-card hover:shadow-elevated transition-shadow">
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-4">
                  <div className="flex items-center gap-2">
                    <Checkbox
                      checked={selectedCandidates.includes(candidate.id)}
                      onCheckedChange={() => handleSelectCandidate(candidate.id)}
                    />
                    <Avatar className="h-12 w-12">
                      <AvatarFallback className="bg-primary text-primary-foreground">
                        {candidate.name.split(" ").map(n => n[0]).join("")}
                      </AvatarFallback>
                    </Avatar>
                  </div>
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <CardTitle className="text-lg">{candidate.name}</CardTitle>
                      {candidate.isDuplicate && (
                        <Badge variant="outline" className="text-xs bg-warning-light text-warning">
                          Duplicate
                        </Badge>
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground">{candidate.email}</p>
                    <div className="flex items-center gap-4 text-xs text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <MapPin className="h-3 w-3" />
                        {candidate.location}
                      </span>
                      <span>{candidate.experience} experience</span>
                      <span className="flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        Applied {candidate.appliedDate}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="text-right">
                    <div className={`text-lg font-bold ${getScoreColor(candidate.relevanceScore)}`}>
                      {candidate.relevanceScore}%
                    </div>
                    <Badge className={`${getVerdictColor(candidate.verdict)} text-xs`}>
                      {candidate.verdict} Fit
                    </Badge>
                  </div>
                  <Button variant="ghost" size="sm">
                    <Star className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Job Role and Score */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium">Applied for:</span>
                  <Badge variant="outline">{candidate.jobRole}</Badge>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-sm text-muted-foreground">Relevance Score:</span>
                  <Progress value={candidate.relevanceScore} className="w-24" />
                </div>
              </div>

              {/* Skills */}
              <div className="space-y-2">
                <p className="text-sm font-medium">Matching Skills:</p>
                <div className="flex flex-wrap gap-1">
                  {candidate.skills.map((skill) => (
                    <Badge key={skill} variant="outline" className="text-xs bg-success-light text-success">
                      {skill}
                    </Badge>
                  ))}
                </div>
              </div>

              {/* Missing Skills */}
              {candidate.missingSkills.length > 0 && (
                <div className="space-y-2">
                  <p className="text-sm font-medium text-destructive">Missing Skills:</p>
                  <div className="flex flex-wrap gap-1">
                    {candidate.missingSkills.map((skill) => (
                      <Badge key={skill} variant="outline" className="text-xs bg-destructive-light text-destructive">
                        {skill}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}

              {/* Actions */}
              <div className="flex gap-2 pt-2">
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => handleViewResume(candidate.id)}
                >
                  <FileText className="mr-2 h-3 w-3" />
                  View Resume
                </Button>
                <Button 
                  size="sm" 
                  className="ml-auto"
                  onClick={() => handleShortlist(candidate.id)}
                  disabled={state.shortlistedCandidates.some(c => c.id === candidate.id)}
                >
                  {state.shortlistedCandidates.some(c => c.id === candidate.id) ? "Shortlisted" : "Shortlist"}
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredCandidates.length === 0 && (
        <Card className="shadow-card">
          <CardContent className="py-12 text-center">
            <User className="mx-auto h-12 w-12 text-muted-foreground" />
            <p className="mt-4 text-lg font-medium text-foreground">
              No candidates found
            </p>
            <p className="text-muted-foreground">
              Try adjusting your search or filter criteria
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}