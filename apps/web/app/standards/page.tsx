'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Standard } from '@bis/shared-types';
import { apiClient } from '@bis/api-client';
import { StandardCard, LoadingState, EmptyState } from '@bis/ui';
import { Search, Filter, BookOpen, Award, CheckCircle } from 'lucide-react';
import { useTranslation } from "@/lib/i18n";

export default function StandardsCatalogPage() {
  const router = useRouter();
  const { t } = useTranslation();
  const [query, setQuery] = useState('');
  const [selectedDivision, setSelectedDivision] = useState<string>('');
  const [mandatoryOnly, setMandatoryOnly] = useState<boolean>(false);
  const [standards, setStandards] = useState<Standard[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const divisions = [
    t('standards.filter_all', 'All Divisions'),
    t('standards.div_mech', 'Mechanical Engineering'),
    t('standards.div_civil', 'Civil Engineering'),
    t('standards.div_electro', 'Electrotechnical'),
    t('standards.div_met', 'Metallurgical Engineering'),
    t('standards.div_food', 'Food and Agriculture')
  ];

  const fetchStandards = async () => {
    setIsLoading(true);
    try {
      const res = await apiClient.searchStandards(query, {
        division: selectedDivision === t('standards.filter_all', 'All Divisions') ? undefined : selectedDivision,
        isMandatory: mandatoryOnly ? true : undefined
      });
      setStandards(res.standards);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchStandards();
  }, [selectedDivision, mandatoryOnly]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    fetchStandards();
  };

  const handleSelectStandard = (standard: Standard) => {
    router.push(`/certification?std=${encodeURIComponent(standard.standardNumber)}&product=${encodeURIComponent(standard.title)}`);
  };

  return (
    <div className="relative min-h-screen w-full bg-[#05072e] overflow-hidden text-white">
      {/* Ambient Glowing Blobs */}
      <div className="absolute top-12 left-1/2 -translate-x-1/2 w-[700px] h-[350px] bg-[#48CAE4]/15 rounded-full blur-3xl pointer-events-none animate-pulse" />
      <div className="absolute top-0 right-10 w-80 h-80 bg-[#0077B6]/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-10 w-80 h-80 bg-[#48CAE4]/15 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10 space-y-8 relative z-10">
        {/* Header in Dark Scheme */}
        <div className="space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 dark:bg-white/10 text-[#CAF0F8] text-xs font-semibold border border-[#48CAE4]/30 backdrop-blur-md shadow-2xs">
            <BookOpen className="w-3.5 h-3.5 text-[#48CAE4]" />
            <span>{t('standards.badge', 'Bureau of Indian Standards Repository')}</span>
          </div>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight">
            {t('standards.title', 'Indian Standards Directory & Search')}
          </h1>
          <p className="text-sm sm:text-base text-[#ADE8F4]/90 max-w-2xl leading-relaxed">
            {t('standards.subtitle', 'Search authoritative Indian Standards (IS), explore technical scopes, mandatory Quality Control Orders (QCO), and testing clause schedules.')}
          </p>
        </div>

        {/* Search & Filter Bar */}
        <div className="bg-white/95 dark:bg-slate-900/95 backdrop-blur-md p-5 rounded-2xl border border-white/20 dark:border-slate-800 shadow-xl shadow-[#03045E]/30 space-y-4">
          <form onSubmit={handleSearchSubmit} className="flex gap-2">
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
              <input
                type="text"
                value={query}
                onChange={e => setQuery(e.target.value)}
                placeholder={t('standards.search_placeholder', 'Search by IS number (e.g. IS 10500, IS 17526) or keyword (cement, cable, steel, bottle)...')}
                className="w-full pl-10 pr-3.5 py-2.5 text-xs sm:text-sm rounded-xl border border-slate-300 dark:border-slate-700 bg-white/50 dark:bg-slate-800/50 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-[#0077B6] focus:border-[#023E8A]"
              />
            </div>
            <button
              type="submit"
              className="px-6 py-2.5 text-xs sm:text-sm font-bold bg-gradient-to-r from-[#023E8A] via-[#0077B6] to-[#0077B6] hover:from-[#03045E] hover:to-[#023E8A] text-white rounded-xl shadow-md shadow-[#0077B6]/20 transition-all cursor-pointer"
            >
              {t('standards.search_btn', 'Search')}
            </button>
          </form>

          {/* Division Pills & Mandatory Filter */}
          <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-slate-100 dark:border-slate-800 text-xs">
            <div className="flex flex-wrap items-center gap-1.5">
              <span className="font-semibold text-slate-500 dark:text-slate-400 mr-1 flex items-center gap-1">
                <Filter className="w-3 h-3 text-[#0077B6] dark:text-[#48CAE4]" /> {t('standards.filter_division', 'Division:')}
              </span>
              {divisions.map(div => {
                const isSel = (selectedDivision === '' && div === t('standards.filter_all', 'All Divisions')) || selectedDivision === div;
                return (
                  <button
                    key={div}
                    type="button"
                    onClick={() => setSelectedDivision(div === t('standards.filter_all', 'All Divisions') ? '' : div)}
                    className={`px-3 py-1 rounded-full text-[11px] transition-all cursor-pointer ${
                      isSel
                        ? 'bg-gradient-to-r from-[#023E8A] to-[#0077B6] text-white font-bold shadow-xs'
                        : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-[#CAF0F8]/80 hover:text-[#023E8A]'
                    }`}
                  >
                    {div}
                  </button>
                );
              })}
            </div>

            <label className="flex items-center gap-2 cursor-pointer select-none font-semibold text-slate-700 dark:text-slate-300">
              <input
                type="checkbox"
                checked={mandatoryOnly}
                onChange={e => setMandatoryOnly(e.target.checked)}
                className="w-4 h-4 rounded text-[#0077B6] focus:ring-[#0077B6] accent-[#0077B6]"
              />
              <span>{t('standards.filter_mandatory', 'Mandatory QCO Only')}</span>
            </label>
          </div>
        </div>

        {/* Standards Grid */}
        {isLoading ? (
          <LoadingState
            message={t('standards.loading_msg', 'Retrieving Standards from BIS Repository...')}
            submessage={t('standards.loading_sub', 'Applying division filters and QCO regulatory scopes...')}
          />
        ) : standards.length > 0 ? (
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {standards.map(std => (
              <StandardCard
                key={std.id || std.standardNumber}
                standard={std}
                onSelect={handleSelectStandard}
              />
            ))}
          </div>
        ) : (
          <EmptyState
            title={t('standards.empty_title', 'No Indian Standards Found')}
            description={t('standards.empty_desc', 'Try broadening your search query or reset the division and mandatory QCO filters.')}
            icon={BookOpen}
            actionLabel={t('standards.empty_action', 'Reset Filters')}
            onAction={() => {
              setQuery('');
              setSelectedDivision('');
              setMandatoryOnly(false);
            }}
          />
        )}
      </div>
    </div>
  );
}
