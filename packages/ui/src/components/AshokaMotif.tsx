import React from 'react';

interface AshokaMotifProps {
  className?: string;
  size?: number;
}

export const AshokaMotif: React.FC<AshokaMotifProps> = ({ className = 'text-primary/20', size = 32 }) => {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 100 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-label="Ashoka Chakra inspired motif"
    >
      <circle cx="50" cy="50" r="46" stroke="currentColor" strokeWidth="3" />
      <circle cx="50" cy="50" r="41" stroke="currentColor" strokeWidth="1" strokeDasharray="2 2" />
      <circle cx="50" cy="50" r="10" stroke="currentColor" strokeWidth="2" fill="currentColor" fillOpacity="0.15" />
      <circle cx="50" cy="50" r="4" fill="currentColor" />
      {/* 24 spokes */}
      {Array.from({ length: 24 }).map((_, i) => {
        const angle = (i * 360) / 24;
        const rad = (angle * Math.PI) / 180;
        const x1 = 50 + 10 * Math.cos(rad);
        const y1 = 50 + 10 * Math.sin(rad);
        const x2 = 50 + 45 * Math.cos(rad);
        const y2 = 50 + 45 * Math.sin(rad);
        return (
          <line
            key={i}
            x1={x1}
            y1={y1}
            x2={x2}
            y2={y2}
            stroke="currentColor"
            strokeWidth="1.5"
          />
        );
      })}
    </svg>
  );
};
