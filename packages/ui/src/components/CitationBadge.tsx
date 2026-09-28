import React from 'react';
import { Citation } from '@bis/shared-types';

interface CitationBadgeProps {
  citation: Citation;
  onClick?: (citation: Citation) => void;
  className?: string;
}

export const CitationBadge: React.FC<CitationBadgeProps> = ({ citation, onClick, className = '' }) => {
  return (
    <button
      type="button"
      onClick={() => onClick && onClick(citation)}
      className={`inline-flex items-center gap-1 px-1.5 py-0.5 mx-0.5 rounded text-xs font-semibold bg-indigo-50 text-indigo-700 border border-indigo-200 hover:bg-indigo-100 hover:border-indigo-300 dark:bg-indigo-950/60 dark:text-indigo-300 dark:border-indigo-800 transition-colors cursor-pointer ${className}`}
      title={`[${citation.citationNumber}] ${citation.standardNumber} ${citation.clause ? `Clause ${citation.clause}` : ''} (Page ${citation.page || 'N/A'})`}
      aria-label={`View evidence source for ${citation.standardNumber}`}
    >
      <span className="text-[10px] font-bold text-indigo-500 dark:text-indigo-400">[{citation.citationNumber}]</span>
      <span>{citation.standardNumber}</span>
      {citation.clause && <span className="opacity-80 font-normal">Cl. {citation.clause}</span>}
    </button>
  );
};
