import React from 'react';
import { StandardStatus } from '@bis/shared-types';
import { Clock, CheckCircle2, AlertCircle, Archive } from 'lucide-react';

interface SourceFreshnessBadgeProps {
  status: StandardStatus;
  year?: number;
  lastUpdatedDate?: string;
  className?: string;
}

export const SourceFreshnessBadge: React.FC<SourceFreshnessBadgeProps> = ({
  status,
  year,
  lastUpdatedDate,
  className = ''
}) => {
  switch (status) {
    case StandardStatus.ACTIVE:
      return (
        <span
          className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-medium bg-blue-50 text-blue-700 border border-blue-200 dark:bg-blue-950/40 dark:text-blue-300 dark:border-blue-800 ${className}`}
        >
          <CheckCircle2 className="w-3 h-3 text-blue-600 dark:text-blue-400" />
          <span>Active Standard {year ? `(${year})` : ''}</span>
        </span>
      );
    case StandardStatus.UNDER_REVIEW:
      return (
        <span
          className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-medium bg-amber-50 text-amber-700 border border-amber-200 dark:bg-amber-950/40 dark:text-amber-300 dark:border-amber-800 ${className}`}
          title="This standard is currently under revision or review by the BIS Sectional Committee"
        >
          <Clock className="w-3 h-3 text-amber-600" />
          <span>Under Revision / Review</span>
        </span>
      );
    case StandardStatus.OUTDATED:
    case StandardStatus.WITHDRAWN:
      return (
        <span
          className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-medium bg-rose-50 text-rose-700 border border-rose-200 dark:bg-rose-950/40 dark:text-rose-300 dark:border-rose-800 ${className}`}
          title="Warning: This version has been superseded or withdrawn. Refer to the latest reaffirmation."
        >
          <AlertCircle className="w-3 h-3 text-rose-600" />
          <span>Superseded / Outdated</span>
        </span>
      );
    case StandardStatus.ARCHIVED:
      return (
        <span
          className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-medium bg-slate-100 text-slate-700 border border-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:border-slate-700 ${className}`}
        >
          <Archive className="w-3 h-3 text-slate-500" />
          <span>Archived Reference</span>
        </span>
      );
    default:
      return null;
  }
};
