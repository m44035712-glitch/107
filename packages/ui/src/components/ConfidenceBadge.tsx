import React from "react";
import { ConfidenceLevel, IndianLanguage } from "@bis/shared-types";
import { ShieldCheck, ShieldAlert, AlertTriangle } from "lucide-react";

interface ConfidenceBadgeProps {
  level: ConfidenceLevel;
  score?: number;
  className?: string;
  language?: IndianLanguage;
}

const HIGH_LABELS: Partial<Record<IndianLanguage, string>> = {
  [IndianLanguage.HI]: "प्रामाणिक साक्ष्य (Authoritative Grounding)",
  [IndianLanguage.TA]: "அதிகாரப்பூர்வ சான்று (Authoritative Grounding)",
  [IndianLanguage.TE]: "అధికారిక ఆధారం (Authoritative Grounding)",
  [IndianLanguage.BN]: "প্রামাণ্য ভিত্তি (Authoritative Grounding)",
  [IndianLanguage.MR]: "अधिकृत पुरावा (Authoritative Grounding)",
  [IndianLanguage.GU]: "સત્તાવાર પુરાવો (Authoritative Grounding)",
  [IndianLanguage.KN]: "ಅಧಿಕೃತ ಆಧಾರ (Authoritative Grounding)",
  [IndianLanguage.ML]: "ആധികാരിക തെളിവ് (Authoritative Grounding)",
  [IndianLanguage.PA]: "ਅਧਿਕਾਰਤ ਆਧਾਰ (Authoritative Grounding)",
  [IndianLanguage.OR]: "ପ୍ରାମାଣିକ ଆଧାର (Authoritative Grounding)",
  [IndianLanguage.UR]: "مستند ثبوت (Authoritative Grounding)",
  [IndianLanguage.AS]: "প্ৰামাণিক আধাৰ (Authoritative Grounding)",
  [IndianLanguage.SAN]: "प्रामाणिक-प्रमाणम् (Authoritative Grounding)",
  [IndianLanguage.NEP]: "आधिकारिक प्रमाण (Authoritative Grounding)",
  [IndianLanguage.KOK]: "अधिकृत पुरावो (Authoritative Grounding)",
  [IndianLanguage.MAI]: "प्रामाणिक साक्ष्य (Authoritative Grounding)",
  [IndianLanguage.DOG]: "प्रामाणिक प्रमाण (Authoritative Grounding)",
  [IndianLanguage.BOD]: "थार साखि (Authoritative Grounding)",
  [IndianLanguage.MNI]: "অচুম্বা প্রমাণ (Authoritative Grounding)",
  [IndianLanguage.SAT]: "ᱥᱟᱹᱨᱤ ᱥᱟᱹᱠᱷᱤ (Authoritative Grounding)",
  [IndianLanguage.KAS]: "مستند ثبوت (Authoritative Grounding)",
  [IndianLanguage.SD]: "سرڪاري ثبوت (Authoritative Grounding)",
};

const MEDIUM_LABELS: Partial<Record<IndianLanguage, string>> = {
  [IndianLanguage.HI]: "योग्य साक्ष्य (Qualified Evidence)",
  [IndianLanguage.TA]: "தகுதிவாய்ந்த சான்று (Qualified Evidence)",
  [IndianLanguage.TE]: "అర్హతగల ఆధారం (Qualified Evidence)",
  [IndianLanguage.BN]: "যোগ্য প্রমাণ (Qualified Evidence)",
  [IndianLanguage.MR]: "पात्र पुरावा (Qualified Evidence)",
  [IndianLanguage.GU]: "લાયક પુરાવો (Qualified Evidence)",
  [IndianLanguage.KN]: "ಅರ್ಹ ಪುರಾವೆ (Qualified Evidence)",
  [IndianLanguage.ML]: "യോഗ്യതയുള്ള തെളിവ് (Qualified Evidence)",
  [IndianLanguage.PA]: "ਯੋਗ ਸਬੂਤ (Qualified Evidence)",
  [IndianLanguage.OR]: "ଯୋଗ୍ୟ ପ୍ରମାଣ (Qualified Evidence)",
  [IndianLanguage.UR]: "اہل ثبوت (Qualified Evidence)",
  [IndianLanguage.AS]: "যোগ্য প্ৰমাণ (Qualified Evidence)",
  [IndianLanguage.SAN]: "योग्य-प्रमाणम् (Qualified Evidence)",
  [IndianLanguage.NEP]: "योग्य प्रमाण (Qualified Evidence)",
  [IndianLanguage.KOK]: "पात्र पुरावो (Qualified Evidence)",
  [IndianLanguage.MAI]: "योग्य साक्ष्य (Qualified Evidence)",
  [IndianLanguage.DOG]: "योग्य प्रमाण (Qualified Evidence)",
  [IndianLanguage.BOD]: "थाखो गोनां साखि (Qualified Evidence)",
  [IndianLanguage.MNI]: "চুম্বা প্রমাণ (Qualified Evidence)",
  [IndianLanguage.SAT]: "ᱵᱟᱪᱷᱟᱣ ᱥᱟᱹᱠᱷᱤ (Qualified Evidence)",
  [IndianLanguage.KAS]: "اہل ثبوت (Qualified Evidence)",
  [IndianLanguage.SD]: "مناسب ثبوت (Qualified Evidence)",
};

export const ConfidenceBadge: React.FC<ConfidenceBadgeProps> = ({
  level,
  score,
  className = "",
  language = IndianLanguage.EN,
}) => {
  if (level === ConfidenceLevel.HIGH) {
    const label = HIGH_LABELS[language] || "Authoritative Grounding";
    return (
      <span
        className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium bg-emerald-50 text-emerald-800 border border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-300 dark:border-emerald-800/60 ${className}`}
        title="High confidence: Fully supported by authoritative BIS Gazette and published standard clauses"
      >
        <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
        <span>{label}</span>
        {score !== undefined && (
          <span className="opacity-75 text-[10px]">
            ({Math.round(score * 100)}%)
          </span>
        )}
      </span>
    );
  }

  if (level === ConfidenceLevel.MEDIUM) {
    const label = MEDIUM_LABELS[language] || "Qualified Evidence";
    return (
      <span
        className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium bg-amber-50 text-amber-800 border border-amber-200 dark:bg-amber-950/40 dark:text-amber-300 dark:border-amber-800/60 ${className}`}
        title="Medium confidence: Partially supported. Please verify specific product grades or parameters."
      >
        <ShieldAlert className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />
        <span>{label}</span>
        {score !== undefined && (
          <span className="opacity-75 text-[10px]">
            ({Math.round(score * 100)}%)
          </span>
        )}
      </span>
    );
  }

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium bg-rose-50 text-rose-800 border border-rose-200 dark:bg-rose-950/40 dark:text-rose-300 dark:border-rose-800/60 ${className}`}
      title="Low confidence: Authoritative information could not be verified. Exercise caution."
    >
      <AlertTriangle className="w-3.5 h-3.5 text-rose-600 dark:text-rose-400" />
      <span>Unverified / Needs Data</span>
    </span>
  );
};
