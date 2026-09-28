'use client';

import React, { useState } from 'react';
import { RAGSearchResponse } from '@bis/shared-types';
import { apiClient } from '@bis/api-client';
import { CitationBadge, LoadingState, SourceFreshnessBadge } from '@bis/ui';
import { BookOpen, Search, Filter, ExternalLink, FileText, CheckCircle2 } from 'lucide-react';

export default function KnowledgeExplorerPage() {
  const [query, setQuery] = useState('Stainless steel vacuum insulated water bottle');
  const [results, setResults] = useState<RAGSearchResponse | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;

    setIsLoading(true);
    try {
      const res = await apiClient.searchKnowledgeDocuments({ query, topK: 10 });
      setResults(res);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10 space-y-8">
      {/* Header */}
      <div className="space-y-1">
        <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-blue-50 text-blue-800 dark:bg-blue-950 dark:text-blue-300 text-xs font-semibold">
          <BookOpen className="w-3.5 h-3.5" />
          <span>Clause & Passage Semantic Search</span>
        </div>
        <h1 className="text-3xl font-black text-slate-900 dark:text-slate-100 tracking-tight">
          BIS Knowledge & Clause Explorer
        </h1>
        <p className="text-sm text-slate-600 dark:text-slate-400 max-w-2xl">
          Search indexed Indian Standards, clause excerpts, tables, and Gazette circulars with granular section and page traceability.
        </p>
      </div>

      {/* Search Bar */}
      <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
        <form onSubmit={handleSearch} className="flex gap-2">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
            <input
              type="text"
              value={query}
              onChange={e => setQuery(e.target.value)}
              placeholder="Search clause text, parameters (e.g. thermal retention, TDS limits, yield stress, fineness)..."
              className="w-full pl-9 pr-3 py-2 text-xs sm:text-sm rounded-xl border border-slate-300 dark:border-slate-700 bg-transparent text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-600"
            />
          </div>
          <button
            type="submit"
            className="px-6 py-2 text-xs sm:text-sm font-bold bg-blue-700 hover:bg-blue-800 text-white rounded-xl shadow-sm transition-all"
          >
            Explore Passages
          </button>
        </form>
      </div>

      {/* Results */}
      {isLoading ? (
        <LoadingState
          message="Executing Hybrid Clause Retrieval..."
          submessage="Searching pgvector embeddings and BM25 index across Indian Standards repository..."
        />
      ) : results && results.results.length > 0 ? (
        <div className="space-y-4">
          <div className="flex items-center justify-between text-xs text-slate-500">
            <span>Retrieved {results.results.length} grounded clause passages in {results.processingTimeMs} ms</span>
            <span>Detected Language: {results.detectedLanguage.toUpperCase()}</span>
          </div>

          <div className="grid grid-cols-1 gap-4">
            {results.results.map((ev, idx) => (
              <div
                key={ev.id || idx}
                className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-3"
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <span className="text-[11px] font-bold text-blue-700 dark:text-blue-400 uppercase tracking-wider">
                      {ev.standardNumber} — Clause {ev.clause} (Page {ev.page})
                    </span>
                    <h3 className="text-base font-bold text-slate-900 dark:text-slate-100 mt-0.5">
                      {ev.documentTitle}
                    </h3>
                  </div>
                  <SourceFreshnessBadge status={ev.status} />
                </div>

                <div className="p-3.5 rounded-xl bg-slate-900 text-slate-100 font-mono text-xs leading-relaxed overflow-x-auto border border-slate-800">
                  {ev.excerpt}
                </div>

                <div className="pt-2 flex items-center justify-between text-xs text-slate-500 border-t border-slate-100 dark:border-slate-800">
                  <span>Relevance Score: {Math.round(ev.similarityScore * 100)}%</span>
                  <a
                    href={ev.sourceUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-blue-600 hover:text-blue-700 font-medium"
                  >
                    <span>View Official BIS Document</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : null}
    </div>
  );
}
