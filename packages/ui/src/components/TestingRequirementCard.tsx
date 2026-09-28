import React from 'react';
import { TestingRequirement } from '@bis/shared-types';
import { FlaskConical, AlertCircle, CheckCircle2 } from 'lucide-react';

interface TestingRequirementCardProps {
  test: TestingRequirement;
  className?: string;
}

export const TestingRequirementCard: React.FC<TestingRequirementCardProps> = ({ test, className = '' }) => {
  return (
    <div className={`p-5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-3.5 ${className}`}>
      {/* Header */}
      <div className="flex items-start justify-between gap-2">
        <div className="flex items-start gap-2.5">
          <div className="p-2 rounded-lg bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 mt-0.5">
            <FlaskConical className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">
              {test.testName}
            </h3>
            <span className="text-xs font-mono text-indigo-600 dark:text-indigo-400">
              {test.standardNumber} — Clause {test.clauseNumber}
            </span>
          </div>
        </div>

        <div className="flex flex-col items-end gap-1">
          {test.isMandatoryRoutineTest ? (
            <span className="text-[11px] font-semibold px-2 py-0.5 rounded bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300">
              Mandatory Routine Test
            </span>
          ) : (
            <span className="text-[11px] font-medium px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
              Type / Approval Test
            </span>
          )}
          {test.isDestructive && (
            <span className="text-[10px] text-amber-600 font-medium">Destructive Testing</span>
          )}
        </div>
      </div>

      <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
        {test.description}
      </p>

      {/* Criteria & Sampling */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5 text-xs">
        <div className="p-3 rounded-lg bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800">
          <span className="font-semibold text-slate-800 dark:text-slate-200 flex items-center gap-1.5 mb-1">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> Acceptance Criteria:
          </span>
          <p className="text-slate-600 dark:text-slate-400">{test.acceptanceCriteria}</p>
        </div>

        <div className="p-3 rounded-lg bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800">
          <span className="font-semibold text-slate-800 dark:text-slate-200 flex items-center gap-1.5 mb-1">
            <AlertCircle className="w-3.5 h-3.5 text-indigo-600" /> Sampling & Frequency:
          </span>
          <p className="text-slate-600 dark:text-slate-400">
            {test.samplingRequirements} ({test.testingFrequency})
          </p>
        </div>
      </div>

      {/* Required Equipment */}
      {test.requiredEquipment.length > 0 && (
        <div className="pt-2 border-t border-slate-100 dark:border-slate-800 text-xs text-slate-500">
          <span className="font-semibold text-slate-700 dark:text-slate-300">Key Test Equipment: </span>
          <span>{test.requiredEquipment.join(', ')}</span>
        </div>
      )}
    </div>
  );
};
