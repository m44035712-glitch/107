'use client';

import React, { useState, useEffect } from 'react';
import { QueryAnalyticsData } from '@bis/shared-types';
import { apiClient } from '@bis/api-client';
import { LoadingState } from '@bis/ui';
import {
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import {
  BarChart3,
  TrendingUp,
  ShieldCheck,
  Clock,
  ThumbsUp,
  Award,
  LayoutDashboard,
  MessageSquareText,
  Route,
  History,
  FileText,
  Settings,
  UserCircle2,
  BellRing,
  ArrowUpRight,
  Sparkles,
  Activity,
  ChevronRight,
  Globe,
} from 'lucide-react';

const navItems = [
  { label: 'Dashboard', href: '/dashboard', icon: LayoutDashboard, active: true },
  { label: 'Main Feature', href: '/chat', icon: MessageSquareText, active: false },
  { label: 'Route/Analysis', href: '/standards/recommend', icon: Route, active: false },
  { label: 'History', href: '/reports', icon: History, active: false },
  { label: 'Reports', href: '/reports', icon: FileText, active: false },
  { label: 'Settings', href: '/admin', icon: Settings, active: false },
  { label: 'Profile', href: '/login', icon: UserCircle2, active: false },
];

export default function AnalyticsDashboardPage() {
  const [data, setData] = useState<QueryAnalyticsData | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const analytics = await apiClient.getAnalytics();
        setData(analytics);
      } catch (err) {
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchAnalytics();
  }, []);

  if (isLoading || !data) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20">
        <LoadingState
          message="Loading BIS Intelligence Analytics..."
          submessage="Aggregating query logs, latency metrics, and citation accuracy statistics..."
        />
      </div>
    );
  }

  const intentChartData = Object.entries(data.queriesByIntent).map(([intent, count]) => ({
    name: intent.replace(/_/g, ' '),
    count,
  }));

  const languageChartData = Object.entries(data.languageDistribution).map(([lang, percent]) => ({
    name: lang,
    value: percent,
  }));

  const COLORS = ['#0077B6', '#0077B6', '#5aff90', '#48CAE4', '#F59E0B', '#ff4058'];

  const dashboardStats = [
    {
      label: 'Total queries',
      value: data.totalQueries.toLocaleString(),
      delta: '+18.2%',
      tone: 'text-emerald-600',
      icon: TrendingUp,
    },
    {
      label: 'Grounding rate',
      value: `${(data.citationAccuracyRate * 100).toFixed(1)}%`,
      delta: 'Zero-hallucination',
      tone: 'text-sky-600',
      icon: ShieldCheck,
    },
    {
      label: 'Avg latency',
      value: `${data.averageRetrievalLatencyMs} ms`,
      delta: 'Hybrid retrieval',
      tone: 'text-amber-600',
      icon: Clock,
    },
    {
      label: 'Satisfaction',
      value: `${(data.userSatisfactionRate * 100).toFixed(1)}%`,
      delta: `${data.userFeedbackStats.helpful} helpful`,
      tone: 'text-violet-600',
      icon: ThumbsUp,
    },
  ];

  const systemAlerts = [
    { title: 'Citations validated', detail: '98.4% of the latest responses were grounded to BIS sources.', tone: 'emerald' },
    { title: 'Standards coverage', detail: '12 new product categories were indexed this week.', tone: 'sky' },
    { title: 'Review queue', detail: '3 compliance prompts require follow-up from the admin team.', tone: 'amber' },
  ];

  return (
    <div className="min-h-screen bg-slate-100/80 dark:bg-slate-950">
      <div className="mx-auto max-w-7xl px-4 py-6 lg:px-8">
        <div className="grid gap-6 lg:grid-cols-[240px_minmax(0,1fr)]">
          <aside className="rounded-[28px] border border-slate-200 bg-white/80 p-4 shadow-[0_20px_50px_rgba(15,23,42,0.08)] backdrop-blur-xl dark:border-slate-800 dark:bg-slate-900/80">
            <div className="mb-6 flex items-center gap-3 px-2">
              <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-to-br from-sky-500 via-cyan-500 to-blue-700 text-white shadow-lg shadow-sky-500/20">
                <Sparkles className="h-5 w-5" />
              </div>
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-slate-500 dark:text-slate-400">
                  SentinelX
                </p>
                <h2 className="text-base font-bold text-slate-900 dark:text-white">Operations</h2>
              </div>
            </div>

            <nav className="space-y-1.5">
              {navItems.map(({ label, href, icon: Icon, active }) => (
                <a
                  key={label}
                  href={href}
                  className={`group flex items-center justify-between rounded-2xl px-3 py-2.5 text-sm font-medium transition-all ${
                    active
                      ? 'bg-gradient-to-r from-sky-50 to-cyan-50 text-sky-700 shadow-sm ring-1 ring-sky-100 dark:from-sky-950/60 dark:to-cyan-950/60 dark:text-sky-300 dark:ring-sky-900/80'
                      : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900 dark:text-slate-300 dark:hover:bg-slate-800 dark:hover:text-white'
                  }`}
                >
                  <span className="flex items-center gap-3">
                    <Icon className="h-4 w-4" />
                    {label}
                  </span>
                  <ChevronRight className="h-4 w-4 opacity-0 transition group-hover:opacity-100" />
                </a>
              ))}
            </nav>

            <div className="mt-8 rounded-2xl border border-slate-200 bg-slate-50 p-4 dark:border-slate-800 dark:bg-slate-950/60">
              <div className="flex items-center justify-between">
                <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-500 dark:text-slate-400">Status</p>
                <Activity className="h-4 w-4 text-emerald-500" />
              </div>
              <div className="mt-3 space-y-2 text-sm">
                <div className="flex items-center justify-between text-slate-600 dark:text-slate-300">
                  <span>Inference health</span>
                  <span className="font-semibold text-emerald-600 dark:text-emerald-400">Online</span>
                </div>
                <div className="flex items-center justify-between text-slate-600 dark:text-slate-300">
                  <span>Coverage</span>
                  <span className="font-semibold text-sky-600 dark:text-sky-400">96.4%</span>
                </div>
              </div>
            </div>
          </aside>

          <main className="space-y-6">
            <header className="rounded-[28px] bg-gradient-to-r from-[#03045E] via-[#023E8A] to-[#0077B6] p-6 text-white shadow-[0_24px_60px_rgba(2,62,138,0.35)]">
              <div className="flex flex-col gap-5 xl:flex-row xl:items-center xl:justify-between">
                <div>
                  <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.2em] text-sky-100">
                    <Sparkles className="h-3.5 w-3.5" />
                    AI Operations Desk
                  </div>
                  <h1 className="text-2xl font-black tracking-tight sm:text-3xl">Welcome back, BIS intelligence team</h1>
                  <p className="mt-2 max-w-2xl text-sm text-sky-100">
                    Monitor standards impact, retrieval quality, and user trust across AI-assisted certification workflows.
                  </p>
                </div>

                <div className="flex flex-wrap gap-3">
                  <button className="rounded-xl border border-white/20 bg-white/10 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-white/15">
                    Export report
                  </button>
                  <a
                    href="/chat"
                    className="rounded-xl bg-white px-4 py-2.5 text-sm font-semibold text-sky-700 shadow-lg shadow-sky-900/20 transition hover:-translate-y-0.5 hover:bg-sky-50"
                  >
                    Open AI chat
                  </a>
                </div>
              </div>
            </header>

            <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
              {dashboardStats.map(({ label, value, delta, tone, icon: Icon }) => (
                <div key={label} className="rounded-[24px] border border-slate-200 bg-white p-5 shadow-[0_18px_40px_rgba(15,23,42,0.04)] transition hover:-translate-y-0.5 dark:border-slate-800 dark:bg-slate-900">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-500 dark:text-slate-400">{label}</span>
                    <div className={`rounded-xl p-2 ${tone} bg-slate-100 dark:bg-slate-800`}>
                      <Icon className="h-4 w-4" />
                    </div>
                  </div>
                  <div className="mt-4 text-2xl font-black tracking-tight text-slate-900 dark:text-white">{value}</div>
                  <div className="mt-2 flex items-center gap-2 text-xs font-medium text-slate-500 dark:text-slate-400">
                    <ArrowUpRight className="h-3.5 w-3.5 text-emerald-500" />
                    {delta}
                  </div>
                </div>
              ))}
            </section>

            <section className="grid gap-6 xl:grid-cols-[1.6fr_1fr]">
              <div className="rounded-[28px] border border-slate-200 bg-white p-5 shadow-[0_20px_45px_rgba(15,23,42,0.04)] dark:border-slate-800 dark:bg-slate-900">
                <div className="mb-4 flex items-center justify-between">
                  <div>
                    <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-slate-500 dark:text-slate-400">Query analytics</p>
                    <h2 className="mt-1 text-lg font-bold text-slate-900 dark:text-white">Intent distribution</h2>
                  </div>
                  <div className="inline-flex items-center gap-2 rounded-full bg-sky-50 px-2.5 py-1 text-xs font-semibold text-sky-700 dark:bg-sky-950/60 dark:text-sky-300">
                    <BarChart3 className="h-3.5 w-3.5" />
                    Live
                  </div>
                </div>
                <div className="h-72 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={intentChartData} layout="vertical" margin={{ left: 40, right: 20 }}>
                      <XAxis type="number" tick={{ fontSize: 10 }} />
                      <YAxis dataKey="name" type="category" tick={{ fontSize: 10 }} width={120} />
                      <Tooltip />
                      <Bar dataKey="count" fill="#0077B6" radius={[0, 8, 8, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>

              <div className="rounded-[28px] border border-slate-200 bg-white p-5 shadow-[0_20px_45px_rgba(15,23,42,0.04)] dark:border-slate-800 dark:bg-slate-900">
                <div className="mb-4 flex items-center justify-between">
                  <div>
                    <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-slate-500 dark:text-slate-400">Alerts</p>
                    <h2 className="mt-1 text-lg font-bold text-slate-900 dark:text-white">System health</h2>
                  </div>
                  <BellRing className="h-4 w-4 text-sky-600" />
                </div>
                <div className="space-y-3">
                  {systemAlerts.map((alert) => (
                    <div key={alert.title} className="rounded-2xl border border-slate-200 bg-slate-50 p-3 dark:border-slate-800 dark:bg-slate-950/40">
                      <div className="flex items-center gap-2">
                        <span className={`h-2.5 w-2.5 rounded-full ${
                          alert.tone === 'emerald' ? 'bg-emerald-500' : alert.tone === 'sky' ? 'bg-sky-500' : 'bg-amber-500'
                        }`} />
                        <p className="text-sm font-semibold text-slate-800 dark:text-slate-200">{alert.title}</p>
                      </div>
                      <p className="mt-2 text-xs leading-relaxed text-slate-600 dark:text-slate-400">{alert.detail}</p>
                    </div>
                  ))}
                </div>
              </div>
            </section>

            <section className="grid gap-6 xl:grid-cols-[1.4fr_1fr]">
              <div className="rounded-[28px] border border-slate-200 bg-white p-5 shadow-[0_20px_45px_rgba(15,23,42,0.04)] dark:border-slate-800 dark:bg-slate-900">
                <div className="mb-4 flex items-center justify-between">
                  <div>
                    <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-slate-500 dark:text-slate-400">Top standards</p>
                    <h2 className="mt-1 text-lg font-bold text-slate-900 dark:text-white">Most inquired mandates</h2>
                  </div>
                  <Award className="h-4 w-4 text-amber-500" />
                </div>
                <div className="space-y-3">
                  {data.topSearchedStandards.map((std, idx) => (
                    <div key={std.standardNumber} className="flex items-center justify-between rounded-2xl border border-slate-200 bg-slate-50 px-3 py-2.5 dark:border-slate-800 dark:bg-slate-950/40">
                      <div className="flex items-center gap-3">
                        <span className="flex h-7 w-7 items-center justify-center rounded-full bg-slate-900 text-[10px] font-bold text-white dark:bg-slate-700">
                          {idx + 1}
                        </span>
                        <div>
                          <div className="text-sm font-semibold text-slate-800 dark:text-slate-200">{std.standardNumber}</div>
                          <div className="text-[11px] text-slate-500 dark:text-slate-400">User queries</div>
                        </div>
                      </div>
                      <span className="text-sm font-bold text-sky-700 dark:text-sky-300">{std.count.toLocaleString()}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="rounded-[28px] border border-slate-200 bg-white p-5 shadow-[0_20px_45px_rgba(15,23,42,0.04)] dark:border-slate-800 dark:bg-slate-900">
                <div className="mb-4 flex items-center justify-between">
                  <div>
                    <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-slate-500 dark:text-slate-400">Language mix</p>
                    <h2 className="mt-1 text-lg font-bold text-slate-900 dark:text-white">Global reach</h2>
                  </div>
                  <Globe className="h-4 w-4 text-violet-500" />
                </div>
                <div className="h-52 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie data={languageChartData} dataKey="value" innerRadius={40} outerRadius={70} paddingAngle={4} label={({ name, value }) => `${name}: ${value}%`}>
                        {languageChartData.map((entry, idx) => (
                          <Cell key={`${entry.name}-${idx}`} fill={COLORS[idx % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </section>
          </main>
        </div>
      </div>
    </div>
  );
}
