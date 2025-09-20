import { useState } from "react";
import { Download, Star, Users, FileText, Calendar, Filter, X } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/components/ui/use-toast";
import { useApp } from "@/contexts/AppContext";
import { exportToPDF, exportToCSV } from "@/lib/pdfExport";

export default function Shortlists() {
  const { state, dispatch } = useApp();
  const [selectedFilter, setSelectedFilter] = useState("all");
  const { toast } = useToast();

  const handleRemoveFromShortlist = (candidateId: number) => {
    dispatch({ type: 'REMOVE_FROM_SHORTLIST', payload: candidateId });
    toast({
      title: "Candidate removed",
      description: "Candidate has been removed from shortlist and added back to candidates list",
    });
  };

  const handleExport = (format: "excel" | "pdf") => {
    if (state.shortlistedCandidates.length === 0) {
      toast({
        title: "No candidates to export",
        description: "Please shortlist some candidates first",
        variant: "destructive",
      });
      return;
    }

    // Format data for export
    const exportData = state.shortlistedCandidates.map(candidate => ({
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
      exportToPDF(exportData, `shortlisted_candidates_${new Date().toISOString().split('T')[0]}.pdf`);
    } else {
      exportToCSV(exportData, `shortlisted_candidates_${new Date().toISOString().split('T')[0]}.csv`);
    }

    toast({
      title: "Export completed",
      description: `Shortlisted candidates exported as ${format.toUpperCase()}`,
    });
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

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Shortlists</h1>
          <p className="text-muted-foreground">
            Manage and export candidate shortlists for job requirements
          </p>
        </div>
        <div className="flex gap-2">
          <Select value={selectedFilter} onValueChange={setSelectedFilter}>
            <SelectTrigger className="w-32">
              <SelectValue placeholder="Filter" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="draft">Draft</SelectItem>
              <SelectItem value="shared">Shared</SelectItem>
              <SelectItem value="closed">Closed</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Export Actions */}
      {state.shortlistedCandidates.length > 0 && (
        <Card className="shadow-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-3">
              <Users className="h-5 w-5" />
              Shortlisted Candidates ({state.shortlistedCandidates.length})
            </CardTitle>
            <CardDescription>
              Manage and export your shortlisted candidates
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleExport("excel")}
              >
                <Download className="mr-2 h-3 w-3" />
                Export Excel
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleExport("pdf")}
              >
                <FileText className="mr-2 h-3 w-3" />
                Export PDF
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Shortlisted Candidates */}
      <div className="space-y-4">
        {state.shortlistedCandidates.map((candidate) => (
          <Card key={candidate.id} className="shadow-card">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <Avatar className="h-12 w-12">
                    <AvatarFallback className="bg-primary text-primary-foreground">
                      {candidate.name.split(" ").map(n => n[0]).join("")}
                    </AvatarFallback>
                  </Avatar>
                  <div className="space-y-1">
                    <p className="text-lg font-medium text-foreground">{candidate.name}</p>
                    <p className="text-sm text-muted-foreground">{candidate.email}</p>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <span>{candidate.jobRole}</span>
                      <span className="flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        Applied {candidate.appliedDate}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium text-success">
                        {candidate.relevanceScore}% Match
                      </span>
                      <Badge className={`text-xs ${getVerdictColor(candidate.verdict)}`}>
                        {candidate.verdict} Fit
                      </Badge>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Button variant="ghost" size="sm">
                    <Star className="h-4 w-4" />
                  </Button>
                  <Button variant="outline" size="sm">
                    View Profile
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => handleRemoveFromShortlist(candidate.id)}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              </div>
              
              {/* Skills */}
              <div className="mt-4 space-y-2">
                <p className="text-sm font-medium">Skills:</p>
                <div className="flex flex-wrap gap-1">
                  {candidate.skills.map((skill) => (
                    <Badge key={skill} variant="outline" className="text-xs bg-success-light text-success">
                      {skill}
                    </Badge>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {state.shortlistedCandidates.length === 0 && (
        <Card className="shadow-card">
          <CardContent className="py-12 text-center">
            <FileText className="mx-auto h-12 w-12 text-muted-foreground" />
            <p className="mt-4 text-lg font-medium text-foreground">
              No shortlisted candidates
            </p>
            <p className="text-muted-foreground">
              Shortlist candidates from the candidates page to see them here
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}