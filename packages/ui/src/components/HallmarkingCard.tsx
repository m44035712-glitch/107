import React from 'react';
import { PurityFineness } from '@bis/shared-types';
import { Sparkles, ShieldCheck } from 'lucide-react';

interface HallmarkingCardProps {
  purity: PurityFineness;
  className?: string;
}

export const HallmarkingCard: React.FC<HallmarkingCardProps> = ({ purity, className = '' }) => {
  return (
    <div className={`p-5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-3 ${className}`}>
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-lg bg-amber-50 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400">
            <Sparkles className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100">
              {purity.karatDisplay} ({purity.finenessNumber} Fineness)
            </h3>
            <span className="text-xs text-slate-500 font-mono">Standard: {purity.officialStandard}</span>
          </div>
        </div>
        <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-100 text-amber-800 dark:bg-amber-900/60 dark:text-amber-200">
          {purity.metal}
        </span>
      </div>

      <p className="text-xs text-slate-600 dark:text-slate-300">
        {purity.description}
      </p>

      <div className="p-3 rounded-lg bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800 space-y-1.5 text-xs">
        <h4 className="font-semibold text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
          <ShieldCheck className="w-3.5 h-3.5 text-indigo-600" /> Mandatory Hallmarks on Article:
        </h4>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 pt-1">
          {purity.mandatoryMarkings.map((m, i) => (
            <div key={i} className="p-2 rounded bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-center">
              <span className="text-[11px] font-bold text-indigo-600 dark:text-indigo-400 block">{m.name}</span>
              <span className="text-[10px] text-slate-500">{m.description}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
