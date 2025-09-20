import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { loadCandidatesFromCSV } from '@/lib/csvLoader';

interface Candidate {
  id: number;
  name: string;
  email: string;
  phone: string;
  location: string;
  experience: string;
  jobRole: string;
  relevanceScore: number;
  verdict: "High" | "Medium" | "Low";
  skills: string[];
  appliedDate: string;
  resumeUrl?: string;
  isDuplicate: boolean;
  missingSkills: string[];
  isShortlisted?: boolean;
}

interface AppState {
  candidates: Candidate[];
  shortlistedCandidates: Candidate[];
  uploadedResumes: Candidate[];
}

type AppAction = 
  | { type: 'SHORTLIST_CANDIDATE'; payload: number }
  | { type: 'REMOVE_FROM_SHORTLIST'; payload: number }
  | { type: 'ADD_UPLOADED_CANDIDATE'; payload: Candidate }
  | { type: 'LOAD_DATA' }
  | { type: 'LOAD_CSV_DATA'; payload: Candidate[] };

const initialState: AppState = {
  candidates: [],
  shortlistedCandidates: [],
  uploadedResumes: [],
};

function appReducer(state: AppState, action: AppAction): AppState {
  switch (action.type) {
    case 'SHORTLIST_CANDIDATE': {
      const candidate = state.candidates.find(c => c.id === action.payload);
      if (!candidate) return state;
      
      const updatedCandidates = state.candidates.filter(c => c.id !== action.payload);
      const shortlistedCandidate = { ...candidate, isShortlisted: true };
      
      return {
        ...state,
        candidates: updatedCandidates,
        shortlistedCandidates: [...state.shortlistedCandidates, shortlistedCandidate],
      };
    }
    case 'REMOVE_FROM_SHORTLIST': {
      const candidate = state.shortlistedCandidates.find(c => c.id === action.payload);
      if (!candidate) return state;
      
      const updatedShortlisted = state.shortlistedCandidates.filter(c => c.id !== action.payload);
      const { isShortlisted, ...candidateWithoutShortlistFlag } = candidate;
      
      return {
        ...state,
        shortlistedCandidates: updatedShortlisted,
        candidates: [...state.candidates, candidateWithoutShortlistFlag],
      };
    }
    case 'ADD_UPLOADED_CANDIDATE': {
      return {
        ...state,
        candidates: [...state.candidates, action.payload],
        uploadedResumes: [...state.uploadedResumes, action.payload],
      };
    }
    case 'LOAD_DATA': {
      const savedData = localStorage.getItem('skill-scout-data');
      if (savedData) {
        return JSON.parse(savedData);
      }
      return state;
    }
    case 'LOAD_CSV_DATA': {
      return {
        ...state,
        candidates: action.payload,
      };
    }
    default:
      return state;
  }
}

const AppContext = createContext<{
  state: AppState;
  dispatch: React.Dispatch<AppAction>;
} | null>(null);

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(appReducer, initialState);
  const [isLoading, setIsLoading] = React.useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        // Load from localStorage first
        const savedData = localStorage.getItem('skill-scout-data');
        if (savedData) {
          const parsedData = JSON.parse(savedData);
          dispatch({ type: 'LOAD_DATA' });
        } else {
          // Load from CSV if no saved data
          const csvCandidates = await loadCandidatesFromCSV();
          if (csvCandidates.length > 0) {
            dispatch({ type: 'LOAD_CSV_DATA', payload: csvCandidates });
          }
        }
      } catch (error) {
        console.error('Error loading data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, []);

  useEffect(() => {
    if (!isLoading) {
      localStorage.setItem('skill-scout-data', JSON.stringify(state));
    }
  }, [state, isLoading]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-muted-foreground">Loading candidates data...</p>
        </div>
      </div>
    );
  }

  return (
    <AppContext.Provider value={{ state, dispatch }}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
}
