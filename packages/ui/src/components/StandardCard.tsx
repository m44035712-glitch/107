import React from 'react';
import { Standard } from '@bis/shared-types';
import { BookOpen, Award, CheckCircle, ExternalLink } from 'lucide-react';
import { SourceFreshnessBadge } from './SourceFreshnessBadge';

interface StandardCardProps {
  standard: Standard;
  onSelect?: (standard: Standard) => void;
  className?: string;
}

export const StandardCard: React.FC<StandardCardProps> = ({ standard, onSelect, className = '' }) => {
  return (
    <div
      onClick={() => onSelect && onSelect(standard)}
      className={`p-5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-md hover:border-indigo-300 dark:hover:border-indigo-700 transition-all cursor-pointer flex flex-col justify-between group ${className}`}
    >
      <div>
        <div className="flex items-start justify-between gap-3 mb-2">
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-md bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400">
              <BookOpen className="w-4 h-4" />
            </span>
            <h3 className="text-base font-bold text-slate-900 dark:text-slate-100 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
              {standard.standardNumber}
            </h3>
          </div>
          <SourceFreshnessBadge status={standard.status} year={standard.year} />
        </div>

        <h4 className="text-sm font-semibold text-slate-800 dark:text-slate-200 mb-2 line-clamp-1">
          {standard.title}
        </h4>

        <p className="text-xs text-slate-600 dark:text-slate-400 line-clamp-2 mb-3">
          {standard.scope || standard.abstract}
        </p>

        {/* Division & Mandatory Tag */}
        <div className="flex flex-wrap items-center gap-2 mb-3">
          <span className="text-[11px] font-medium px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
            {standard.division}
          </span>
          {standard.isMandatory ? (
            <span className="text-[11px] font-semibold px-2 py-0.5 rounded bg-amber-50 text-amber-700 border border-amber-200 dark:bg-amber-950/40 dark:text-amber-300 dark:border-amber-800 flex items-center gap-1">
              <Award className="w-3 h-3 text-amber-600" /> Mandatory QCO
            </span>
          ) : (
            <span className="text-[11px] font-normal px-2 py-0.5 rounded bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300 flex items-center gap-1">
              <CheckCircle className="w-3 h-3 text-emerald-600" /> Voluntary Scheme
            </span>
          )}
        </div>
      </div>

      <div className="pt-3 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between text-xs text-slate-500">
        <span>Published: {standard.publicationDate || standard.year}</span>
        <a
          href={standard.sourceUrl}
          target="_blank"
          rel="noopener noreferrer"
          onClick={e => e.stopPropagation()}
          className="inline-flex items-center gap-1 text-indigo-600 hover:text-indigo-700 font-medium"
        >
          <span>Official Portal</span>
          <ExternalLink className="w-3 h-3" />
        </a>
      </div>
    </div>
  );
};
