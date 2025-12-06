import React from 'react';

export const Logo: React.FC<{ className?: string }> = ({ className = "" }) => {
  return (
    <svg 
      width="64" 
      height="64" 
      viewBox="0 0 24 24" 
      fill="none" 
      xmlns="http://www.w3.org/2000/svg" 
      className={className}
    >
      <defs>
        <linearGradient id="logoGrad" x1="2" y1="2" x2="22" y2="22" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#A76BFF" />
          <stop offset="50%" stopColor="#FF4BC8" />
          <stop offset="100%" stopColor="#46C6FF" />
        </linearGradient>
      </defs>
      
      {/* Finder Pattern: Top Left */}
      <rect x="3" y="3" width="6" height="6" rx="1.5" stroke="url(#logoGrad)" strokeWidth="2" />
      <rect x="5.5" y="5.5" width="1" height="1" rx="0.5" fill="url(#logoGrad)" />

      {/* Finder Pattern: Top Right */}
      <rect x="15" y="3" width="6" height="6" rx="1.5" stroke="url(#logoGrad)" strokeWidth="2" />
      <rect x="17.5" y="5.5" width="1" height="1" rx="0.5" fill="url(#logoGrad)" />

      {/* Finder Pattern: Bottom Left */}
      <rect x="3" y="15" width="6" height="6" rx="1.5" stroke="url(#logoGrad)" strokeWidth="2" />
      <rect x="5.5" y="17.5" width="1" height="1" rx="0.5" fill="url(#logoGrad)" />

      {/* Heart Shape (Center) */}
      <path 
        d="M12 10.5C11.2 9.8 10 9.8 9.3 10.5C8.6 11.2 8.6 12.3 9.3 13L12 15.7L14.7 13C15.4 12.3 15.4 11.2 14.7 10.5C14 9.8 12.8 9.8 12 10.5Z" 
        fill="url(#logoGrad)" 
        stroke="url(#logoGrad)" 
        strokeWidth="0.5"
      />

      {/* Data Bits (Bottom Right) */}
      <circle cx="16" cy="16" r="1" fill="url(#logoGrad)" />
      <circle cx="19" cy="16" r="1" fill="url(#logoGrad)" />
      <circle cx="16" cy="19" r="1" fill="url(#logoGrad)" />
      <circle cx="19" cy="19" r="1" fill="url(#logoGrad)" />
      <circle cx="12" cy="5" r="1" fill="url(#logoGrad)" opacity="0.5" />
      <circle cx="5" cy="12" r="1" fill="url(#logoGrad)" opacity="0.5" />
    </svg>
  );
};
