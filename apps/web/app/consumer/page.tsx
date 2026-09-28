"use client";

import React, { useState } from "react";
import { IsiVerificationResult, ProductProfileQuery, ProductRecommendationResult } from "@bis/shared-types";
import { apiClient } from "@bis/api-client";
import { useTranslation } from "@/lib/i18n";
import {
  ShieldCheck,
  CheckCircle2,
  AlertTriangle,
  PhoneCall,
  ExternalLink,
  HelpCircle,
  FileWarning,
  Compass,
} from "lucide-react";

export default function ConsumerHubPage() {
  const { t } = useTranslation();
  const [cmlInput, setCmlInput] = useState("1454301");
  const [verificationResult, setVerificationResult] =
    useState<IsiVerificationResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [profile, setProfile] = useState<ProductProfileQuery>({
    productName: "",
    material: "",
    intendedApplication: "",
    industry: "",
    capacity: "",
    technicalCharacteristics: "",
  });
  const [profileResult, setProfileResult] = useState<ProductRecommendationResult | null>(null);
  const [profileLoading, setProfileLoading] = useState(false);

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!cmlInput.trim()) return;
    setIsLoading(true);
    try {
      const res = await apiClient.verifyIsiMark(cmlInput);
      setVerificationResult(res);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleProfileSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!profile.productName.trim()) return;
    setProfileLoading(true);
    try {
      setProfileResult(await apiClient.recommendStandards(profile));
    } catch (err) {
      console.error(err);
      setProfileResult(null);
    } finally {
      setProfileLoading(false);
    }
  };

  const categories = [
    t("consumer.cat_packaged_water", "Packaged Drinking Water"),
    t("consumer.cat_steel_tmt", "TMT Steel Bars"),
    t("consumer.cat_cement", "Portland Cement"),
    t("consumer.cat_lpg_cylinders", "LPG Regulators & Cylinders"),
    t("consumer.cat_infant_formula", "Infant Formula"),
    t("consumer.cat_gold", "Gold Jewellery (HUID)"),
    t("consumer.cat_immersion_heaters", "Electric Immersion Heaters"),
    t("consumer.cat_auto_tyres", "Automobile Tyres"),
  ];

  return (
    <div className="relative min-h-screen w-full bg-gradient-to-b from-white via-[#CAF0F8]/40 to-[#ADE8F4]/30 dark:from-slate-950 dark:via-[#03045E]/20 dark:to-[#03045E]/40 overflow-hidden">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[850px] h-[320px] bg-[#CAF0F8]/35 dark:bg-[#0077B6]/20 rounded-full blur-3xl pointer-events-none -z-10" />
      <div className="absolute top-1/3 right-10 w-96 h-96 bg-[#ADE8F4]/45 dark:bg-[#48CAE4]/15 rounded-full blur-3xl pointer-events-none -z-10" />
      <div className="absolute bottom-10 left-10 w-96 h-96 bg-[#CAF0F8]/55 dark:bg-[#03045E]/30 rounded-full blur-3xl pointer-events-none -z-10" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10 space-y-10 relative z-10">
        {/* Header Banner */}
        <div className="relative p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-[#03045E] via-[#023E8A] to-[#0077B6] text-white shadow-xl shadow-[#03045E]/15 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 overflow-hidden border border-[#0077B6]/30">
          <div className="absolute -top-12 -right-12 w-80 h-80 bg-[#48CAE4]/20 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute -bottom-12 -left-12 w-80 h-80 bg-[#48CAE4]/15 rounded-full blur-3xl pointer-events-none" />

          <div className="relative space-y-2 z-10">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#0077B6]/40 border border-[#48CAE4]/40 text-[#CAF0F8] text-xs font-semibold backdrop-blur-sm">
              <ShieldCheck className="w-3.5 h-3.5 text-[#48CAE4]" />
              <span>
                {t("consumer.badge", "Citizen & Consumer Protection")}
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black tracking-tight text-white">
              {t("consumer.title_prefix", "Consumer Safety &")}{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#CAF0F8] via-[#48CAE4] to-[#48CAE4]">
                {t("consumer.title_highlight", "ISI Mark Verification Hub")}
              </span>
            </h1>
            <p className="text-xs sm:text-sm text-[#ADE8F4]/90 max-w-xl leading-relaxed">
              {t(
                "consumer.subtitle",
                "Verify genuine ISI Mark Certification Marks Licence (CM/L) numbers, detect counterfeit markings, and access official grievance channels.",
              )}
            </p>
          </div>

          <div className="relative z-10 p-4 rounded-2xl bg-[#03045E]/70 border border-[#0077B6]/50 text-xs text-[#CAF0F8] max-w-xs space-y-1.5 backdrop-blur-md shadow-inner">
            <div className="font-bold flex items-center gap-1.5 text-white">
              <PhoneCall className="w-4 h-4 text-[#48CAE4]" />
              <span>
                {t("consumer.helpline_badge", "Toll-Free Consumer Helpline")}
              </span>
            </div>
            <p className="text-lg font-black text-white tracking-wide">
              {t("consumer.helpline_number", "1800-11-4000")}
            </p>
          </div>
        </div>

        {/* Product guidance and consumer verification are combined on this page. */}
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-12">
          <div className="lg:col-span-5 rounded-2xl border border-[#ADE8F4] bg-white/95 p-6 shadow-md shadow-[#0077B6]/5 dark:border-slate-800 dark:bg-slate-900/90">
            <div className="mb-5 border-b border-slate-100 pb-3 dark:border-slate-800">
              <span className="text-[11px] font-bold uppercase tracking-wider text-[#0077B6] dark:text-[#48CAE4]">AI Product Scope Profiler</span>
              <h2 className="mt-1 text-xl font-bold text-slate-900 dark:text-slate-100">Find Applicable Indian Standard</h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">Enter product details to identify potentially applicable BIS standards.</p>
            </div>
            <form onSubmit={handleProfileSubmit} className="space-y-3 text-xs">
              {([
                ["productName", "Product Name / Type", "e.g. Stainless steel water bottle, PVC insulated cable, TMT bar"],
                ["material", "Raw Material Composition", "e.g. SS 304, Aluminium alloy, High density polyethylene"],
                ["intendedApplication", "Intended Application / Usage", "e.g. Drinking water storage, building construction"],
                ["industry", "Industry / Domain Sector", "e.g. Metallurgical, Food & Agriculture, Civil, Electrical"],
                ["capacity", "Capacity / Size", "e.g. 750 ml / 1000 ml, 1.1kV, 12mm"],
              ] as const).map(([field, label, placeholder]) => (
                <label key={field} className="block font-semibold text-slate-700 dark:text-slate-300">
                  {label}
                  <input value={profile[field]} onChange={(event) => setProfile({ ...profile, [field]: event.target.value })} placeholder={placeholder} className="mt-1 w-full rounded-xl border border-slate-300 bg-transparent px-3.5 py-2 text-xs font-normal text-slate-900 outline-none focus:border-[#0077B6] focus:ring-2 focus:ring-[#48CAE4] dark:border-slate-700 dark:text-slate-100" />
                </label>
              ))}
              <label className="block font-semibold text-slate-700 dark:text-slate-300">
                Technical Specifications
                <textarea value={profile.technicalCharacteristics} onChange={(event) => setProfile({ ...profile, technicalCharacteristics: event.target.value })} rows={3} placeholder="e.g. Voltage rating 1.1kV, double wall vacuum insulation, diameter 12mm Fe 500D" className="mt-1 w-full rounded-xl border border-slate-300 bg-transparent px-3.5 py-2 text-xs font-normal text-slate-900 outline-none focus:border-[#0077B6] focus:ring-2 focus:ring-[#48CAE4] dark:border-slate-700 dark:text-slate-100" />
              </label>
              <button type="submit" disabled={profileLoading || !profile.productName.trim()} className="w-full rounded-xl bg-gradient-to-r from-[#023E8A] via-[#0077B6] to-[#0077B6] px-4 py-3 text-xs font-bold text-white shadow-md shadow-[#0077B6]/25 transition hover:from-[#03045E] hover:to-[#023E8A] disabled:cursor-not-allowed disabled:opacity-50">
                {profileLoading ? "Evaluating..." : "Evaluate Applicable Standards"}
              </button>
            </form>
          </div>

          <div className="lg:col-span-7">
            <div className="mb-3 flex items-center gap-2">
              <Compass className="h-4 w-4 text-[#0077B6] dark:text-[#48CAE4]" />
              <h2 className="text-base font-bold text-slate-900 dark:text-slate-100">Evaluated Indian Standards</h2>
            </div>
            {profileResult && profileResult.matches.length > 0 ? (
              <div className="space-y-3">
                {profileResult.matches.map((match, index) => (
                  <div key={`${match.standard.standardNumber}-${index}`} className="rounded-2xl border border-[#ADE8F4] bg-white/95 p-5 shadow-md shadow-[#0077B6]/5 dark:border-slate-800 dark:bg-slate-900/90">
                    <p className="text-sm font-bold text-[#0077B6] dark:text-[#48CAE4]">{match.standard.standardNumber}</p>
                    <h3 className="mt-1 font-bold text-slate-900 dark:text-slate-100">{match.standard.title}</h3>
                    <p className="mt-2 text-xs text-slate-600 dark:text-slate-300">{match.matchReason}</p>
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex min-h-[280px] items-center justify-center rounded-2xl border border-[#ADE8F4] bg-white/95 p-8 text-center shadow-md shadow-[#0077B6]/5 dark:border-slate-800 dark:bg-slate-900/90">
                <div><Compass className="mx-auto h-10 w-10 text-slate-300 dark:text-slate-600" /><p className="mt-3 text-sm font-bold text-slate-900 dark:text-slate-100">No Profile Evaluated Yet</p><p className="mt-1 text-xs text-slate-500 dark:text-slate-400">Fill in the product details and evaluate applicable standards.</p></div>
              </div>
            )}
          </div>
        </div>

        {/* ISI Mark Verification Box */}
        <div className="p-6 rounded-2xl bg-white/95 dark:bg-slate-900/90 backdrop-blur-md border border-[#ADE8F4] dark:border-slate-800 shadow-md shadow-[#0077B6]/5 space-y-5">
          <div className="border-b border-slate-100 dark:border-slate-800 pb-3">
            <span className="text-[11px] font-bold text-[#0077B6] dark:text-[#48CAE4] uppercase tracking-wider">
              {t("consumer.verify_tag", "Licence Authentication")}
            </span>
            <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100 mt-0.5">
              {t("consumer.verify_title", "Verify ISI Mark CM/L Number")}
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              {t(
                "consumer.verify_subtitle",
                "Enter the 7 or 8-digit numeric licence code printed beneath the ISI triangular logo.",
              )}
            </p>
          </div>

          <form
            onSubmit={handleVerify}
            className="flex flex-col sm:flex-row gap-3 max-w-xl"
          >
            <input
              type="text"
              value={cmlInput}
              onChange={(e) => setCmlInput(e.target.value)}
              placeholder={t(
                "consumer.verify_placeholder",
                "Enter 7 or 8-digit CM/L Number (e.g. 1454301)",
              )}
              className="flex-1 px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white/50 dark:bg-slate-800/50 text-sm font-mono font-bold text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-[#0077B6]"
            />
            <button
              type="submit"
              disabled={isLoading}
              className="px-6 py-2.5 rounded-xl text-xs font-bold bg-gradient-to-r from-[#023E8A] via-[#0077B6] to-[#0077B6] hover:from-[#03045E] hover:to-[#023E8A] text-white shadow-md shadow-[#0077B6]/25 transition-all cursor-pointer disabled:opacity-50"
            >
              {t("consumer.btn_check", "Check Licence Structure")}
            </button>
          </form>

          {verificationResult && (
            <div className="p-5 rounded-xl bg-[#CAF0F8]/30 dark:bg-slate-800/50 border border-[#ADE8F4] dark:border-slate-700 space-y-4">
              <div className="flex items-center gap-2">
                {verificationResult.isValidFormat ? (
                  <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                ) : (
                  <AlertTriangle className="w-5 h-5 text-rose-600" />
                )}
                <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100">
                  {verificationResult.cmlNumber} —{" "}
                  {verificationResult.validityStatus}
                </h3>
              </div>

              <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                {verificationResult.guidance}
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs pt-2">
                <div className="p-3.5 rounded-lg bg-white dark:bg-slate-800 border border-[#ADE8F4]/60 dark:border-slate-700 space-y-1.5 shadow-2xs">
                  <h4 className="font-semibold text-emerald-700 dark:text-emerald-400 flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5" />{" "}
                    {t(
                      "consumer.checklist_auth",
                      "Authenticity Verification Checklist:",
                    )}
                  </h4>
                  <ul className="space-y-1 text-slate-600 dark:text-slate-400">
                    {verificationResult.authenticityChecklist.map((item, i) => (
                      <li key={i} className="flex items-start gap-1.5">
                        <span className="text-emerald-500 font-bold">•</span>
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="p-3.5 rounded-lg bg-white dark:bg-slate-800 border border-[#ADE8F4]/60 dark:border-slate-700 space-y-1.5 shadow-2xs">
                  <h4 className="font-semibold text-rose-700 dark:text-rose-400 flex items-center gap-1.5">
                    <FileWarning className="w-3.5 h-3.5" />{" "}
                    {t(
                      "consumer.checklist_fraud",
                      "Red Flag Fraud Indicators:",
                    )}
                  </h4>
                  <ul className="space-y-1 text-slate-600 dark:text-slate-400">
                    {verificationResult.fraudIndicators.map((fraud, i) => (
                      <li key={i} className="flex items-start gap-1.5">
                        <span className="text-rose-500 font-bold">•</span>
                        <span>{fraud}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              <div className="pt-2">
                <a
                  href={verificationResult.bisCareAppLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 text-xs font-semibold text-[#0077B6] dark:text-[#48CAE4] hover:underline"
                >
                  <span>
                    {t(
                      "consumer.link_biscare",
                      "Download Official BIS Care Citizen App",
                    )}
                  </span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>
            </div>
          )}
        </div>

        {/* Redressal Steps & Guidelines */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="p-6 rounded-2xl bg-white/95 dark:bg-slate-900/90 backdrop-blur-md border border-[#ADE8F4] dark:border-slate-800 shadow-md shadow-[#0077B6]/5 space-y-3">
            <h3 className="text-base font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-[#0077B6] dark:text-[#48CAE4]" />
              <span>
                {t(
                  "consumer.complaint_title",
                  "How to Lodge a Counterfeit Complaint",
                )}
              </span>
            </h3>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              {t(
                "consumer.complaint_desc",
                "If you encounter a substandard product or fake ISI/Hallmark, you can submit an anonymous report directly to the BIS Enforcement Branch via the BIS Care App or e-BIS portal.",
              )}
            </p>
            <ul className="space-y-1.5 text-xs text-slate-600 dark:text-slate-400 pt-2">
              <li>
                {t(
                  "consumer.complaint_step1",
                  "1. Capture clear photos of the product and packaging.",
                )}
              </li>
              <li>
                {t(
                  "consumer.complaint_step2",
                  "2. Preserve retail cash memo / GST invoice.",
                )}
              </li>
              <li>
                {t(
                  "consumer.complaint_step3",
                  "3. Submit complaint with retailer address on BIS Care App.",
                )}
              </li>
            </ul>
          </div>

          <div className="p-6 rounded-2xl bg-white/95 dark:bg-slate-900/90 backdrop-blur-md border border-[#ADE8F4] dark:border-slate-800 shadow-md shadow-[#0077B6]/5 space-y-3">
            <h3 className="text-base font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
              <HelpCircle className="w-4 h-4 text-[#0077B6] dark:text-[#48CAE4]" />
              <span>
                {t(
                  "consumer.categories_title",
                  "Key Mandatory Consumer Categories",
                )}
              </span>
            </h3>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              {t(
                "consumer.categories_desc",
                "Products that strictly require the ISI Mark before retail sale in India:",
              )}
            </p>
            <div className="flex flex-wrap gap-1.5 pt-1 text-[11px]">
              {categories.map((cat, i) => (
                <span
                  key={i}
                  className="px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-medium"
                >
                  {cat}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
