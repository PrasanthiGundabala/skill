import React from 'react';

interface ProfessionalLogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

export const ProfessionalLogo: React.FC<ProfessionalLogoProps> = ({ 
  className = '', 
  size = 'md' 
}) => {
  const sizeClasses = {
    sm: 'h-6 w-6',
    md: 'h-8 w-8',
    lg: 'h-12 w-12'
  };

  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <div className={`${sizeClasses[size]} bg-primary rounded-lg flex items-center justify-center`}>
        <svg 
          className="h-3/4 w-3/4 text-white" 
          viewBox="0 0 24 24" 
          fill="none" 
          xmlns="http://www.w3.org/2000/svg"
        >
          <path 
            d="M12 2L13.09 8.26L20 9L13.09 9.74L12 16L10.91 9.74L4 9L10.91 8.26L12 2Z" 
            fill="currentColor"
          />
          <path 
            d="M8 12H16M12 8V16" 
            stroke="currentColor" 
            strokeWidth="2" 
            strokeLinecap="round"
          />
        </svg>
      </div>
      <div className="flex flex-col">
        <span className="font-bold text-foreground">Resume Evaluation</span>
        <span className="text-xs text-muted-foreground">Innomatics Research Labs</span>
      </div>
    </div>
  );
};
