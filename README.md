# Resume Evaluation System - Innomatics Research Labs

## Overview

An AI-powered resume evaluation and candidate matching system designed for Innomatics Research Labs. This system automates the resume screening process, providing relevance scoring, candidate ranking, and intelligent matching between job requirements and candidate profiles.

## Features

### ✨ **Core Functionality**
- **Automated Resume Evaluation** - AI-powered scoring system (0-100 scale)
- **Job Requirement Management** - Upload and manage job descriptions with skill matching
- **Candidate Ranking** - Automatic sorting by relevance score and fit assessment
- **Duplicate Detection** - Identify similar/duplicate resume submissions
- **Batch Processing** - Handle thousands of applications efficiently
- **Export Capabilities** - Generate shortlists in Excel, CSV, and PDF formats

### 🎯 **Smart Matching System**
- **Hard Match** - Keyword and skill-based evaluation
- **Semantic Match** - AI-powered contextual understanding
- **Verdict System** - High/Medium/Low fit classifications
- **Gap Analysis** - Identify missing skills and qualifications
- **Personalized Feedback** - Improvement suggestions for candidates

### 📊 **Professional Dashboard**
- **Real-time Analytics** - Track processing status and metrics
- **Advanced Filtering** - Search by skills, location, experience, verdict
- **Candidate Profiles** - Comprehensive view of applications and evaluations
- **Job Management** - Multi-location support (Hyderabad, Bangalore, Pune, Delhi NCR)

## Tech Stack

**Frontend Framework:**
- **React 18** with TypeScript for type safety
- **Tailwind CSS** with custom design system
- **Vite** for fast development and building
- **React Router** for navigation
- **React Query** for state management

**UI Components:**
- **Radix UI** primitives for accessibility
- **Shadcn/UI** component library with custom variants
- **Lucide React** for consistent iconography
- **Professional animations** and transitions

**Design System:**
- **Corporate Blue Theme** (#2563EB primary)
- **HSL Color Variables** for consistent theming
- **Inter Font Family** for professional typography
- **Responsive Grid Layout** with mobile optimization

## Project Structure

```
src/
├── components/
│   ├── dashboard/          # Layout and navigation components
│   ├── forms/             # Form components for data input
│   └── ui/                # Reusable UI components (shadcn)
├── pages/
│   ├── Dashboard.tsx      # Main analytics dashboard
│   ├── JobRequirements.tsx # Job posting management
│   ├── Candidates.tsx     # Candidate evaluation interface
│   └── NotFound.tsx       # 404 error page
├── lib/
│   └── utils.ts           # Utility functions
└── hooks/                 # Custom React hooks
```

## Getting Started

### Prerequisites
- Node.js 16+ and npm
- Modern web browser

### Installation

```bash
# Clone the repository
git clone <YOUR_GIT_URL>
cd <YOUR_PROJECT_NAME>

# Install dependencies
npm install

# Start development server
npm run dev
```

### Development
- Visit `http://localhost:8080` to view the application
- Hot reloading enabled for instant development feedback
- TypeScript type checking and ESLint for code quality

## Deployment

```bash
# Build for production
npm run build

# Preview production build
npm run preview
```

## Contributing

1. Follow the established design system patterns
2. Use semantic color tokens instead of hardcoded colors
3. Maintain TypeScript strict mode compliance
4. Test responsive layouts across devices
5. Follow accessibility best practices

## System Requirements

**Supported Locations:**
- Hyderabad
- Bangalore  
- Pune
- Delhi NCR

**File Support:**
- Resume formats: PDF, DOCX
- Job descriptions: PDF, DOCX, TXT
- Export formats: Excel, CSV, PDF

---

**Built for Innomatics Research Labs**
