"use client";

import React, { useState, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { CertificationScheme, ComplianceRoadmapStep } from "@bis/shared-types";
import { apiClient } from "@bis/api-client";
import { ComplianceStep, LoadingState } from "@bis/ui";
import { useTranslation } from "@/lib/i18n";
import {
  Award,
  CheckCircle2,
  FileText,
  Clock,
  ExternalLink,
  ShieldCheck,
  ArrowRight,
  FileBarChart2,
  Printer,
  Upload,
  FlaskConical,
} from "lucide-react";

const applicationDocuments = [
  { name: "Application details", upload: false },
  { name: "Product information", upload: false },
  { name: "Test reports", upload: true },
  { name: "Manufacturing information", upload: true },
  { name: "Quality control information", upload: true },
  { name: "Other applicable documents", upload: true },
];

function CertificationContent() {
  const router = useRouter();
  const { t } = useTranslation();
  const searchParams = useSearchParams();
  const stdParam = searchParams.get("std") || "IS 17526:2021";
  const productParam =
    searchParams.get("product") ||
    "Stainless Steel Vacuum Insulated Water Bottle";

  const [schemes, setSchemes] = useState<CertificationScheme[]>([]);
  const [selectedSchemeCode, setSelectedSchemeCode] =
    useState<string>("SCHEME-I");
  const [roadmapSteps, setRoadmapSteps] = useState<ComplianceRoadmapStep[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showApplicationForm, setShowApplicationForm] = useState(false);
  const [applicationSubmitted, setApplicationSubmitted] = useState(false);
  const [validationAttempted, setValidationAttempted] = useState(false);
  const [application, setApplication] = useState({
    applicantName: "",
    productName: productParam,
    isiMark: "",
    productDetails: "",
  });
  const [uploadedDocuments, setUploadedDocuments] = useState<Record<string, File | null>>({});

  useEffect(() => {
    const loadSchemesAndRoadmap = async () => {
      setIsLoading(true);
      try {
        const schemeList = await apiClient.getCertificationSchemes();
        setSchemes(schemeList);

        const roadmapRes = await apiClient.getCertificationRoadmap(
          stdParam,
          productParam,
        );
        setRoadmapSteps(roadmapRes.steps);
      } catch (err) {
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };
    loadSchemesAndRoadmap();
  }, [stdParam, productParam]);

  const activeScheme =
    schemes.find((s) => s.code === selectedSchemeCode) ||
    (schemes.length > 0 ? schemes[0] : null);

  const handleGenerateReport = () => {
    router.push(
      `/reports?product=${encodeURIComponent(productParam)}&std=${encodeURIComponent(stdParam)}`,
    );
  };

  const handleSchemeSelect = (code: string) => {
    setSelectedSchemeCode(code);
    setShowApplicationForm(true);
    setApplicationSubmitted(false);
  };

  const handleApplicationSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setValidationAttempted(true);
    const missingUpload = applicationDocuments.some((document) => document.upload && !uploadedDocuments[document.name]);
    const missingField = !application.applicantName.trim() || !application.productName.trim() || !application.isiMark || !application.productDetails.trim();
    if (missingUpload || missingField) {
      setApplicationSubmitted(false);
      return;
    }
    setApplicationSubmitted(true);
  };

  return (
    <div className="relative min-h-screen w-full bg-gradient-to-b from-[#03045E] via-[#023E8A] to-[#03045E] dark:from-slate-950 dark:via-[#03045E]/90 dark:to-slate-950 overflow-hidden text-white">
      {/* Ambient Glowing Blobs */}
      <div className="absolute top-12 left-1/2 -translate-x-1/2 w-[700px] h-[350px] bg-[#48CAE4]/15 rounded-full blur-3xl pointer-events-none animate-pulse" />
      <div className="absolute top-0 right-10 w-80 h-80 bg-[#0077B6]/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-10 w-80 h-80 bg-[#48CAE4]/15 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10 space-y-8 relative z-10">
        {/* Header */}
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 print:hidden">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 dark:bg-white/10 text-[#CAF0F8] text-xs font-semibold border border-[#48CAE4]/30 backdrop-blur-md shadow-2xs">
              <Award className="w-3.5 h-3.5 text-[#48CAE4]" />
              <span>
                {t("certification.badge", "BIS Conformity Assessment Schemes")}
              </span>
            </div>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight">
              {t(
                "certification.title",
                "Certification Schemes & Compliance Roadmap",
              )}
            </h1>
            <p className="text-sm sm:text-base text-[#ADE8F4]/90 max-w-2xl leading-relaxed">
              {t(
                "certification.subtitle",
                "Understand statutory conformity schemes, mandatory factory audits, laboratory sample testing, and step-by-step licence grant procedures.",
              )}
            </p>
          </div>

          <button
            type="button"
            onClick={handleGenerateReport}
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl text-xs font-bold bg-gradient-to-r from-[#0077B6] via-[#48CAE4] to-[#48CAE4] hover:from-[#0077B6] hover:to-[#48CAE4] text-slate-950 hover:text-white shadow-lg shadow-[#03045E]/40 transition-all shrink-0 cursor-pointer"
          >
            <FileBarChart2 className="w-4 h-4" />
            <span>
              {t("certification.btn_report", "Generate Full Compliance Report")}
            </span>
          </button>
        </div>

        {/* Active Product Notice */}
        <div className="p-4 sm:p-5 rounded-2xl bg-white/10 dark:bg-white/10 backdrop-blur-md border border-white/20 dark:border-slate-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs shadow-md print:hidden">
          <div>
            <span className="font-bold text-[#CAF0F8]">
              {t(
                "certification.active_product",
                "Active Product Roadmap:",
              )}{" "}
            </span>
            <span className="font-black text-white">{productParam}</span>
            <span className="text-[#CAF0F8] ml-2 font-mono font-bold">
              ({stdParam})
            </span>
          </div>
          <button
            type="button"
            onClick={() => router.push("/standards/recommend")}
            className="text-[#48CAE4] font-bold hover:text-white hover:underline shrink-0 cursor-pointer flex items-center gap-1 transition-colors"
          >
            <span>
              {t("certification.btn_change", "Change Product Profile →")}
            </span>
          </button>
        </div>

        {/* Schemes Selector Tabs */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 print:hidden">
          {schemes.map((s) => {
            const isSelected = selectedSchemeCode === s.code;
            return (
              <button
                key={s.code}
                type="button"
                onClick={() => handleSchemeSelect(s.code)}
                className={`p-4 rounded-xl border text-left transition-all ${
                  isSelected
                    ? "bg-white/95 dark:bg-slate-900/95 border-[#48CAE4] shadow-lg ring-2 ring-[#48CAE4]/50"
                    : "bg-white/90 dark:bg-slate-900/80 border-white/20 dark:border-slate-800 hover:bg-white dark:hover:bg-slate-900"
                }`}
              >
                <span className="text-[10px] font-mono font-bold text-[#0077B6] dark:text-[#48CAE4] block uppercase">
                  {s.code}
                </span>
                <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100 mt-0.5">
                  {s.name.split("—")[0]}
                </h3>
                <p className="text-xs text-slate-600 dark:text-slate-400 line-clamp-2 mt-1">
                  {s.applicability}
                </p>
              </button>
            );
          })}
        </div>

        {showApplicationForm && activeScheme && (
          <section id="certification-application" className="rounded-2xl border border-[#48CAE4]/50 bg-white p-6 text-slate-900 shadow-xl shadow-[#03045E]/30 dark:bg-slate-900 dark:text-white print:hidden">
            <div className="flex flex-col gap-3 border-b border-slate-200 pb-5 dark:border-slate-800 sm:flex-row sm:items-start sm:justify-between">
              <div>
                <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-[#0077B6] dark:text-[#48CAE4]">Certification Application</p>
                <h2 className="mt-1 text-xl font-black">{activeScheme.name}</h2>
                <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">Complete the application details and upload the required supporting documents.</p>
              </div>
              <span className="inline-flex w-fit rounded-full bg-[#CAF0F8] px-3 py-1 text-[10px] font-bold text-[#023E8A] dark:bg-[#023E8A] dark:text-[#CAF0F8]">{activeScheme.code}</span>
            </div>

            <form onSubmit={handleApplicationSubmit} className="mt-6 space-y-6">
              <div className="grid gap-4 md:grid-cols-2">
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">Applicant name
                  <input aria-invalid={validationAttempted && !application.applicantName.trim()} value={application.applicantName} onChange={(event) => setApplication((current) => ({ ...current, applicantName: event.target.value }))} placeholder="Enter applicant or organization name" className={`mt-2 w-full rounded-lg border bg-white px-3 py-2.5 text-sm font-normal text-slate-900 outline-none focus:border-[#0077B6] focus:ring-2 focus:ring-[#48CAE4]/40 dark:bg-slate-950 dark:text-white ${validationAttempted && !application.applicantName.trim() ? "border-red-500 ring-2 ring-red-500/20 dark:border-red-400" : "border-slate-300 dark:border-slate-700"}`} />
                </label>
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">Product name
                  <input aria-invalid={validationAttempted && !application.productName.trim()} value={application.productName} onChange={(event) => setApplication((current) => ({ ...current, productName: event.target.value }))} placeholder="Enter product name" className={`mt-2 w-full rounded-lg border bg-white px-3 py-2.5 text-sm font-normal text-slate-900 outline-none focus:border-[#0077B6] focus:ring-2 focus:ring-[#48CAE4]/40 dark:bg-slate-950 dark:text-white ${validationAttempted && !application.productName.trim() ? "border-red-500 ring-2 ring-red-500/20 dark:border-red-400" : "border-slate-300 dark:border-slate-700"}`} />
                </label>
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">ISI Mark status
                  <select aria-invalid={validationAttempted && !application.isiMark} value={application.isiMark} onChange={(event) => setApplication((current) => ({ ...current, isiMark: event.target.value }))} className={`mt-2 w-full rounded-lg border bg-white px-3 py-2.5 text-sm font-normal text-slate-900 outline-none focus:border-[#0077B6] focus:ring-2 focus:ring-[#48CAE4]/40 dark:bg-slate-950 dark:text-white ${validationAttempted && !application.isiMark ? "border-red-500 ring-2 ring-red-500/20 dark:border-red-400" : "border-slate-300 dark:border-slate-700"}`}>
                    <option value="">Select status</option>
                    <option value="Already has ISI Mark">Already has ISI Mark</option>
                    <option value="Applying for ISI Mark">Applying for ISI Mark</option>
                    <option value="Not yet marked">Not yet marked</option>
                  </select>
                </label>
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">Standard number
                  <input readOnly value={stdParam} className="mt-2 w-full rounded-lg border border-slate-200 bg-slate-100 px-3 py-2.5 text-sm font-normal text-slate-600 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300" />
                </label>
              </div>

              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">Details of the product
                <textarea aria-invalid={validationAttempted && !application.productDetails.trim()} value={application.productDetails} onChange={(event) => setApplication((current) => ({ ...current, productDetails: event.target.value }))} rows={4} placeholder="Describe the product, model, materials, intended use, and manufacturing details" className={`mt-2 w-full resize-y rounded-lg border bg-white px-3 py-2.5 text-sm font-normal text-slate-900 outline-none focus:border-[#0077B6] focus:ring-2 focus:ring-[#48CAE4]/40 dark:bg-slate-950 dark:text-white ${validationAttempted && !application.productDetails.trim() ? "border-red-500 ring-2 ring-red-500/20 dark:border-red-400" : "border-slate-300 dark:border-slate-700"}`} />
              </label>

              <div>
                <h3 className="text-base font-bold text-slate-900 dark:text-white">4. Required Documents</h3>
                <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">Find documents required for BIS certification.</p>
                <div className="mt-4 divide-y divide-slate-200 overflow-hidden rounded-xl border border-slate-200 dark:divide-slate-800 dark:border-slate-800">
                  {applicationDocuments.map((document) => (
                    <div key={document.name} className={`flex flex-col gap-3 px-4 py-3 sm:flex-row sm:items-center sm:justify-between dark:bg-slate-950/40 ${validationAttempted && document.upload && !uploadedDocuments[document.name] ? "bg-red-50 ring-1 ring-inset ring-red-500 dark:bg-red-950/30" : "bg-slate-50"}`}>
                      <div className="flex items-center gap-3 text-sm text-slate-700 dark:text-slate-300"><span className="text-lg leading-none">□</span><span>{document.name}</span></div>
                      {document.upload ? (
                        <label className="inline-flex cursor-pointer items-center gap-2 text-xs font-bold text-[#0077B6] dark:text-[#48CAE4]">
                          <Upload className="h-4 w-4" /> {uploadedDocuments[document.name]?.name || (validationAttempted ? "Upload required document" : "Upload document")}
                          <input type="file" className="sr-only" onChange={(event) => setUploadedDocuments((current) => ({ ...current, [document.name]: event.target.files?.[0] || null }))} />
                        </label>
                      ) : <span className="text-[10px] font-semibold uppercase tracking-wide text-emerald-600 dark:text-emerald-400">Shown in application</span>}
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex flex-wrap gap-3 border-t border-slate-200 pt-5 dark:border-slate-800 print:hidden">
                <button type="submit" className="inline-flex items-center gap-2 rounded-lg bg-[#0077B6] px-5 py-2.5 text-xs font-bold text-white shadow-md transition hover:bg-[#023E8A]">Submit Application</button>
                <button type="button" onClick={() => window.print()} className="inline-flex items-center gap-2 rounded-lg border border-[#0077B6] px-5 py-2.5 text-xs font-bold text-[#0077B6] transition hover:bg-[#CAF0F8] dark:text-[#48CAE4]"><Printer className="h-4 w-4" /> Print Application</button>
                {validationAttempted && !applicationSubmitted && <span className="inline-flex items-center text-xs font-semibold text-red-600 dark:text-red-400">Complete all fields and upload every required document before submitting.</span>}
                {applicationSubmitted && <span className="inline-flex items-center text-xs font-semibold text-emerald-600 dark:text-emerald-400">Application submitted successfully.</span>}
              </div>
            </form>
          </section>
        )}

        {showApplicationForm && activeScheme && (
          <section className="hidden print:block print-form mx-auto w-full bg-white p-6 text-[11px] text-black">
            <div className="mb-5 grid grid-cols-[1fr_2fr_1fr] items-center border-b-2 border-black pb-3">
              <div className="text-center text-[9px] font-bold">Bureau of Indian Standards</div>
              <div className="text-center">
                <img src="/BIS-LOGO.png" alt="BIS logo" className="mx-auto h-12 w-auto object-contain" />
                <h1 className="mt-1 text-lg font-bold">Application Form for Grant of BIS Registration</h1>
              </div>
              <div className="text-center text-[9px] font-bold">Indian Standards</div>
            </div>

            <table className="w-full border-collapse border border-black">
              <tbody>
                <tr><th className="w-8 border border-black p-2 text-center">1.</th><th className="w-1/3 border border-black bg-slate-200 p-2 text-left">Name of Applicant / Organization</th><td className="border border-black p-2">{application.applicantName || " "}</td></tr>
                <tr><th className="border border-black p-2 text-center">2.</th><th className="border border-black bg-slate-200 p-2 text-left">Product and Standard Details</th><td className="border border-black p-2">Product: {application.productName || productParam}<br />IS Number: {stdParam}<br />Category: {activeScheme.name}<br />ISI Mark Status: {application.isiMark || " "}</td></tr>
                <tr><th className="border border-black p-2 text-center">3.</th><th className="border border-black bg-slate-200 p-2 text-left">Details of the Product</th><td className="whitespace-pre-wrap border border-black p-2">{application.productDetails || " "}</td></tr>
                <tr><th className="border border-black p-2 text-center">4.</th><th className="border border-black bg-slate-200 p-2 text-left">Certification Scheme</th><td className="border border-black p-2">{activeScheme.name} ({activeScheme.code})</td></tr>
              </tbody>
            </table>

            <h2 className="mt-5 border border-black bg-slate-200 p-2 text-sm font-bold">5. Required Documents</h2>
            <table className="w-full border-collapse border-x border-b border-black">
              <tbody>
                {applicationDocuments.map((document, index) => (
                  <tr key={document.name}>
                    <td className="w-8 border border-black p-2 text-center">{index + 1}.</td>
                    <td className="border border-black p-2">{document.name}</td>
                    <td className="border border-black p-2">{document.upload ? uploadedDocuments[document.name]?.name || "Not uploaded" : "Shown in application"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            <div className="mt-8 flex justify-between border-t border-black pt-3 text-[10px]">
              <span>Applicant signature: __________________________</span>
              <span>Date: __________________</span>
            </div>
            <p className="mt-6 text-center text-[9px]">This application is prepared for BIS certification processing. Verify current requirements on the official BIS portal.</p>
          </section>
        )}

        {/* Main Roadmap Workflow */}
        {isLoading ? (
          <LoadingState
            message={t(
              "certification.loading_msg",
              "Loading Certification Scheme Requirements...",
            )}
            submessage={t(
              "certification.loading_sub",
              "Compiling documentation checklists and audit schedules...",
            )}
          />
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 print:hidden">
            {/* Left Roadmap Steps */}
            <div className="lg:col-span-8 space-y-4">
              <h2 className="text-lg font-bold text-white flex items-center gap-2">
                <span>
                  {t(
                    "certification.roadmap_title",
                    "Interactive Step-by-Step Certification Journey",
                  )}
                </span>
                <span className="text-xs font-medium text-[#ADE8F4]/80">
                  ({roadmapSteps.length} {t("certification.phases", "Phases")})
                </span>
              </h2>

              <div className="space-y-4">
                {roadmapSteps.map((step, idx) => (
                  <ComplianceStep key={idx} step={step} isCurrent={idx === 1} />
                ))}
              </div>
            </div>

            {/* Right Scheme Details Drawer */}
            {activeScheme && (
              <div className="lg:col-span-4 space-y-4">
                <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-4 sticky top-24">
                  <div className="border-b border-slate-100 dark:border-slate-800 pb-3">
                    <span className="text-[11px] font-bold text-amber-700 dark:text-amber-400 uppercase tracking-wider">
                      {t("certification.details_tag", "Scheme Details")}
                    </span>
                    <h3 className="text-base font-bold text-slate-900 dark:text-slate-100 mt-0.5">
                      {activeScheme.name}
                    </h3>
                  </div>

                  <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                    {activeScheme.description}
                  </p>

                  {/* Mandatory Documentation Checklist */}
                  <div className="space-y-2 text-xs">
                    <h4 className="font-semibold text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
                      <FileText className="w-3.5 h-3.5 text-blue-600" />{" "}
                      {t(
                        "certification.docs_title",
                        "Statutory Documents Required:",
                      )}
                    </h4>
                    <ul className="space-y-1 text-slate-600 dark:text-slate-400">
                      {activeScheme.requiredDocuments.map((doc, i) => (
                        <li key={i} className="flex items-start gap-1.5">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0 mt-0.5" />
                          <span>{doc}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Fees & Validity */}
                  <div className="pt-3 border-t border-slate-100 dark:border-slate-800 space-y-2 text-xs">
                    <div>
                      <span className="font-semibold text-slate-700 dark:text-slate-300">
                        {t("certification.fee_title", "Fee Structure:")}{" "}
                      </span>
                      <p className="text-slate-600 dark:text-slate-400 mt-0.5">
                        {activeScheme.feeStructureSummary}
                      </p>
                    </div>
                    <div className="grid grid-cols-2 gap-2 pt-1 text-[11px]">
                      <div>
                        <span className="font-semibold text-slate-700 dark:text-slate-300">
                          {t("certification.validity", "Validity:")}{" "}
                        </span>
                        <span className="text-slate-600 dark:text-slate-400">
                          {activeScheme.validityPeriod}
                        </span>
                      </div>
                      <div>
                        <span className="font-semibold text-slate-700 dark:text-slate-300">
                          {t(
                            "certification.surveillance",
                            "Surveillance:",
                          )}{" "}
                        </span>
                        <span className="text-slate-600 dark:text-slate-400">
                          {activeScheme.surveillanceFrequency}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* External Official Link */}
                  <a
                    href={activeScheme.officialGuidelineUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center gap-1.5 w-full py-2.5 rounded-xl text-xs font-bold bg-amber-500 hover:bg-amber-600 text-slate-900 shadow-sm transition-all"
                  >
                    <span>
                      {t(
                        "certification.link_official",
                        "Official Manakonline / CRS Portal",
                      )}
                    </span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>

                  <a
                    href={`/laboratories?std=${encodeURIComponent(stdParam)}&product=${encodeURIComponent(productParam)}`}
                    className="inline-flex w-full items-center justify-center gap-1.5 rounded-xl border border-[#0077B6] py-2.5 text-xs font-bold text-[#0077B6] transition-all hover:bg-[#CAF0F8] dark:border-[#48CAE4] dark:text-[#48CAE4] dark:hover:bg-[#023E8A]/40"
                  >
                    <FlaskConical className="h-3.5 w-3.5" />
                    Suggested Laboratory to Verify Product
                  </a>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default function CertificationSchemesPage() {
  return (
    <React.Suspense
      fallback={
        <div className="p-8 text-center text-xs text-slate-500">Loading...</div>
      }
    >
      <CertificationContent />
    </React.Suspense>
  );
}
