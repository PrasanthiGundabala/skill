import React, { createContext, useContext, useReducer, useEffect } from 'react';

interface Job {
  id: number;
  title: string;
  company: string;
  location: string;
  applications: number;
  datePosted: string;
  status: "active" | "completed" | "draft";
  skills: string[];
  description?: string;
  requirements?: string;
  fileUrl?: string;
}

interface JobState {
  jobs: Job[];
}

type JobAction = 
  | { type: 'ADD_JOB'; payload: Job }
  | { type: 'UPDATE_JOB'; payload: Job }
  | { type: 'DELETE_JOB'; payload: number }
  | { type: 'LOAD_JOBS' };

const initialState: JobState = {
  jobs: [
    {
      id: 1,
      title: "Senior Software Engineer",
      company: "TechCorp Solutions",
      location: "Bangalore",
      applications: 124,
      datePosted: "2024-03-15",
      status: "active",
      skills: ["React", "Node.js", "Python", "AWS"],
    },
    {
      id: 2,
      title: "Data Analyst",
      company: "Analytics Pro",
      location: "Hyderabad",
      applications: 89,
      datePosted: "2024-03-14",
      status: "completed",
      skills: ["Python", "SQL", "Tableau", "Statistics"],
    },
    {
      id: 3,
      title: "Frontend Developer",
      company: "WebDev Inc",
      location: "Pune",
      applications: 156,
      datePosted: "2024-03-13",
      status: "active",
      skills: ["JavaScript", "React", "CSS", "TypeScript"],
    },
    {
      id: 4,
      title: "DevOps Engineer",
      company: "CloudTech",
      location: "Delhi NCR",
      applications: 67,
      datePosted: "2024-03-12",
      status: "active",
      skills: ["Docker", "Kubernetes", "AWS", "Jenkins"],
    },
  ],
};

function jobReducer(state: JobState, action: JobAction): JobState {
  switch (action.type) {
    case 'ADD_JOB': {
      return {
        ...state,
        jobs: [...state.jobs, action.payload],
      };
    }
    case 'UPDATE_JOB': {
      return {
        ...state,
        jobs: state.jobs.map(job => 
          job.id === action.payload.id ? action.payload : job
        ),
      };
    }
    case 'DELETE_JOB': {
      return {
        ...state,
        jobs: state.jobs.filter(job => job.id !== action.payload),
      };
    }
    case 'LOAD_JOBS': {
      const savedJobs = localStorage.getItem('skill-scout-jobs');
      if (savedJobs) {
        return {
          ...state,
          jobs: JSON.parse(savedJobs),
        };
      }
      return state;
    }
    default:
      return state;
  }
}

const JobContext = createContext<{
  state: JobState;
  dispatch: React.Dispatch<JobAction>;
} | null>(null);

export function JobProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(jobReducer, initialState);

  useEffect(() => {
    dispatch({ type: 'LOAD_JOBS' });
  }, []);

  useEffect(() => {
    localStorage.setItem('skill-scout-jobs', JSON.stringify(state.jobs));
  }, [state.jobs]);

  return (
    <JobContext.Provider value={{ state, dispatch }}>
      {children}
    </JobContext.Provider>
  );
}

export function useJobs() {
  const context = useContext(JobContext);
  if (!context) {
    throw new Error('useJobs must be used within a JobProvider');
  }
  return context;
}
