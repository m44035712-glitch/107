'use client';

import React from 'react';
import Link from 'next/link';
import { Compass, Award, FlaskConical, Building2, FileBarChart2, ArrowRight } from 'lucide-react';

export default function CompliancePage() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10 space-y-8">
      <div className="space-y-1">
        <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-blue-50 text-blue-800 dark:bg-blue-950 dark:text-blue-300 text-xs font-semibold">
          <Award className="w-3.5 h-3.5" />
          <span>End-to-End Compliance Journey</span>
        </div>
        <h1 className="text-3xl font-black text-slate-900 dark:text-slate-100 tracking-tight">
          BIS Compliance Hub & Workflow
        </h1>
        <p className="text-sm text-slate-600 dark:text-slate-400 max-w-2xl">
          Complete end-to-end statutory certification workflow from standard discovery to laboratory testing and licence grant.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Link
          href="/standards/recommend"
          className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm hover:border-blue-500 transition-all space-y-3 group"
        >
          <div className="p-3 rounded-xl bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300 w-fit">
            <Compass className="w-5 h-5" />
          </div>
          <h3 className="text-base font-bold text-slate-900 dark:text-slate-100 group-hover:text-blue-600">
            1. Find My Standard
          </h3>
          <p className="text-xs text-slate-500 leading-relaxed">
            Match raw materials, application, and capacity to published Indian Standards.
          </p>
          <span className="text-xs font-semibold text-blue-600 flex items-center gap-1 pt-2">
            Start Profiler →
          </span>
        </Link>

        <Link
          href="/certification"
          className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm hover:border-amber-500 transition-all space-y-3 group"
        >
          <div className="p-3 rounded-xl bg-amber-100 dark:bg-amber-950 text-amber-700 dark:text-amber-300 w-fit">
            <Award className="w-5 h-5" />
          </div>
          <h3 className="text-base font-bold text-slate-900 dark:text-slate-100 group-hover:text-amber-600">
            2. Certification Schemes
          </h3>
          <p className="text-xs text-slate-500 leading-relaxed">
            Determine whether Scheme I (ISI Mark) or Scheme II (CRS) applies.
          </p>
          <span className="text-xs font-semibold text-amber-600 flex items-center gap-1 pt-2">
            View Roadmap →
          </span>
        </Link>

        <Link
          href="/testing"
          className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm hover:border-indigo-500 transition-all space-y-3 group"
        >
          <div className="p-3 rounded-xl bg-indigo-100 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300 w-fit">
            <FlaskConical className="w-5 h-5" />
          </div>
          <h3 className="text-base font-bold text-slate-900 dark:text-slate-100 group-hover:text-indigo-600">
            3. Testing Clauses
          </h3>
          <p className="text-xs text-slate-500 leading-relaxed">
            Review routine test parameters, sampling frequencies, and equipment schedules.
          </p>
          <span className="text-xs font-semibold text-indigo-600 flex items-center gap-1 pt-2">
            Check Testing →
          </span>
        </Link>

        <Link
          href="/reports"
          className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm hover:border-rose-500 transition-all space-y-3 group"
        >
          <div className="p-3 rounded-xl bg-rose-100 dark:bg-rose-950 text-rose-700 dark:text-rose-300 w-fit">
            <FileBarChart2 className="w-5 h-5" />
          </div>
          <h3 className="text-base font-bold text-slate-900 dark:text-slate-100 group-hover:text-rose-600">
            4. Compliance Report
          </h3>
          <p className="text-xs text-slate-500 leading-relaxed">
            Generate and export complete statutory assessment report in PDF / print format.
          </p>
          <span className="text-xs font-semibold text-rose-600 flex items-center gap-1 pt-2">
            Generate Report →
          </span>
        </Link>
      </div>
    </div>
  );
}
