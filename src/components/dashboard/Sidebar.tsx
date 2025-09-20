import { useState } from "react";
import { NavLink, useLocation } from "react-router-dom";
import {
  FileText,
  Upload,
  Users,
  BarChart3,
  Settings,
  Menu,
  X,
  Building2,
  Download
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

const navigationItems = [
  { title: "Dashboard", url: "/", icon: BarChart3 },
  { title: "Job Requirements", url: "/jobs", icon: FileText },
  { title: "Resume Upload", url: "/upload", icon: Upload },
  { title: "Candidates", url: "/candidates", icon: Users },
  { title: "Shortlists", url: "/shortlists", icon: Download },
  { title: "Settings", url: "/settings", icon: Settings },
];

interface SidebarProps {
  className?: string;
}

export function Sidebar({ className }: SidebarProps) {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const location = useLocation();
  const currentPath = location.pathname;

  const isActive = (path: string) => {
    if (path === "/") {
      return currentPath === path;
    }
    return currentPath.startsWith(path);
  };

  return (
    <div
      className={cn(
        "flex h-screen flex-col border-r bg-card transition-all duration-300",
        isCollapsed ? "w-16" : "w-64",
        className
      )}
    >
      {/* Header */}
      <div className="flex h-16 items-center justify-between border-b px-4">
        {!isCollapsed && (
          <div className="flex items-center gap-2">
            <Building2 className="h-6 w-6 text-primary" />
            <span className="font-semibold text-foreground">
              Innomatics Labs
            </span>
          </div>
        )}
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="h-8 w-8 p-0"
        >
          {isCollapsed ? <Menu className="h-4 w-4" /> : <X className="h-4 w-4" />}
        </Button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 space-y-2 p-4">
        {navigationItems.map((item) => (
          <NavLink
            key={item.title}
            to={item.url}
            className={cn(
              "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
              isActive(item.url)
                ? "bg-primary text-primary-foreground"
                : "text-muted-foreground hover:bg-accent hover:text-accent-foreground",
              isCollapsed && "justify-center px-2"
            )}
          >
            <item.icon className={cn("h-4 w-4", isCollapsed ? "h-5 w-5" : "")} />
            {!isCollapsed && <span>{item.title}</span>}
          </NavLink>
        ))}
      </nav>

      {/* Footer */}
      <div className="border-t p-4">
        <div
          className={cn(
            "rounded-lg bg-primary-light p-3",
            isCollapsed && "p-2"
          )}
        >
          {!isCollapsed ? (
            <div className="text-center">
              <p className="text-xs font-medium text-primary">
                Resume Evaluation System
              </p>
              <p className="text-xs text-muted-foreground">v1.0.0</p>
            </div>
          ) : (
            <div className="flex justify-center">
              <BarChart3 className="h-4 w-4 text-primary" />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}