import React from 'react';
import { Loader2 } from 'lucide-react';
import { AshokaMotif } from './AshokaMotif';

interface LoadingStateProps {
  message?: string;
  submessage?: string;
  className?: string;
}

export const LoadingState: React.FC<LoadingStateProps> = ({
  message = 'Retrieving Authoritative BIS Data...',
  submessage = 'Checking Gazette notifications, standards repository, and clause schedules...',
  className = ''
}) => {
  return (
    <div className={`flex flex-col items-center justify-center p-8 text-center space-y-3 ${className}`}>
      <div className="relative">
        <AshokaMotif size={44} className="text-indigo-600/30 animate-spin" />
        <Loader2 className="w-5 h-5 text-indigo-600 animate-spin absolute inset-0 m-auto" />
      </div>
      <div>
        <h4 className="text-sm font-bold text-slate-800 dark:text-slate-200">{message}</h4>
        {submessage && <p className="text-xs text-slate-500 mt-0.5 max-w-xs">{submessage}</p>}
      </div>
    </div>
  );
};
