'use client';

import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { Laboratory } from '@bis/shared-types';
import { apiClient } from '@bis/api-client';
import { LaboratoryCard, LoadingState, EmptyState } from '@bis/ui';
import { Building2, Search, MapPin, Filter, CheckCircle2, Upload, ClipboardCheck } from 'lucide-react';
import { useTranslation } from "@/lib/i18n";

function LaboratoriesFinderContent() {
  const { t } = useTranslation();
  const searchParams = useSearchParams();
  const stdParam = searchParams.get('std') || '';
  const productParam = searchParams.get('product') || '';

  const [filterStd, setFilterStd] = useState(stdParam);
  const [filterState, setFilterState] = useState('');
  const [laboratories, setLaboratories] = useState<Laboratory[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedLab, setSelectedLab] = useState<Laboratory | null>(null);
  const [uploadedDocuments, setUploadedDocuments] = useState<Record<string, File | null>>({});
  const [applicationSubmitted, setApplicationSubmitted] = useState(false);

  const requiredDocuments = ['Product details and specification', 'Test request or existing test report', 'Manufacturer and contact information'];

  const states = [
    'All States',
    'Maharashtra',
    'Delhi',
    'Uttar Pradesh',
    'Karnataka',
    'Haryana',
    'Tamil Nadu',
    'Gujarat'
  ];

  const fetchLaboratories = async () => {
    setIsLoading(true);
    try {
      const res = await apiClient.searchLaboratories({
        standardNumber: filterStd || undefined,
        state: filterState === 'All States' ? undefined : filterState
      });
      setLaboratories(res.laboratories);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchLaboratories();
  }, [filterState]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    fetchLaboratories();
  };

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
            <Building2 className="w-3.5 h-3.5 text-[#48CAE4]" />
            <span>{t("labs.badge", "Accredited Testing Infrastructure")}</span>
          </div>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight">
            {t("labs.title", "Find a BIS Recognized Laboratory")}
          </h1>
          <p className="text-sm sm:text-base text-[#ADE8F4]/90 max-w-2xl leading-relaxed">
            {t("labs.subtitle", "Search NABL (ISO/IEC 17025) accredited and BIS Recognized Testing Laboratories across Indian states and cities with valid testing scopes.")}
          </p>
        </div>

        {/* Search & State Filter */}
        <div className="bg-white/95 dark:bg-slate-900/95 backdrop-blur-md p-5 rounded-2xl border border-white/20 dark:border-slate-800 shadow-xl shadow-[#03045E]/30 space-y-4">
          <form onSubmit={handleSearchSubmit} className="flex gap-2">
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
              <input
                type="text"
                value={filterStd}
                onChange={e => setFilterStd(e.target.value)}
                placeholder={t("labs.search_placeholder", "Search by Indian Standard (e.g. IS 17526, IS 14543, IS 16046, IS 1786)...")}
                className="w-full pl-10 pr-3.5 py-2.5 text-xs sm:text-sm rounded-xl border border-slate-300 dark:border-slate-700 bg-white/50 dark:bg-slate-800/50 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-[#0077B6] focus:border-[#023E8A]"
              />
            </div>
            <button
              type="submit"
              className="px-6 py-2.5 text-xs sm:text-sm font-bold bg-gradient-to-r from-[#023E8A] via-[#0077B6] to-[#0077B6] hover:from-[#03045E] hover:to-[#023E8A] text-white rounded-xl shadow-md shadow-[#0077B6]/20 transition-all cursor-pointer"
            >
              {t("labs.btn_filter", "Filter Labs")}
            </button>
          </form>

          {/* State Selection Pills */}
          <div className="flex flex-wrap items-center gap-1.5 pt-3 border-t border-slate-100 dark:border-slate-800 text-xs">
            <span className="font-semibold text-slate-500 dark:text-slate-400 mr-1 flex items-center gap-1">
              <MapPin className="w-3 h-3 text-[#0077B6] dark:text-[#48CAE4]" /> {t("labs.filter_state", "State")}:
            </span>
            {states.map(st => {
              const isSel = (filterState === '' && st === 'All States') || filterState === st;
              return (
                <button
                  key={st}
                  type="button"
                  onClick={() => setFilterState(st === 'All States' ? '' : st)}
                  className={`px-3 py-1 rounded-full text-[11px] transition-all cursor-pointer ${
                    isSel
                      ? 'bg-gradient-to-r from-[#023E8A] to-[#0077B6] text-white font-bold shadow-xs'
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-[#CAF0F8]/80 hover:text-[#023E8A]'
                  }`}
                >
                  {st === 'All States'
                    ? t("labs.filter_allstates", "All States")
                    : st === 'Maharashtra'
                    ? t("labs.state_maharashtra", "Maharashtra")
                    : st === 'Delhi'
                    ? t("labs.state_delhi", "Delhi")
                    : st === 'Uttar Pradesh'
                    ? t("labs.state_uttar_pradesh", "Uttar Pradesh")
                    : st === 'Karnataka'
                    ? t("labs.state_karnataka", "Karnataka")
                    : st === 'Haryana'
                    ? t("labs.state_haryana", "Haryana")
                    : st === 'Tamil Nadu'
                    ? t("labs.state_tamil_nadu", "Tamil Nadu")
                    : st === 'Gujarat'
                    ? t("labs.state_gujarat", "Gujarat")
                    : st}
                </button>
              );
            })}
          </div>
        </div>

        {/* Laboratories Grid */}
        {isLoading ? (
          <LoadingState
            message="Locating Recognized Testing Laboratories..."
            submessage="Matching accredited testing parameters and laboratory validity schedules..."
          />
        ) : laboratories.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {laboratories.map((lab, idx) => (
              <div key={lab.id || idx} className="space-y-3">
                <LaboratoryCard laboratory={lab} />
                <button type="button" onClick={() => { setSelectedLab(lab); setApplicationSubmitted(false); }} className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[#023E8A] to-[#0077B6] px-4 py-2.5 text-xs font-bold text-white shadow-md shadow-[#0077B6]/20 transition hover:from-[#03045E] hover:to-[#023E8A]">
                  <ClipboardCheck className="h-4 w-4" /> Select This Laboratory
                </button>
              </div>
            ))}
          </div>
        ) : (
          <EmptyState
            title="No Laboratories Found"
            description="Try removing the standard filter or choosing 'All States' to view national reference laboratories."
            icon={Building2}
            actionLabel="View All Laboratories"
            onAction={() => {
              setFilterStd('');
              setFilterState('');
            }}
          />
        )}

        {selectedLab && (
          <section className="rounded-2xl border border-[#48CAE4]/50 bg-white p-6 text-slate-900 shadow-xl dark:bg-slate-900 dark:text-white">
            <div className="flex flex-col gap-2 border-b border-slate-200 pb-4 dark:border-slate-800 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="text-[10px] font-bold uppercase tracking-[0.15em] text-[#0077B6] dark:text-[#48CAE4]">Selected Laboratory</p>
                <h2 className="mt-1 text-xl font-black">{selectedLab.name}</h2>
                <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">{productParam || 'Selected product'} {stdParam ? `• ${stdParam}` : ''}</p>
              </div>
              <span className="rounded-full bg-emerald-100 px-3 py-1 text-[10px] font-bold text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-300">{selectedLab.recognitionStatus}</span>
            </div>

            {!applicationSubmitted ? (
              <form onSubmit={(event) => {
                event.preventDefault();
                const complete = requiredDocuments.every((document) => uploadedDocuments[document]);
                if (!complete) return;
                window.localStorage.setItem('bis-lab-application', JSON.stringify({ title: 'Lab Application Update', text: `Documents submitted to ${selectedLab.name} for ${productParam || 'your product'}. Track application progress here.`, date: new Date().toLocaleString(), labName: selectedLab.name, standardNumber: stdParam, product: productParam, status: 'Submitted to laboratory' }));
                setApplicationSubmitted(true);
              }} className="mt-5 space-y-4">
                <p className="text-sm font-semibold text-slate-700 dark:text-slate-300">Prepare Required Documents</p>
                <p className="text-xs text-slate-500 dark:text-slate-400">Upload all documents so the selected laboratory can verify the product and send the test details back to you.</p>
                <div className="space-y-2">
                  {requiredDocuments.map((document) => (
                    <label key={document} className="flex cursor-pointer items-center justify-between gap-3 rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-xs dark:border-slate-800 dark:bg-slate-950/40">
                      <span className="flex items-center gap-2 font-semibold text-slate-700 dark:text-slate-300"><Upload className="h-4 w-4 text-[#0077B6]" /> {uploadedDocuments[document]?.name || document}</span>
                      <input required type="file" className="max-w-[150px] text-[10px] text-slate-500" onChange={(event) => setUploadedDocuments((current) => ({ ...current, [document]: event.target.files?.[0] || null }))} />
                    </label>
                  ))}
                </div>
                <button type="submit" className="rounded-lg bg-[#0077B6] px-5 py-2.5 text-xs font-bold text-white transition hover:bg-[#023E8A]">Submit to Laboratory</button>
              </form>
            ) : (
              <div className="mt-5 rounded-xl border border-emerald-300 bg-emerald-50 p-4 dark:border-emerald-800 dark:bg-emerald-950/30">
                <p className="text-sm font-bold text-emerald-700 dark:text-emerald-300">Application submitted to the laboratory.</p>
                <p className="mt-1 text-xs text-emerald-700/80 dark:text-emerald-300/80">The laboratory will send product verification and test details. Progress is available in the home notification bar.</p>
                <div className="mt-4 flex flex-wrap gap-2">
                  <Link href="/" className="rounded-lg bg-[#0077B6] px-4 py-2 text-xs font-bold text-white">Track in Notifications</Link>
                  <Link href={`/certification?std=${encodeURIComponent(stdParam)}&product=${encodeURIComponent(productParam)}`} className="rounded-lg border border-[#0077B6] px-4 py-2 text-xs font-bold text-[#0077B6] dark:text-[#48CAE4]">Continue to Certification</Link>
                </div>
              </div>
            )}
          </section>
        )}
      </div>
    </div>
  );
}

export default function LaboratoriesFinderPage() {
  return (
    <React.Suspense fallback={<div className="p-8 text-center text-xs text-slate-500">Loading Laboratories...</div>}>
      <LaboratoriesFinderContent />
    </React.Suspense>
  );
}

