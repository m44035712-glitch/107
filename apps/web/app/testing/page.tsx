'use client';

import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { TestingRequirement } from '@bis/shared-types';
import { apiClient } from '@bis/api-client';
import { TestingRequirementCard, LoadingState, EmptyState } from '@bis/ui';
import { FlaskConical, Search, Filter, ShieldCheck, CheckCircle2 } from 'lucide-react';
import { useTranslation } from "@/lib/i18n";

function TestingRequirementsContent() {
  const { t } = useTranslation();
  const searchParams = useSearchParams();
  const stdParam = searchParams.get('std') || '';

  const [filterStd, setFilterStd] = useState(stdParam);
  const [filterName, setFilterName] = useState('');
  const [requirements, setRequirements] = useState<TestingRequirement[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const fetchRequirements = async () => {
    setIsLoading(true);
    try {
      const data = await apiClient.getTestingRequirements({
        standardNumber: filterStd || undefined,
        testName: filterName || undefined
      });
      setRequirements(data);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (stdParam) fetchRequirements();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="relative min-h-screen w-full bg-gradient-to-b from-[#03045E] via-[#023E8A] to-[#03045E] dark:from-slate-950 dark:via-[#03045E]/90 dark:to-slate-950 overflow-hidden text-white">
      {/* Ambient Glowing Blobs */}
      <div className="absolute top-12 left-1/2 -translate-x-1/2 w-[700px] h-[350px] bg-[#48CAE4]/15 rounded-full blur-3xl pointer-events-none animate-pulse" />
      <div className="absolute top-0 right-10 w-80 h-80 bg-[#0077B6]/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-10 w-80 h-80 bg-[#48CAE4]/15 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10 space-y-8 relative z-10">
        {/* Header in Dark Scheme */}
        <div className="space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 dark:bg-white/10 text-[#CAF0F8] text-xs font-semibold border border-[#48CAE4]/30 backdrop-blur-md shadow-2xs">
            <FlaskConical className="w-3.5 h-3.5 text-[#48CAE4]" />
            <span>{t("testing.badge", "Statutory Testing Schedules")}</span>
          </div>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight">
            {t("testing.title", "Indian Standards Testing Requirements")}
          </h1>
          <p className="text-sm sm:text-base text-[#ADE8F4]/90 max-w-2xl leading-relaxed">
            {t("testing.subtitle", "Inspect mandatory routine batch tests, acceptance criteria, sampling rules, and required testing equipment cited directly from Indian Standards.")}
          </p>
        </div>

        {/* Filter Bar */}
        <div className="bg-white/95 dark:bg-slate-900/95 backdrop-blur-md p-5 rounded-2xl border border-white/20 dark:border-slate-800 shadow-xl shadow-[#03045E]/30 flex flex-col sm:flex-row items-center gap-3">
          <div className="relative flex-1 w-full">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
            <input
              type="text"
              value={filterStd}
              onChange={e => setFilterStd(e.target.value)}
              onKeyDown={e => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  fetchRequirements();
                }
              }}
              placeholder={t("testing.filter_placeholder", "Filter by Standard Number (e.g. IS 17526, IS 10500, IS 1786)...")}
              className="w-full pl-10 pr-3.5 py-2.5 text-xs sm:text-sm rounded-xl border border-slate-300 dark:border-slate-700 bg-white/50 dark:bg-slate-800/50 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-[#0077B6] focus:border-[#023E8A]"
            />
          </div>
          <button
            type="button"
            onClick={fetchRequirements}
            className="w-full sm:w-auto px-6 py-2.5 text-xs sm:text-sm font-bold bg-gradient-to-r from-[#023E8A] via-[#0077B6] to-[#0077B6] hover:from-[#03045E] hover:to-[#023E8A] text-white rounded-xl shadow-md shadow-[#0077B6]/20 transition-all shrink-0 cursor-pointer"
          >
            {t("testing.btn_filter", "Filter Tests")}
          </button>
        </div>

      {/* Testing Cards Grid */}
      {isLoading ? (
        <LoadingState
          message={t("testing.loading_msg", "Retrieving Testing Clauses & Acceptance Parameters...")}
          submessage={t("testing.loading_sub", "Cross-referencing laboratory test methods and sampling frequencies...")}
        />
      ) : requirements.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {requirements.map((test, idx) => (
            <TestingRequirementCard key={test.id || idx} test={test} />
          ))}
        </div>
      ) : (
        <EmptyState
          title={t("testing.empty_title", "No Testing Requirements Found")}
          description={t("testing.empty_desc", "Try searching with a standard number like 'IS 17526', 'IS 10500', or 'IS 1786'.")}
          icon={FlaskConical}
          actionLabel={t("testing.btn_showall", "Show All Tests")}
          onAction={() => {
            setFilterStd('');
            setFilterName('');
          }}
        />
      )}
      </div>
    </div>
  );
}

export default function TestingRequirementsPage() {
  return (
    <React.Suspense fallback={<div className="p-8 text-center text-xs text-slate-500">Loading Testing Requirements...</div>}>
      <TestingRequirementsContent />
    </React.Suspense>
  );
}

