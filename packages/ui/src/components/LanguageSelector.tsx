"use client";

import React, { useState, useRef, useEffect } from "react";
import { IndianLanguage } from "@bis/shared-types";
import { Globe, Check, ChevronDown, Search } from "lucide-react";

interface LanguageSelectorProps {
  selectedLanguage: IndianLanguage;
  onLanguageChange: (lang: IndianLanguage) => void;
  onDashboard?: boolean;
  className?: string;
  searchPlaceholder?: string;
  noLanguageFound?: string;
}

export const INDIAN_LANGUAGES_LIST = [
  { code: IndianLanguage.EN, label: "English", nativeName: "English" },
  { code: IndianLanguage.HI, label: "हिन्दी", nativeName: "हिन्दी" },
  { code: IndianLanguage.BN, label: "বাংলা", nativeName: "বাংলা" },
  { code: IndianLanguage.TA, label: "தமிழ்", nativeName: "தமிழ்" },
  { code: IndianLanguage.TE, label: "తెలుగు", nativeName: "తెలుగు" },
  { code: IndianLanguage.MR, label: "मराठी", nativeName: "मराठी" },
  { code: IndianLanguage.GU, label: "ગુજરાતી", nativeName: "ગુજરાતી" },
  { code: IndianLanguage.KN, label: "ಕನ್ನಡ", nativeName: "ಕನ್ನಡ" },
  { code: IndianLanguage.ML, label: "മലയാളം", nativeName: "മലയാളം" },
  { code: IndianLanguage.PA, label: "ਪੰਜਾਬੀ", nativeName: "ਪੰਜਾਬੀ" },
  { code: IndianLanguage.OR, label: "ଓଡ଼ିଆ", nativeName: "ଓଡ଼ିଆ" },
  { code: IndianLanguage.UR, label: "اردو", nativeName: "اردو" },
  { code: IndianLanguage.AS, label: "অসমীয়া", nativeName: "অসমীয়া" },
  { code: IndianLanguage.SAN, label: "संस्कृतम्", nativeName: "संस्कृतम्" },
  { code: IndianLanguage.NEP, label: "नेपाली", nativeName: "नेपाली" },
  { code: IndianLanguage.KOK, label: "कोंकणी", nativeName: "कोंकणी" },
  { code: IndianLanguage.MAI, label: "मैथिली", nativeName: "मैथिली" },
  { code: IndianLanguage.DOG, label: "डोगरी", nativeName: "डोगरी" },
  { code: IndianLanguage.BOD, label: "བོད་ཡིག", nativeName: "བོད་ཡིག" },
  { code: IndianLanguage.MNI, label: "মৈতৈলোন্", nativeName: "মৈতৈলোন্" },
  { code: IndianLanguage.SAT, label: "संथाली", nativeName: "संथाली" },
  { code: IndianLanguage.KAS, label: "कॉशुर", nativeName: "कॉशुर" },
  { code: IndianLanguage.SD, label: "سنڌي", nativeName: "سنڌي" },
];

export const LanguageSelector: React.FC<LanguageSelectorProps> = ({
  selectedLanguage,
  onLanguageChange,
  className = "",
  searchPlaceholder = "Search language...",
  noLanguageFound = "No language found",
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchFilter, setSearchFilter] = useState("");
  const dropdownRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);

  const activeItem =
    INDIAN_LANGUAGES_LIST.find((l) => l.code === selectedLanguage) ||
    INDIAN_LANGUAGES_LIST[0];

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
        setSearchFilter("");
      }
    };

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setIsOpen(false);
        setSearchFilter("");
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  useEffect(() => {
    if (isOpen && searchInputRef.current) {
      setTimeout(() => {
        searchInputRef.current?.focus();
      }, 50);
    }
  }, [isOpen]);

  const filteredLanguages = INDIAN_LANGUAGES_LIST.filter(
    (lang) =>
      lang.label.toLowerCase().includes(searchFilter.toLowerCase()) ||
      lang.nativeName.toLowerCase().includes(searchFilter.toLowerCase()) ||
      lang.code.toLowerCase().includes(searchFilter.toLowerCase()),
  );

  const handleSelect = (code: IndianLanguage) => {
    onLanguageChange(code);
    setIsOpen(false);
    setSearchFilter("");
  };

  return (
    <div
      ref={dropdownRef}
      className={`relative inline-block text-left ${className}`}
      suppressHydrationWarning
    >
      {/* Trigger Button */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        aria-haspopup="listbox"
        aria-expanded={isOpen}
        className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-semibold text-slate-700 dark:text-slate-200 hover:text-[#0077B6] dark:hover:text-[#48CAE4] bg-white/90 dark:bg-slate-800/90 hover:bg-slate-100 dark:hover:bg-slate-800 transition-all border border-slate-200/90 dark:border-slate-700 shadow-2xs cursor-pointer"
      >
        <Globe className="w-3.5 h-3.5 text-[#0077B6] dark:text-[#48CAE4] shrink-0" />
        <span className="truncate max-w-[95px] sm:max-w-[130px]">
          {activeItem.label}
        </span>
        <ChevronDown
          className={`w-3.5 h-3.5 text-slate-400 transition-transform duration-200 shrink-0 ${
            isOpen ? "rotate-180 text-[#0077B6] dark:text-[#48CAE4]" : ""
          }`}
        />
      </button>

      {/* Custom Dropdown Menu */}
      {isOpen && (
        <div
          role="listbox"
          className="absolute right-0 top-full mt-1.5 w-64 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-2xl shadow-[#03045E]/20 p-1.5 z-[100] animate-in fade-in slide-in-from-top-1 duration-150"
        >
          {/* Search box inside dropdown */}
          <div className="p-1 mb-1 border-b border-slate-100 dark:border-slate-800">
            <div className="relative flex items-center bg-slate-50 dark:bg-slate-800/80 rounded-lg px-2 py-1 border border-slate-200 dark:border-slate-700">
              <Search className="w-3 h-3 text-slate-400 mr-1.5 shrink-0" />
              <input
                ref={searchInputRef}
                type="text"
                value={searchFilter}
                onChange={(e) => setSearchFilter(e.target.value)}
                placeholder={searchPlaceholder}
                className="w-full text-xs text-slate-900 dark:text-slate-100 bg-transparent focus:outline-none placeholder:text-slate-400"
              />
            </div>
          </div>

          {/* Languages list */}
          <div className="max-h-60 overflow-y-auto space-y-0.5 pr-0.5 custom-scrollbar">
            {filteredLanguages.length === 0 ? (
              <div className="py-3 text-center text-xs text-slate-400">
                {noLanguageFound}
              </div>
            ) : (
              filteredLanguages.map((lang) => {
                const isSelected = lang.code === selectedLanguage;
                return (
                  <button
                    key={lang.code}
                    type="button"
                    onClick={() => handleSelect(lang.code)}
                    role="option"
                    aria-selected={isSelected}
                    className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg text-xs font-medium text-left transition-colors cursor-pointer ${
                      isSelected
                        ? "bg-[#CAF0F8]/80 dark:bg-[#03045E]/70 text-[#023E8A] dark:text-[#CAF0F8] font-bold"
                        : "text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-[#0077B6] dark:hover:text-[#48CAE4]"
                    }`}
                  >
                    <span>{lang.label}</span>
                    {isSelected && (
                      <Check className="w-3.5 h-3.5 text-[#0077B6] dark:text-[#48CAE4] shrink-0" />
                    )}
                  </button>
                );
              })
            )}
          </div>
        </div>
      )}
    </div>
  );
};
