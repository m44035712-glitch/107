"use client";

import React, { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import {
  ProductComplianceReport,
  ProductProfileQuery,
} from "@bis/shared-types";
import { apiClient } from "@bis/api-client";
import { AshokaMotif, LoadingState } from "@bis/ui";
import { useTranslation } from "@/lib/i18n";
import {
  Printer,
  Download,
  FileBarChart2,
  ShieldCheck,
  CheckCircle2,
  AlertTriangle,
  FileText,
  Building2,
  FlaskConical,
  Award,
  ExternalLink,
} from "lucide-react";
import Image from "next/image";

function ComplianceReportsContent() {
  const { t } = useTranslation();
  const searchParams = useSearchParams();
  const productParam =
    searchParams.get("product") ||
    "Stainless Steel Vacuum Insulated Water Bottle";
  const stdParam = searchParams.get("std") || "IS 17526:2021";

  const [report, setReport] = useState<ProductComplianceReport | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchReport = async () => {
      setIsLoading(true);
      try {
        const query: ProductProfileQuery = {
          productName: productParam,
          material: "Food Grade Stainless Steel SS 304 / 316",
          intendedApplication: "Domestic & commercial liquid storage",
          industry: "Utensils and Metal Fabrication",
        };
        const data = await apiClient.generateComplianceReport(query);
        setReport(data);
      } catch (err) {
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchReport();
  }, [productParam, stdParam]);

  const handlePrint = () => {
    window.print();
  };

  if (isLoading || !report) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20">
        <LoadingState
          message={t(
            "reports.loading_msg",
            "Synthesizing BIS Compliance Assessment Report...",
          )}
          submessage={t(
            "reports.loading_sub",
            "Compiling applicable standards, testing schedules, laboratory options, and statutory evidence...",
          )}
        />
      </div>
    );
  }

  return (
    <div className="relative min-h-screen w-full bg-gradient-to-b from-[#03045E] via-[#023E8A] to-[#03045E] dark:from-slate-950 dark:via-[#03045E]/90 dark:to-slate-950 overflow-hidden text-white print:bg-white print:text-slate-900">
      {/* Ambient Glowing Blobs (hidden in print) */}
      <div className="absolute top-12 left-1/2 -translate-x-1/2 w-[700px] h-[350px] bg-[#48CAE4]/15 rounded-full blur-3xl pointer-events-none animate-pulse print:hidden" />
      <div className="absolute top-0 right-10 w-80 h-80 bg-[#0077B6]/20 rounded-full blur-3xl pointer-events-none print:hidden" />
      <div className="absolute bottom-0 left-10 w-80 h-80 bg-[#48CAE4]/15 rounded-full blur-3xl pointer-events-none print:hidden" />

      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-10 space-y-8 relative z-10 print:p-0">
        {/* Top Action Bar in Dark Scheme (hidden in print) */}
        <div className="flex items-center justify-between print:hidden">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 dark:bg-white/10 text-[#CAF0F8] text-xs font-semibold border border-[#48CAE4]/30 backdrop-blur-md shadow-2xs">
              <FileBarChart2 className="w-3.5 h-3.5 text-[#48CAE4]" />
              <span>{t("reports.badge", "Decision Support Deliverable")}</span>
            </div>
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black text-white tracking-tight">
              {t("reports.title", "BIS Compliance Roadmap Report")}
            </h1>
          </div>

          <button
            type="button"
            onClick={handlePrint}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold bg-gradient-to-r from-[#0077B6] via-[#48CAE4] to-[#48CAE4] hover:from-[#0077B6] hover:to-[#48CAE4] text-slate-950 hover:text-white shadow-lg shadow-[#03045E]/40 transition-all cursor-pointer"
          >
            <Printer className="w-4 h-4" />
            <span>{t("reports.btn_print", "Print / Save as PDF")}</span>
          </button>
        </div>

        {/* Printable Report Document Card */}
        <div className="p-8 sm:p-12 rounded-2xl bg-white dark:bg-slate-900 border border-white/20 dark:border-slate-800 shadow-2xl space-y-8 text-slate-900 dark:text-slate-100 print:border-none print:shadow-none print:p-0">
          {/* Document Header with Ashoka Emblem Motif */}
          <div className="border-b-2 border-slate-900 dark:border-slate-100 pb-6 flex items-start justify-between">
            <div className="space-y-1">
              <div className="flex items-center gap-2 text-blue-800 dark:text-blue-400 font-bold text-xs uppercase tracking-wider">
                {/* <AshokaMotif size={24} /> */}
                <Image
                  src={"/BIS-LOGO.png"}
                  alt="BIS-LOGO"
                  height={24}
                  width={24}
                />
                <span>
                  {t(
                    "reports.doc_header",
                    "Government Compliance Assessment Document",
                  )}
                </span>
              </div>
              <h2 className="text-2xl font-black tracking-tight">
                {t(
                  "reports.doc_title",
                  "BIS Product Compliance & Conformity Roadmap",
                )}
              </h2>
              <p className="text-xs text-slate-500 font-mono">
                Report ID: {report.id} • Generated: {report.generationDate}
              </p>
            </div>

            <div className="text-right text-xs">
              <span className="font-bold px-2 py-1 rounded bg-blue-50 dark:bg-blue-950 text-blue-700 dark:text-blue-300 border border-blue-200">
                {report.manufacturerType}
              </span>
            </div>
          </div>

          {/* 1. Product Profile */}
          <div className="space-y-2">
            <h3 className="text-sm font-bold uppercase tracking-wider text-blue-800 dark:text-blue-400">
              {t("reports.section1", "1. Target Product Profile")}
            </h3>
            <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-700 text-xs grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <span className="font-semibold text-slate-500 block">
                  {t("reports.label_product", "Product Evaluated:")}
                </span>
                <span className="font-bold text-sm">{report.productName}</span>
              </div>
              <div>
                <span className="font-semibold text-slate-500 block">
                  {t(
                    "reports.label_primarystd",
                    "Primary Applicable Standard:",
                  )}
                </span>
                <span className="font-bold text-sm text-blue-700 dark:text-blue-300">
                  {report.applicableStandards[0]?.standardNumber || stdParam}
                </span>
              </div>
            </div>
          </div>

          {/* 2. Applicable Indian Standards */}
          <div className="space-y-2">
            <h3 className="text-sm font-bold uppercase tracking-wider text-blue-800 dark:text-blue-400">
              {t(
                "reports.section2",
                "2. Applicable Indian Standards & QCO Mandates",
              )}
            </h3>
            <div className="space-y-2">
              {report.applicableStandards.map((std, i) => (
                <div
                  key={i}
                  className="p-3.5 rounded-xl border border-slate-200 dark:border-slate-700 text-xs space-y-1"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-sm">
                      {std.standardNumber} — {std.title}
                    </span>
                    {std.isMandatory && (
                      <span className="px-2 py-0.5 rounded bg-amber-50 text-amber-700 font-semibold text-[10px]">
                        {t("reports.tag_mandatory", "Mandatory QCO Order")}
                      </span>
                    )}
                  </div>
                  <p className="text-slate-600 dark:text-slate-400">
                    {t("reports.label_regulatory", "Regulatory Notification:")}{" "}
                    {std.qcoDetails}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* 3. Certification Scheme Overview */}
          <div className="space-y-2">
            <h3 className="text-sm font-bold uppercase tracking-wider text-blue-800 dark:text-blue-400">
              {t("reports.section3", "3. Applicable BIS Certification Scheme")}
            </h3>
            <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-700 text-xs space-y-2">
              <h4 className="font-bold text-sm">
                {report.certificationScheme.name}
              </h4>
              <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
                {report.certificationScheme.description}
              </p>
              <div className="pt-2 flex flex-wrap gap-4 text-[11px] text-slate-500">
                <span>
                  <strong>{t("reports.label_validity", "Validity:")}</strong>{" "}
                  {report.certificationScheme.validityPeriod}
                </span>
                <span>
                  <strong>
                    {t("reports.label_surveillance", "Surveillance:")}
                  </strong>{" "}
                  {report.certificationScheme.surveillanceFrequency}
                </span>
              </div>
            </div>
          </div>

          {/* 4. Mandatory Testing Checklist */}
          <div className="space-y-2">
            <h3 className="text-sm font-bold uppercase tracking-wider text-blue-800 dark:text-blue-400">
              {t(
                "reports.section4",
                "4. Mandatory Testing Requirements & Sampling Criteria",
              )}
            </h3>
            <div className="border border-slate-200 dark:border-slate-700 rounded-xl overflow-hidden text-xs">
              <table className="w-full text-left border-collapse">
                <thead className="bg-slate-100 dark:bg-slate-800 font-bold text-slate-700 dark:text-slate-200">
                  <tr>
                    <th className="p-3 border-b border-slate-200 dark:border-slate-700">
                      {t("reports.col_test", "Test Parameter")}
                    </th>
                    <th className="p-3 border-b border-slate-200 dark:border-slate-700">
                      {t("reports.col_clause", "Standard Clause")}
                    </th>
                    <th className="p-3 border-b border-slate-200 dark:border-slate-700">
                      {t("reports.col_type", "Type")}
                    </th>
                    <th className="p-3 border-b border-slate-200 dark:border-slate-700">
                      {t("reports.col_sampling", "Sampling Rule")}
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
                  {report.testingChecklist.map((test, i) => (
                    <tr key={i}>
                      <td className="p-3 font-semibold">{test.testName}</td>
                      <td className="p-3 font-mono">{test.clause}</td>
                      <td className="p-3">
                        <span className="px-2 py-0.5 rounded bg-emerald-50 text-emerald-700 font-semibold text-[10px]">
                          {t("reports.tag_mandatory", "Mandatory")}
                        </span>
                      </td>
                      <td className="p-3 text-slate-500">
                        {test.samplingRule}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* 5. Accredited Laboratories */}
          <div className="space-y-2">
            <h3 className="text-sm font-bold uppercase tracking-wider text-blue-800 dark:text-blue-400">
              {t("reports.section5", "5. Recommended Testing Laboratories")}
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              {report.accreditedLaboratories.map((lab, i) => (
                <div
                  key={i}
                  className="p-3 rounded-xl border border-slate-200 dark:border-slate-700 flex items-center justify-between"
                >
                  <div>
                    <h4 className="font-bold">{lab.name}</h4>
                    <p className="text-slate-500">{lab.location}</p>
                  </div>
                  <span className="px-2 py-0.5 rounded bg-emerald-50 text-emerald-700 font-semibold text-[10px]">
                    {lab.accreditationStatus}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* 6. Documentation Checklist */}
          <div className="space-y-2">
            <h3 className="text-sm font-bold uppercase tracking-wider text-blue-800 dark:text-blue-400">
              6. Statutory Documentation Checklist
            </h3>
            <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-700 text-xs space-y-1.5">
              {report.documentationChecklist.map((doc, i) => (
                <div key={i} className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                  <span>{doc}</span>
                </div>
              ))}
            </div>
          </div>

          {/* 7. Pitfalls & Warnings */}
          <div className="p-4 rounded-xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800 text-xs space-y-2">
            <h4 className="font-bold text-amber-900 dark:text-amber-200 flex items-center gap-1.5">
              <AlertTriangle className="w-4 h-4 text-amber-600" /> Key Statutory
              Compliance Pitfalls to Avoid:
            </h4>
            <ul className="space-y-1 text-amber-800 dark:text-amber-300">
              {report.potentialPitfalls.map((pitfall, i) => (
                <li key={i}>• {pitfall}</li>
              ))}
            </ul>
          </div>

          {/* Disclaimer Footer */}
          <div className="pt-6 border-t border-slate-200 dark:border-slate-800 text-[11px] text-slate-500 space-y-1 leading-relaxed">
            <div className="flex items-center gap-1.5 font-bold text-slate-700 dark:text-slate-300">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
              <span>Authoritative Compliance Notice:</span>
            </div>
            <p>{report.disclaimer}</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function ComplianceReportsPage() {
  return (
    <React.Suspense
      fallback={
        <div className="p-8 text-center text-xs text-slate-500">
          Loading Compliance Report...
        </div>
      }
    >
      <ComplianceReportsContent />
    </React.Suspense>
  );
}
