"use client";

import React from "react";
import Link from "next/link";
import { ExternalLink, ShieldCheck } from "lucide-react";
import Image from "next/image";
import { useTranslation } from "@/lib/i18n";

export function Footer() {
  const { t } = useTranslation();

  return (
    <footer className="bg-[#05072e] text-[#789ab0] text-xs border-t border-[#12304A]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* Col 1 */}
          <div className="space-y-3 md:col-span-1">
            <div className="flex items-center gap-2 text-white font-bold text-sm">
              <Image
                src={"/BIS-LOGO.png"}
                alt="BIS-LOGO"
                height={24}
                width={24}
              />
              <span>SentinelX</span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              {t(
                "footer.description",
                "AI-Powered Decision-Support Platform for Indian Standards, Certification Schemes, Laboratory Testing, and Hallmarking.",
              )}
            </p>
            <div className="flex items-center gap-1.5 text-emerald-400 font-medium text-[11px]">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>
                {t(
                  "footer.tagline",
                  "Retrieve First → Reason Second → Cite Everything",
                )}
              </span>
            </div>
          </div>

          {/* Col 2 */}
          <div className="space-y-2">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-200">
              {t("footer.portals_title", "BIS Portals")}
            </h4>
            <ul className="space-y-1.5">
              <li>
                <a
                  href="https://www.services.bis.gov.in"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-white inline-flex items-center gap-1"
                >
                  <span>{t("footer.ebis", "e-BIS Portal")}</span>
                  <ExternalLink className="w-2.5 h-2.5 opacity-60" />
                </a>
              </li>
              <li>
                <a
                  href="https://www.manakonline.in"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-white inline-flex items-center gap-1"
                >
                  <span>
                    {t("footer.manakonline", "Manakonline (Scheme I)")}
                  </span>
                  <ExternalLink className="w-2.5 h-2.5 opacity-60" />
                </a>
              </li>
              <li>
                <a
                  href="https://www.crsbis.in"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-white inline-flex items-center gap-1"
                >
                  <span>{t("footer.crs", "CRS Portal (Electronics)")}</span>
                  <ExternalLink className="w-2.5 h-2.5 opacity-60" />
                </a>
              </li>
              <li>
                <a
                  href="https://nabl-india.org"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-white inline-flex items-center gap-1"
                >
                  <span>{t("footer.nabl", "NABL Directory")}</span>
                  <ExternalLink className="w-2.5 h-2.5 opacity-60" />
                </a>
              </li>
            </ul>
          </div>

          {/* Col 3 */}
          <div className="space-y-2">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-200">
              {t("footer.modules_title", "Core Modules")}
            </h4>
            <ul className="space-y-1.5">
              <li>
                <Link href="/standards/recommend" className="hover:text-white">
                  {t("footer.find_standard", "Find My Standard")}
                </Link>
              </li>
              <li>
                <Link href="/certification" className="hover:text-white">
                  {t("footer.certification", "Certification Schemes")}
                </Link>
              </li>
              <li>
                <Link href="/testing" className="hover:text-white">
                  {t("footer.testing", "Testing Requirements")}
                </Link>
              </li>
              <li>
                <Link href="/laboratories" className="hover:text-white">
                  {t("footer.labs", "Recognized Labs Finder")}
                </Link>
              </li>
              <li>
                <Link href="/hallmarking" className="hover:text-white">
                  {t("footer.hallmarking", "Gold & Silver Hallmarking")}
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 4 */}
          <div className="space-y-2">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-200">
              {t("footer.legal_title", "Legal & Quality Notice")}
            </h4>
            <p className="text-[11px] text-slate-500 leading-relaxed">
              {t(
                "footer.legal_text",
                "Information provided is grounded in published Indian Standards and Gazette notifications. Formal legal compliance requires certification grant through official BIS portals.",
              )}
            </p>
            <div className="pt-2">
              <Link
                href="/admin"
                className="text-[11px] text-blue-400 hover:underline"
              >
                {t("footer.admin_link", "Admin & Evaluation Console →")}
              </Link>
            </div>
          </div>
        </div>

        <div className="pt-6 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-3 text-[11px] text-slate-500">
          <div>
            © {new Date().getFullYear()}{" "}
            {t(
              "footer.copyright",
              "SentinelX. Built for Indian Industry, MSMEs & Citizens.",
            )}
          </div>
          <div className="flex items-center gap-4">
            <Link href="/consumer" className="hover:text-slate-300">
              {t("footer.consumer_grievance", "Consumer Grievance")}
            </Link>
            <span>•</span>
            <Link href="/chat" className="hover:text-slate-300">
              {t("footer.ai_support", "AI Decision Support")}
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
