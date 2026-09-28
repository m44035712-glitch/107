"use client";

import Link from "next/link";
import {
  ArrowRight,
  BookOpen,
  Building2,
  ClipboardList,
  FlaskConical,
  Mail,
  MessageCircleQuestion,
  PhoneCall,
  ShieldAlert,
  Coins,
} from "lucide-react";

const supportOptions = [
  {
    title: "BIS Helpline",
    description: "Get assistance regarding BIS standards, certification, licensing, hallmarking, testing, and consumer-related queries.",
    icon: PhoneCall,
    href: "tel:1800114000",
    action: "Call 1800-11-4000",
    color: "bg-[#eff8fc] text-[#087fd1]",
  },
  {
    title: "Email Support",
    description: "Submit your BIS-related questions or service requests.",
    icon: Mail,
    href: "mailto:info@bis.gov.in",
    action: "Send an email",
    color: "bg-[#eff8fc] text-[#087fd1]",
  },
  {
    title: "BIS Offices",
    description: "Find information about BIS Regional and Branch Offices.",
    icon: Building2,
    href: "https://www.bis.gov.in/contact-us/",
    action: "View BIS offices",
    color: "bg-[#eff8fc] text-[#087fd1]",
  },
  {
    title: "Product Certification Queries",
    description: "Get information about BIS certification, licensing procedures, schemes, and requirements.",
    icon: ClipboardList,
    href: "/certification",
    action: "Explore certification",
    color: "bg-[#eff8fc] text-[#087fd1]",
  },
  {
    title: "Testing & Laboratory Queries",
    description: "Find information related to BIS-recognized laboratories and testing requirements.",
    icon: FlaskConical,
    href: "/laboratories",
    action: "Find a laboratory",
    color: "bg-[#eff8fc] text-[#087fd1]",
  },
  {
    title: "Hallmarking Queries",
    description: "Information about hallmarking, registration, and related services.",
    icon: Coins,
    href: "/hallmarking",
    action: "Open hallmarking",
    color: "bg-[#eff8fc] text-[#087fd1]",
  },
  {
    title: "Standards & Technical Queries",
    description: "Ask about applicable Indian Standards, standards documents, and technical information.",
    icon: BookOpen,
    href: "/standards",
    action: "Browse standards",
    color: "bg-[#eff8fc] text-[#087fd1]",
  },
  {
    title: "Consumer Complaints",
    description: "Report concerns related to BIS-certified products or misuse of the BIS Standard Mark.",
    icon: ShieldAlert,
    href: "/consumer",
    action: "Open consumer services",
    color: "bg-[#eff8fc] text-[#087fd1]",
  },
];

export default function ContactBisPage() {
  return (
    <main className="min-h-[calc(100vh-4rem)] bg-[#05072e] px-4 py-10 text-[#d9f6ff] sm:px-6 lg:py-14">
      <div className="mx-auto max-w-6xl">
        <section className="rounded-3xl bg-gradient-to-r from-[#05072e] to-[#0077b6] px-6 py-10 text-center text-white shadow-xl shadow-[#05072e]/20 sm:px-10">
          <p className="text-xs font-bold uppercase tracking-[0.22em] text-[#c7edff]">Bureau of Indian Standards (BIS)</p>
          <h1 className="mt-3 text-3xl font-black tracking-tight sm:text-5xl">CONTACT BIS</h1>
          <p className="mt-3 text-sm font-medium text-[#d9f6ff] sm:text-base">India&apos;s National Standards Body</p>
        </section>

        <div className="mt-10 flex items-center gap-3">
          <MessageCircleQuestion className="h-5 w-5 text-[#0077B6]" />
          <h2 className="text-xl font-black text-[#d9f6ff] sm:text-2xl">How can we help you?</h2>
        </div>

        <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {supportOptions.map((option) => {
            const Icon = option.icon;
            const external = option.href.startsWith("http");
            return (
              <Link
                key={option.title}
                href={option.href}
                target={external ? "_blank" : undefined}
                rel={external ? "noreferrer" : undefined}
                className="group flex min-h-[205px] flex-col rounded-2xl border border-[#ADE8F4] bg-white p-5 shadow-sm transition hover:-translate-y-1 hover:border-[#ADE8F4] hover:shadow-lg"
              >
                <span className={`flex h-11 w-11 items-center justify-center rounded-xl ${option.color}`}>
                  <Icon className="h-5 w-5" />
                </span>
                <h3 className="mt-4 text-sm font-black text-[#03045E]">{option.title}</h3>
                <p className="mt-2 flex-1 text-xs leading-relaxed text-[#6582a2]">{option.description}</p>
                <span className="mt-4 inline-flex items-center gap-1 text-[11px] font-bold text-[#0077B6]">
                  {option.action}
                  <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
                </span>
              </Link>
            );
          })}
        </div>

        <div className="mt-10 flex justify-center">
          <Link href="/chat" className="inline-flex items-center gap-2 rounded-xl bg-[#0077B6] px-6 py-3 text-sm font-black text-white shadow-lg shadow-[#0077B6]/20 transition hover:bg-[#023E8A]">
            <MessageCircleQuestion className="h-4 w-4" />
            ASK BIS AI
          </Link>
        </div>
      </div>
    </main>
  );
}