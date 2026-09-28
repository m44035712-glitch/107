"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { LanguageSelector } from "@bis/ui";
import { useTranslation } from "@/lib/i18n";
import {
  MessageSquare,
  Home,
  Award,
  FileBarChart2,
  Mail,
  Menu,
  X,
  Compass,
  FlaskConical,
  SunMedium,
  MoonStar,
  UserCircle2,
} from "lucide-react";
import Image from "next/image";

export function Header() {
  const pathname = usePathname();
  const isDarkShell = true;
  const { t, language: selectedLanguage, setLanguage: setSelectedLanguage } = useTranslation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const [isScrolled, setIsScrolled] = useState(false);
  const [theme, setTheme] = useState<"light" | "dark">("light");

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const savedTheme = window.localStorage.getItem("sentinelx-theme");
    const preferredDark =
      savedTheme === "dark" ||
      (!savedTheme && window.matchMedia("(prefers-color-scheme: dark)").matches);
    const nextTheme = preferredDark ? "dark" : "light";
    setTheme(nextTheme);
    document.documentElement.classList.toggle("dark", preferredDark);
  }, []);

  useEffect(() => {
    document.documentElement.classList.toggle("dark", theme === "dark");
    window.localStorage.setItem("sentinelx-theme", theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme((current) => (current === "dark" ? "light" : "dark"));
  };

  const navLinks = [
    { href: "/", label: t("nav.home", "Home"), icon: Home },
    { href: "/standards/recommend", label: t("nav.guidance", "Guidance"), icon: Compass },
    { href: "/application", label: t("nav.application", "Application"), icon: MessageSquare },
    { href: "/laboratories", label: t("nav.lab", "Lab"), icon: FlaskConical },
    { href: "/certification", label: t("nav.certification", "Certification"), icon: Award },
    { href: "/reports", label: t("nav.report", "Report"), icon: FileBarChart2 },
    { href: "/contact-us", label: t("nav.contact_us", "Contact BIS"), icon: Mail },
  ];

  return (
    <header
      className={`sticky top-0 z-50 transition-all duration-300 backdrop-blur-xl supports-[backdrop-filter]:bg-white/70 dark:supports-[backdrop-filter]:bg-slate-900/75 backdrop-saturate-180 ${isDarkShell ? "bg-[#05072e]/95 border-b border-[#12304A] shadow-sm shadow-black/20" : isScrolled ? "bg-white/80 dark:bg-slate-900/85 border-b border-slate-200/80 dark:border-slate-800/80 shadow-sm shadow-[#03045E]/5" : "bg-white/60 dark:bg-slate-900/60 border-b border-slate-200/40 dark:border-slate-800/40"}`}
    >
      {/* Main Nav Bar */}
      <div className="max-w-[1520px] mx-auto px-3 sm:px-5 lg:px-6">
        <div className="flex items-center justify-between h-16 gap-2">
          {/* Logo & Title */}
          <Link
            href="/"
            className="flex items-center gap-2.5 shrink-0 group mr-1"
          >
            <div className="hidden sm:flex flex-col items-center gap-y-1">
              <div className="flex items-center gap-1">
                <div className="shrink-0">
                  <Image
                    src={"/BIS-LOGO.png"}
                    alt="BIS-LOGO"
                    height={34}
                    width={34}
                    priority
                  />
                </div>
                <span className={`text-sm font-black tracking-tight whitespace-nowrap ${isDarkShell ? "text-[#d9f6ff]" : "text-slate-900 dark:text-slate-100"}`}>
                  BIS{" "}
                  <span className="text-[#0077B6] dark:text-[#48CAE4] font-extrabold">
                    SentinelX
                  </span>
                </span>
              </div>
              <p className={`text-[10px] font-medium leading-none whitespace-nowrap ${isDarkShell ? "text-[#789ab0]" : "text-slate-500"}`}>
                {t("header.subtitle", "Indian Standards Intelligence")}
              </p>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-0.5 xl:gap-1.5 flex-nowrap">
            {navLinks.map((link) => {
              const isActive = pathname === link.href;
              const Icon = link.icon;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`inline-flex items-center gap-1 xl:gap-1.5 px-2 xl:px-2.5 py-1.5 rounded-xl text-[11px] xl:text-xs font-semibold whitespace-nowrap transition-all duration-200 ${isDarkShell ? isActive ? "bg-[#023E8A] text-[#d9f6ff] font-bold border border-[#0077B6]" : "text-[#9dc5dc] hover:text-[#48CAE4] hover:bg-[#12304A]" : isActive ? "bg-gradient-to-r from-[#CAF0F8] to-[#ADE8F4]/70 dark:from-[#03045E]/80 dark:to-[#023E8A]/60 text-[#023E8A] dark:text-[#CAF0F8] font-bold border border-[#ADE8F4] dark:border-[#0077B6]/40 shadow-xs" : "text-slate-700 dark:text-slate-300 hover:text-[#0077B6] dark:hover:text-white hover:bg-[#CAF0F8]/40 dark:hover:bg-slate-800/80"}`}
                >
                  <Icon
                    className={`w-3.5 h-3.5 shrink-0 ${
                      isActive
                        ? isDarkShell ? "text-[#48CAE4]" : "text-[#0077B6] dark:text-[#48CAE4]"
                        : isDarkShell ? "text-[#789ab0]" : "text-slate-500 dark:text-slate-400"
                    }`}
                  />
                  <span>{link.label}</span>
                </Link>
              );
            })}
          </nav>

          <div className="flex items-center gap-1.5 sm:gap-2 shrink-0 ml-1">
            <button
              type="button"
              onClick={toggleTheme}
              aria-label="Toggle dark mode"
              className={`hidden sm:inline-flex h-9 w-9 items-center justify-center rounded-xl shadow-sm transition ${isDarkShell ? "border border-[#12304A] bg-[#10283c] text-[#d9f6ff] hover:border-[#0077B6] hover:text-[#48CAE4]" : "border border-slate-200 bg-white/80 text-slate-700 hover:border-sky-200 hover:text-sky-700 dark:border-slate-700 dark:bg-slate-900/80 dark:text-slate-200 dark:hover:border-sky-500 dark:hover:text-sky-300"}`}
            >
              {theme === "dark" ? <SunMedium className="h-4 w-4" /> : <MoonStar className="h-4 w-4" />}
            </button>

            <LanguageSelector
              onDashboard={true}
              selectedLanguage={selectedLanguage}
              onLanguageChange={setSelectedLanguage}
              className={isDarkShell ? "[&>button]:!border-[#12304A] [&>button]:!bg-[#10283c] [&>button]:!text-[#d9f6ff] [&>button]:hover:!bg-[#12304A]" : ""}
            />

            <Link
              href="/login"
              aria-label={t("nav.profile", "Profile")}
              title={t("nav.profile", "Profile")}
              className={`inline-flex h-9 w-9 items-center justify-center rounded-xl shadow-sm transition ${isDarkShell ? "border border-[#12304A] bg-[#10283c] text-[#d9f6ff] hover:border-[#0077B6] hover:text-[#48CAE4]" : "border border-slate-200 bg-white/80 text-slate-700 hover:border-sky-200 hover:text-sky-700 dark:border-slate-700 dark:bg-slate-900/80 dark:text-slate-200 dark:hover:border-sky-500 dark:hover:text-slate-300"}`}
            >
              <UserCircle2 className="h-4 w-4" />
            </Link>

            {/* Action Button & Mobile Toggle */}
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={toggleTheme}
                className="sm:hidden inline-flex h-9 w-9 items-center justify-center rounded-lg border border-slate-200 bg-white/80 text-slate-700 dark:border-slate-700 dark:bg-slate-900/80 dark:text-slate-200"
                aria-label="Toggle dark mode"
              >
                {theme === "dark" ? <SunMedium className="h-4 w-4" /> : <MoonStar className="h-4 w-4" />}
              </button>

              <button
                type="button"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="lg:hidden p-2 rounded-lg text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
                aria-label="Toggle navigation menu"
              >
                {mobileMenuOpen ? (
                  <X className="w-5 h-5" />
                ) : (
                  <Menu className="w-5 h-5" />
                )}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 px-4 pt-2 pb-4 space-y-1 shadow-lg">
          {navLinks.map((link) => {
            const isActive = pathname === link.href;
            const Icon = link.icon;
            return (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className={`flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm font-medium ${
                  isActive
                    ? "bg-[#CAF0F8]/80 text-[#023E8A] dark:bg-[#03045E]/60 dark:text-[#CAF0F8] font-bold border border-[#ADE8F4]"
                    : "text-slate-700 dark:text-slate-300 hover:bg-[#CAF0F8]/30 dark:hover:bg-slate-800"
                }`}
              >
                <Icon className="w-4 h-4 text-[#0077B6]" />
                <span>{link.label}</span>
              </Link>
            );
          })}

          <div className="pt-3 pb-1 flex items-center justify-between border-t border-slate-200 dark:border-slate-800">
            <span className="text-xs font-semibold text-slate-500">
              {t("chat.language_label", "Language:")}
            </span>
            <LanguageSelector
              selectedLanguage={selectedLanguage}
              onLanguageChange={(lang) => {
                setSelectedLanguage(lang);
                setMobileMenuOpen(false);
              }}
            />
          </div>

        </div>
      )}
    </header>
  );
}
