import React from 'react';
import { UserRole } from '@bis/shared-types';
import { Factory, ShoppingBag, GraduationCap, Check } from 'lucide-react';

interface ModeSelectorProps {
  currentMode: UserRole;
  onModeChange: (mode: UserRole) => void;
  className?: string;
}

export const ModeSelector: React.FC<ModeSelectorProps> = ({
  currentMode,
  onModeChange,
  className = ''
}) => {
  const modes = [
    {
      id: UserRole.INDUSTRY,
      label: 'Industry / MSME',
      badge: 'Manufacturers & Labs',
      desc: 'Standards, Certification Schemes, Lab Testing, Compliance Roadmap',
      icon: Factory,
      theme: {
        activeCard:
          'bg-gradient-to-br from-[#CAF0F8]/60 via-white to-[#ADE8F4]/40 dark:from-[#03045E]/40 dark:via-[#023E8A]/20 dark:to-slate-900 border-[#023E8A] dark:border-[#0077B6] shadow-xl shadow-[#023E8A]/15 ring-2 ring-[#023E8A]/20 -translate-y-1.5',
        hoverCard:
          'hover:border-[#023E8A]/70 dark:hover:border-[#0077B6]/70 hover:shadow-xl hover:shadow-[#023E8A]/10 hover:-translate-y-1.5',
        activeIcon:
          'bg-gradient-to-br from-[#03045E] to-[#023E8A] text-white shadow-md shadow-[#023E8A]/35 ring-2 ring-[#0077B6]/30',
        inactiveIcon:
          'bg-[#CAF0F8] dark:bg-[#03045E]/60 text-[#023E8A] dark:text-[#CAF0F8] group-hover:bg-[#ADE8F4] dark:group-hover:bg-[#023E8A]/80 group-hover:text-[#03045E]',
        activeBadge:
          'bg-[#023E8A] text-white border-[#03045E]',
        titleHover: 'group-hover:text-[#023E8A] dark:group-hover:text-[#CAF0F8]',
        bar: 'from-[#03045E] via-[#023E8A] to-[#0077B6]'
      }
    },
    {
      id: UserRole.CONSUMER,
      label: 'Consumer',
      badge: 'Buyers & Public',
      desc: 'Verify ISI Mark, Gold Hallmark, HUID Check, Consumer Grievance',
      icon: ShoppingBag,
      theme: {
        activeCard:
          'bg-gradient-to-br from-[#ADE8F4]/60 via-white to-[#CAF0F8]/40 dark:from-[#023E8A]/40 dark:via-[#0077B6]/20 dark:to-slate-900 border-[#0077B6] dark:border-[#0077B6] shadow-xl shadow-[#0077B6]/15 ring-2 ring-[#0077B6]/20 -translate-y-1.5',
        hoverCard:
          'hover:border-[#0077B6]/70 dark:hover:border-[#0077B6]/70 hover:shadow-xl hover:shadow-[#0077B6]/10 hover:-translate-y-1.5',
        activeIcon:
          'bg-gradient-to-br from-[#0077B6] to-[#0077B6] text-white shadow-md shadow-[#0077B6]/35 ring-2 ring-[#48CAE4]/30',
        inactiveIcon:
          'bg-[#ADE8F4] dark:bg-[#023E8A]/60 text-[#0077B6] dark:text-[#48CAE4] group-hover:bg-[#CAF0F8] dark:group-hover:bg-[#0077B6]/80 group-hover:text-[#0077B6]',
        activeBadge:
          'bg-[#0077B6] text-white border-[#0077B6]',
        titleHover: 'group-hover:text-[#0077B6] dark:group-hover:text-[#48CAE4]',
        bar: 'from-[#0077B6] via-[#0077B6] to-[#48CAE4]'
      }
    },
    {
      id: UserRole.STUDENT_RESEARCHER,
      label: 'Student / Researcher',
      badge: 'Academia & Analysis',
      desc: 'Technical Clauses, Standards Explorer, Comparative Analysis',
      icon: GraduationCap,
      theme: {
        activeCard:
          'bg-gradient-to-br from-[#CAF0F8]/60 via-white to-[#CAF0F8]/60 dark:from-[#0077B6]/40 dark:via-[#0077B6]/20 dark:to-slate-900 border-[#48CAE4] dark:border-[#48CAE4] shadow-xl shadow-[#48CAE4]/15 ring-2 ring-[#48CAE4]/20 -translate-y-1.5',
        hoverCard:
          'hover:border-[#48CAE4]/70 dark:hover:border-[#48CAE4]/70 hover:shadow-xl hover:shadow-[#48CAE4]/10 hover:-translate-y-1.5',
        activeIcon:
          'bg-gradient-to-br from-[#0077B6] via-[#48CAE4] to-[#48CAE4] text-white shadow-md shadow-[#48CAE4]/35 ring-2 ring-[#48CAE4]/30',
        inactiveIcon:
          'bg-[#CAF0F8] dark:bg-[#0077B6]/50 text-[#0077B6] dark:text-[#CAF0F8] group-hover:bg-[#CAF0F8] dark:group-hover:bg-[#0077B6]/60 group-hover:text-[#0077B6]',
        activeBadge:
          'bg-[#0077B6] text-white border-[#48CAE4]',
        titleHover: 'group-hover:text-[#0077B6] dark:group-hover:text-[#48CAE4]',
        bar: 'from-[#0077B6] via-[#48CAE4] to-[#48CAE4]'
      }
    }
  ];

  return (
    <div className={`grid grid-cols-1 sm:grid-cols-3 gap-3.5 ${className}`}>
      {modes.map(m => {
        const isSelected = currentMode === m.id;
        const Icon = m.icon;
        const { theme } = m;
        return (
          <button
            key={m.id}
            type="button"
            suppressHydrationWarning
            onClick={() => onModeChange(m.id)}
            className={`group relative p-4 rounded-2xl border text-left transition-all duration-300 ease-out overflow-hidden cursor-pointer ${
              isSelected
                ? theme.activeCard
                : `bg-white dark:bg-slate-900/90 border-slate-200/90 dark:border-slate-800/90 shadow-sm ${theme.hoverCard}`
            }`}
          >
            {/* Top Glowing Accent Line for Active Mode */}
            {isSelected && (
              <div
                className={`absolute top-0 left-0 right-0 h-1 bg-gradient-to-r ${theme.bar}`}
              />
            )}

            <div className="flex items-center justify-between gap-2 mb-2">
              <div className="flex items-center gap-2.5 min-w-0">
                <span
                  className={`p-2 rounded-xl transition-all duration-300 group-hover:scale-110 group-hover:-rotate-3 shrink-0 ${
                    isSelected ? theme.activeIcon : theme.inactiveIcon
                  }`}
                >
                  <Icon className="w-4 h-4 transition-transform duration-300" />
                </span>
                <div className="min-w-0">
                  <h4
                    className={`text-sm font-bold transition-colors duration-200 ${
                      isSelected
                        ? 'text-slate-900 dark:text-white'
                        : `text-slate-800 dark:text-slate-200 ${theme.titleHover}`
                    }`}
                  >
                    {m.label}
                  </h4>
                </div>
              </div>

              {/* Status indicator / pill */}
              <div className="shrink-0">
                {isSelected ? (
                  <span
                    className={`inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full border shadow-xs transition-all duration-300 whitespace-nowrap ${theme.activeBadge}`}
                  >
                    <Check className="w-3 h-3 stroke-[2.5]" />
                    Active
                  </span>
                ) : (
                  <span className="inline-flex items-center whitespace-nowrap text-[11px] font-semibold text-slate-400 dark:text-slate-500 group-hover:text-slate-700 dark:group-hover:text-slate-200 opacity-0 group-hover:opacity-100 transition-all duration-200 translate-x-1 group-hover:translate-x-0">
                    Switch &rarr;
                  </span>
                )}
              </div>
            </div>

            <p className="text-xs text-slate-600 dark:text-slate-400 line-clamp-2 leading-relaxed">
              {m.desc}
            </p>

            {/* Subtle role badge tag */}
            <div className="mt-2.5 pt-2 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between">
              <span className="text-[10px] font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-400">
                {m.badge}
              </span>
              <span
                className={`w-1.5 h-1.5 rounded-full transition-all duration-300 ${
                  isSelected
                    ? `bg-gradient-to-r ${theme.bar} scale-125`
                    : 'bg-slate-300 dark:bg-slate-700 group-hover:scale-110'
                }`}
              />
            </div>
          </button>
        );
      })}
    </div>
  );
};
