"use client";

import React, { useState, useEffect } from "react";
import {
  HallmarkingGuidance,
  HuidValidationResult,
  HallmarkingCentre,
} from "@bis/shared-types";
import { apiClient } from "@bis/api-client";
import { HallmarkingCard, LoadingState } from "@bis/ui";
import {
  Sparkles,
  ShieldCheck,
  Search,
  CheckCircle2,
  AlertTriangle,
  Scale,
  ExternalLink,
  MapPin,
} from "lucide-react";
import { useTranslation } from "@/lib/i18n";

export default function HallmarkingAssistantPage() {
  const { t } = useTranslation();
  const [guidance, setGuidance] = useState<HallmarkingGuidance | null>(null);
  const [inputHuid, setInputHuid] = useState("A1B2C3");
  const [huidResult, setHuidResult] = useState<HuidValidationResult | null>(
    null,
  );
  const [centres, setCentres] = useState<HallmarkingCentre[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      try {
        const g = await apiClient.getHallmarkingGuidance();
        setGuidance(g);

        const v = await apiClient.validateHuid("A1B2C3");
        setHuidResult(v);

        const c = await apiClient.searchHallmarkingCentres();
        setCentres(c);
      } catch (err) {
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };
    loadData();
  }, []);

  const handleValidateHuid = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputHuid.trim()) return;
    try {
      const res = await apiClient.validateHuid(inputHuid);
      setHuidResult(res);
    } catch (err) {
      console.error(err);
    }
  };

  if (isLoading || !guidance) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20">
        <LoadingState
          message={t(
            "hallmarking.loading_msg",
            "Loading Hallmarking Standards & Fineness Schedules...",
          )}
          submessage={t(
            "hallmarking.loading_sub",
            "Retrieving IS 1417 (Gold) and IS 2112 (Silver) statutory markings...",
          )}
        />
      </div>
    );
  }

  return (
    <div className="relative min-h-screen w-full bg-gradient-to-b from-white via-[#CAF0F8]/40 to-[#ADE8F4]/30 dark:from-slate-950 dark:via-[#03045E]/20 dark:to-[#03045E]/40 overflow-hidden">
      {/* Ambient Light Blue Glows */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[850px] h-[320px] bg-[#CAF0F8]/35 dark:bg-[#0077B6]/20 rounded-full blur-3xl pointer-events-none -z-10" />
      <div className="absolute top-1/3 right-10 w-96 h-96 bg-[#ADE8F4]/45 dark:bg-[#48CAE4]/15 rounded-full blur-3xl pointer-events-none -z-10" />
      <div className="absolute bottom-10 left-10 w-96 h-96 bg-[#CAF0F8]/55 dark:bg-[#03045E]/30 rounded-full blur-3xl pointer-events-none -z-10" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10 space-y-10 relative z-10">
        {/* Header Banner in Home Dark Blue Palette */}
        <div className="relative p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-[#03045E] via-[#023E8A] to-[#0077B6] text-white shadow-xl shadow-[#03045E]/15 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 overflow-hidden border border-[#0077B6]/30">
          <div className="absolute -top-12 -right-12 w-80 h-80 bg-[#48CAE4]/20 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute -bottom-12 -left-12 w-80 h-80 bg-[#48CAE4]/15 rounded-full blur-3xl pointer-events-none" />

          <div className="relative space-y-2 z-10">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#0077B6]/40 border border-[#48CAE4]/40 text-[#CAF0F8] text-xs font-semibold backdrop-blur-sm">
              <Sparkles className="w-3.5 h-3.5 text-[#48CAE4]" />
              <span>
                {t("hallmarking.badge", "Precious Metals Purity Assurance")}
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black tracking-tight text-white">
              {t("hallmarking.title_prefix", "Gold & Silver")}{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#CAF0F8] via-[#48CAE4] to-[#48CAE4]">
                {t("hallmarking.title_highlight", "Hallmarking Assistant")}
              </span>
            </h1>
            <p className="text-xs sm:text-sm text-[#ADE8F4]/90 max-w-xl leading-relaxed">
              {t(
                "hallmarking.subtitle",
                "Understand standard fineness grades, verify 6-digit alphanumeric HUID codes, locate Assaying & Hallmarking Centres, and know your statutory compensation rights.",
              )}
            </p>
          </div>

          <div className="relative z-10 p-4 rounded-2xl bg-[#03045E]/70 border border-[#0077B6]/50 text-xs text-[#CAF0F8] max-w-xs space-y-1.5 backdrop-blur-md shadow-inner">
            <div className="font-bold flex items-center justify-center gap-1.5 text-white">
              <ShieldCheck className="w-4 h-4 text-[#48CAE4]" />
              <span>
                {t("hallmarking.mandate_badge", "BIS Hallmarking Mandate")}
              </span>
            </div>
            <p className="text-[11px] text-[#ADE8F4]/90 text-center leading-relaxed">
              {t(
                "hallmarking.mandate_desc",
                "Mandatory hallmarking is operative across notified districts in India. Only 3 marks are permitted on gold jewellery.",
              )}
            </p>
          </div>
        </div>

        {/* 3 Mandatory Marks Section */}
        <div className="space-y-4">
          <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
            <span>
              {t(
                "hallmarking.3marks_title",
                "The 3 Mandatory Marks on Gold Jewellery",
              )}
            </span>
            <span className="text-xs font-medium text-slate-500">
              {t("hallmarking.3marks_note", "(Operative since July 2021)")}
            </span>
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {guidance.threeMandatoryMarks.map((mark) => (
              <div
                key={mark.markNumber}
                className="p-5 rounded-2xl bg-white/95 dark:bg-slate-900/90 backdrop-blur-md border border-[#ADE8F4] dark:border-slate-800 shadow-md shadow-[#0077B6]/5 space-y-2 hover:border-[#48CAE4] transition-all"
              >
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#023E8A] to-[#0077B6] text-white font-bold text-xs flex items-center justify-center shadow-xs">
                  #{mark.markNumber}
                </div>
                <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">
                  {t(`hallmarking.mark${mark.markNumber}_title`, mark.title)}
                </h3>
                <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                  {t(`hallmarking.mark${mark.markNumber}_detail`, mark.detail)}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* HUID Verification Interactive Tool */}
        <div className="p-6 rounded-2xl bg-white/95 dark:bg-slate-900/90 backdrop-blur-md border border-[#ADE8F4] dark:border-slate-800 shadow-md shadow-[#0077B6]/5 space-y-5">
          <div className="border-b border-slate-100 dark:border-slate-800 pb-3">
            <span className="text-[11px] font-bold text-[#0077B6] dark:text-[#48CAE4] uppercase tracking-wider">
              {t("hallmarking.verify_tag", "Consumer Verification Tool")}
            </span>
            <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100 mt-0.5">
              {t(
                "hallmarking.verify_title",
                "Verify 6-Digit Alphanumeric HUID Structure",
              )}
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              {t(
                "hallmarking.verify_subtitle",
                "Test and inspect any 6-digit laser-marked HUID code before buying jewellery.",
              )}
            </p>
          </div>

          <form
            onSubmit={handleValidateHuid}
            className="flex flex-col sm:flex-row gap-3 max-w-xl"
          >
            <input
              type="text"
              maxLength={6}
              value={inputHuid}
              onChange={(e) => setInputHuid(e.target.value.toUpperCase())}
              placeholder={t(
                "hallmarking.verify_placeholder",
                "Enter 6-character HUID (e.g. A1B2C3)",
              )}
              className="flex-1 px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white/50 dark:bg-slate-800/50 text-sm font-mono font-bold tracking-widest text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-[#0077B6] uppercase"
            />
            <button
              type="submit"
              className="px-6 py-2.5 rounded-xl text-xs font-bold bg-gradient-to-r from-[#023E8A] via-[#0077B6] to-[#0077B6] hover:from-[#03045E] hover:to-[#023E8A] text-white shadow-md shadow-[#0077B6]/25 transition-all cursor-pointer"
            >
              {t("hallmarking.btn_validate", "Validate Format")}
            </button>
          </form>

          {huidResult && (
            <div className="p-4 rounded-xl bg-[#CAF0F8]/40 dark:bg-[#03045E]/40 border border-[#ADE8F4] dark:border-slate-800 space-y-3">
              <div className="flex items-center gap-2">
                {huidResult.isValidFormat ? (
                  <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                ) : (
                  <AlertTriangle className="w-5 h-5 text-rose-600" />
                )}
                <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100">
                  {huidResult.explanation}
                </h3>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs pt-2">
                <div className="space-y-1.5">
                  <h4 className="font-semibold text-slate-800 dark:text-slate-200">
                    {t(
                      "hallmarking.verify_howto",
                      "How to verify this on BIS Care App:",
                    )}
                  </h4>
                  <ul className="space-y-1 text-slate-600 dark:text-slate-400">
                    {huidResult.howToVerifyOnBisCare.map((step, idx) => (
                      <li key={idx}>{step}</li>
                    ))}
                  </ul>
                </div>

                <div className="space-y-1.5">
                  <h4 className="font-semibold text-slate-800 dark:text-slate-200">
                    {t(
                      "hallmarking.verify_safety",
                      "Consumer Safety & Rights Tips:",
                    )}
                  </h4>
                  <ul className="space-y-1 text-slate-600 dark:text-slate-400">
                    {huidResult.consumerSafetyTips.map((tip, idx) => (
                      <li key={idx}>• {tip}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Purity Fineness Grades Grid */}
        <div className="space-y-4">
          <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100">
            {t(
              "hallmarking.grades_title",
              "Official Gold & Silver Fineness Grades (IS 1417 & IS 2112)",
            )}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {guidance.purityGrades.map((grade, idx) => (
              <HallmarkingCard key={idx} purity={grade} />
            ))}
          </div>
        </div>

        {/* Compensation Policy Banner in Palette */}
        <div className="p-6 rounded-2xl bg-gradient-to-r from-[#03045E] via-[#023E8A] to-[#0077B6] border border-[#0077B6]/30 text-white shadow-xl shadow-[#03045E]/15 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="space-y-1.5">
            <div className="flex items-center gap-2 text-[#48CAE4] font-bold text-sm">
              <Scale className="w-4 h-4 text-[#CAF0F8]" />
              {t("hallmarking.comp_badge","Statutory 2X Compensation Policy")}
            </div>
            <h3 className="text-lg font-bold text-white">
              {t("hallmarking.comp_title","Consumer Protection Guarantee")}
            </h3>
            <p className="text-xs text-[#CAF0F8]/90 max-w-2xl leading-relaxed">
              {guidance.compensationPolicy}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
