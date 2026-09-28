import Link from "next/link";
import { ArrowRight, Compass, FlaskConical, ShieldCheck } from "lucide-react";

const guidanceItems = [
  {
    title: "Find the right Indian Standard",
    text: "Describe your product, material, application, and capacity to identify potentially applicable BIS standards.",
    href: "/seller",
    icon: Compass,
  },
  {
    title: "Understand certification",
    text: "Review the relevant certification route, mandatory status, and the evidence needed before making a compliance decision.",
    href: "/certification",
    icon: ShieldCheck,
  },
  {
    title: "Plan testing and laboratories",
    text: "Check testing requirements and find recognized laboratories for the standard connected to your product.",
    href: "/laboratories",
    icon: FlaskConical,
  },
];

export default function GuidancePage() {
  return (
    <main className="relative min-h-screen overflow-hidden bg-[#05072e] text-[#d9f6ff]">
      <div className="pointer-events-none absolute left-1/2 top-0 h-80 w-[850px] -translate-x-1/2 rounded-full bg-[#023E8A]/25 blur-3xl" />
      <div className="relative mx-auto max-w-7xl space-y-8 px-4 py-10 sm:px-6">
        <section className="relative overflow-hidden rounded-3xl border border-[#12304A] bg-[#10283c] p-6 text-white shadow-xl shadow-black/20 sm:p-8">
          <div className="relative z-10 max-w-2xl space-y-2">
            <div className="inline-flex items-center gap-1.5 rounded-full border border-[#0077B6]/60 bg-[#023E8A] px-3 py-1 text-xs font-semibold text-[#d9f6ff]">
              <Compass className="h-3.5 w-3.5 text-[#48CAE4]" />
              Guidance
            </div>
            <h1 className="text-2xl font-black tracking-tight sm:text-4xl">BIS Compliance Guidance</h1>
            <p className="text-xs leading-relaxed text-[#9dc5dc] sm:text-sm">
              Move from product identification to certification and testing with evidence-backed BIS guidance.
            </p>
          </div>
        </section>

        <section className="grid gap-5 md:grid-cols-3">
          {guidanceItems.map((item) => {
            const Icon = item.icon;
            return (
              <Link key={item.title} href={item.href} className="group rounded-2xl border border-[#12304A] bg-[#10283c] p-6 shadow-md shadow-black/15 transition hover:-translate-y-1 hover:border-[#0077B6]">
                <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#023E8A] text-[#48CAE4]"><Icon className="h-5 w-5" /></span>
                <h2 className="mt-5 text-base font-bold text-[#d9f6ff]">{item.title}</h2>
                <p className="mt-2 text-xs leading-relaxed text-[#9dc5dc]">{item.text}</p>
                <span className="mt-5 inline-flex items-center gap-1 text-xs font-bold text-[#48CAE4]">Open module <ArrowRight className="h-3.5 w-3.5 transition group-hover:translate-x-1" /></span>
              </Link>
            );
          })}
        </section>
      </div>
    </main>
  );
}
