import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AppProvider } from "@/contexts/AppContext";
import { JobProvider } from "@/contexts/JobContext";
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import Dashboard from "./pages/Dashboard";
import JobRequirements from "./pages/JobRequirements";
import Candidates from "./pages/Candidates";
import ResumeUpload from "./pages/ResumeUpload";
import Shortlists from "./pages/Shortlists";
import Settings from "./pages/Settings";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AppProvider>
      <JobProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<DashboardLayout />}>
                <Route index element={<Dashboard />} />
                <Route path="jobs" element={<JobRequirements />} />
                <Route path="candidates" element={<Candidates />} />
                <Route path="upload" element={<ResumeUpload />} />
                <Route path="shortlists" element={<Shortlists />} />
                <Route path="settings" element={<Settings />} />
              </Route>
              {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </TooltipProvider>
      </JobProvider>
    </AppProvider>
  </QueryClientProvider>
);

export default App;
