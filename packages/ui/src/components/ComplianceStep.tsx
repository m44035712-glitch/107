import React from 'react';
import { ComplianceRoadmapStep } from '@bis/shared-types';
import { CheckCircle2, Clock, CircleDot, FileCheck, ArrowRight, AlertTriangle } from 'lucide-react';

interface ComplianceStepProps {
  step: ComplianceRoadmapStep;
  isCurrent?: boolean;
  onSelect?: (step: ComplianceRoadmapStep) => void;
  className?: string;
}

export const ComplianceStep: React.FC<ComplianceStepProps> = ({
  step,
  isCurrent = false,
  onSelect,
  className = ''
}) => {
  const getStatusIcon = () => {
    switch (step.status) {
      case 'COMPLETED':
        return <CheckCircle2 className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />;
      case 'IN_PROGRESS':
        return <CircleDot className="w-5 h-5 text-[#0077B6] dark:text-[#48CAE4] animate-pulse" />;
      default:
        return <Clock className="w-5 h-5 text-slate-400" />;
    }
  };

  return (
    <div
      onClick={() => onSelect && onSelect(step)}
      className={`relative p-5 rounded-xl border transition-all ${
        isCurrent
          ? 'bg-[#CAF0F8] dark:bg-[#0077B6]/25 border-2 border-[#48CAE4] dark:border-[#48CAE4] shadow-lg shadow-[#48CAE4]/20 ring-2 ring-[#48CAE4]/60'
          : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 shadow-sm hover:border-slate-300'
      } ${className}`}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-start gap-3">
          <div className="mt-0.5">{getStatusIcon()}</div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-[#0077B6] dark:text-[#48CAE4] uppercase tracking-wider">
                Step {step.stepNumber}: {step.phaseName}
              </span>
              <span className="text-[10px] px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400">
                Est. {step.estimatedTimeframe}
              </span>
            </div>
            <h3 className="text-base font-bold text-slate-900 dark:text-slate-100 mt-0.5">
              {step.title}
            </h3>
          </div>
        </div>

        <span className="text-xs font-semibold px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
          {step.category}
        </span>
      </div>

      <p className="text-xs text-slate-600 dark:text-slate-300 mt-2.5 leading-relaxed">
        {step.description}
      </p>

      {/* Action items */}
      {step.actionItems && step.actionItems.length > 0 && (
        <div className={`mt-3 p-3 rounded-lg border text-xs ${
          isCurrent
            ? 'bg-white/80 dark:bg-slate-900/60 border-[#ADE8F4] dark:border-[#0077B6]/40'
            : 'bg-slate-50 dark:bg-slate-800/40 border-slate-100 dark:border-slate-800'
        }`}>
          <h4 className="font-semibold text-slate-800 dark:text-slate-200 mb-1.5 flex items-center gap-1.5">
            <FileCheck className="w-3.5 h-3.5 text-[#0077B6] dark:text-[#48CAE4]" /> Key Action Items:
          </h4>
          <ul className="space-y-1 text-slate-600 dark:text-slate-400">
            {step.actionItems.map((action, i) => (
              <li key={i} className="flex items-start gap-1.5">
                <span className="text-[#0077B6] dark:text-[#48CAE4] font-bold">•</span>
                <span>{action}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Required Documents */}
      {step.requiredDocuments && step.requiredDocuments.length > 0 && (
        <div className="mt-2.5 flex flex-wrap items-center gap-1.5 text-[11px] text-slate-500">
          <span className="font-semibold text-slate-700 dark:text-slate-300">Required Docs:</span>
          {step.requiredDocuments.map((doc, idx) => (
            <span key={idx} className="px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
              {doc}
            </span>
          ))}
        </div>
      )}
    </div>
  );
};
