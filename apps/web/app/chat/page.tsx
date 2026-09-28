"use client";

import React, { useState, useEffect, useRef } from "react";
import { useSearchParams } from "next/navigation";
import {
  ChatMessage,
  ChatSession,
  Citation,
  ConfidenceLevel,
  Evidence,
  IndianLanguage,
  UserRole,
} from "@bis/shared-types";
import { apiClient } from "@bis/api-client";
import {
  CitationBadge,
  ConfidenceBadge,
  EvidencePanel,
  LanguageSelector,
  SourceFreshnessBadge,
} from "@bis/ui";
import { useTranslation } from "@/lib/i18n";
import {
  Send,
  Plus,
  Trash2,
  ThumbsUp,
  ThumbsDown,
  Flag,
  Sparkles,
  Bot,
  User,
  ShieldCheck,
  Compass,
  Award,
  FlaskConical,
  Building2,
  FileText,
  Copy,
  Check,
  FileBarChart2,
  Globe,
} from "lucide-react";
import Link from "next/link";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

function FormattedTime({ dateString }: { dateString: string }) {
  const [formatted, setFormatted] = useState<string>("");

  useEffect(() => {
    try {
      const d = new Date(dateString);
      setFormatted(
        d.toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        }),
      );
    } catch {
      setFormatted("");
    }
  }, [dateString]);

  return <span suppressHydrationWarning>{formatted || "Just now"}</span>;
}

function parseInlineMarkdown(
  text: string,
  onCitationClick?: (cite: Citation) => void,
): React.ReactNode {
  const parts: React.ReactNode[] = [];
  const regex = /(\*\*[^*]+\*\*|`[^`]+`|\[\d+\])/g;
  let lastIndex = 0;
  let match: RegExpExecArray | null;

  while ((match = regex.exec(text)) !== null) {
    if (match.index > lastIndex) {
      parts.push(text.substring(lastIndex, match.index));
    }
    const token = match[0];
    if (token.startsWith("**") && token.endsWith("**")) {
      parts.push(
        <strong
          key={match.index}
          className="font-bold text-slate-900 dark:text-white"
        >
          {token.slice(2, -2)}
        </strong>,
      );
    } else if (token.startsWith("`") && token.endsWith("`")) {
      parts.push(
        <code
          key={match.index}
          className="px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-blue-700 dark:text-blue-300 font-mono text-xs"
        >
          {token.slice(1, -1)}
        </code>,
      );
    } else if (/^\[\d+\]$/.test(token)) {
      const citeNum = parseInt(token.replace(/\D/g, ""), 10);
      parts.push(
        <button
          key={match.index}
          type="button"
          onClick={() =>
            onCitationClick &&
            onCitationClick({
              standardNumber: `[${citeNum}]`,
              clause: "",
              page: 1,
              snippet: "",
              sourceUrl: "",
              citationNumber: citeNum,
              evidenceId: "",
            })
          }
          className="inline-flex items-center justify-center px-1.5 py-0.5 text-[11px] font-bold text-blue-700 dark:text-blue-300 bg-blue-50 dark:bg-blue-950/80 border border-blue-200 dark:border-blue-800 rounded mx-0.5 hover:bg-blue-100 dark:hover:bg-blue-900 transition-colors align-baseline cursor-pointer"
        >
          {token}
        </button>,
      );
    }
    lastIndex = regex.lastIndex;
  }
  if (lastIndex < text.length) {
    parts.push(text.substring(lastIndex));
  }
  return <>{parts}</>;
}

function FormattedMessageContent({
  content,
  onCitationClick,
  isUser,
}: {
  content: string;
  onCitationClick?: (cite: Citation) => void;
  isUser?: boolean;
}) {
  if (!content) return null;

  if (isUser) {
    return (
      <div className="text-xs sm:text-sm leading-relaxed whitespace-pre-wrap">
        {content}
      </div>
    );
  }

  const lines = content.split("\n");
  const blocks: React.ReactNode[] = [];
  let currentTable: string[] = [];

  const flushTable = (key: number) => {
    if (currentTable.length === 0) return null;
    const tableLines = [...currentTable];
    currentTable = [];

    const headerRow = tableLines[0]
      ?.split("|")
      .map((c) => c.trim())
      .filter(Boolean);
    const bodyRows = tableLines.slice(2).map((row) =>
      row
        .split("|")
        .map((c) => c.trim())
        .filter(Boolean),
    );

    return (
      <div
        key={`table-${key}`}
        className="my-2.5 overflow-x-auto rounded-xl border border-slate-200 dark:border-slate-800 shadow-xs"
      >
        <table className="min-w-full divide-y divide-slate-200 dark:divide-slate-800 text-xs">
          {headerRow && (
            <thead className="bg-slate-100/80 dark:bg-slate-800/80 text-slate-900 dark:text-slate-100 font-bold">
              <tr>
                {headerRow.map((cell, cIdx) => (
                  <th key={cIdx} className="px-3 py-2 text-left font-semibold">
                    {parseInlineMarkdown(cell, onCitationClick)}
                  </th>
                ))}
              </tr>
            </thead>
          )}
          <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60 bg-white dark:bg-slate-900">
            {bodyRows.map((row, rIdx) => (
              <tr
                key={rIdx}
                className="hover:bg-slate-50/50 dark:hover:bg-slate-800/40 transition-colors"
              >
                {row.map((cell, cIdx) => (
                  <td
                    key={cIdx}
                    className="px-3 py-2 text-slate-700 dark:text-slate-300"
                  >
                    {parseInlineMarkdown(cell, onCitationClick)}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  };

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];

    if (line.trim().startsWith("|") && line.trim().endsWith("|")) {
      currentTable.push(line.trim());
      continue;
    } else if (currentTable.length > 0) {
      blocks.push(flushTable(i));
    }

    if (!line.trim()) {
      blocks.push(<div key={`empty-${i}`} className="h-1.5" />);
      continue;
    }

    if (line.startsWith("### ")) {
      blocks.push(
        <h3
          key={`h3-${i}`}
          className="text-xs sm:text-sm font-bold text-[#023E8A] dark:text-[#CAF0F8] mt-3 mb-1 flex items-center gap-1.5 border-b border-blue-100/60 dark:border-slate-800 pb-1"
        >
          {parseInlineMarkdown(line.replace(/^###\s+/, ""), onCitationClick)}
        </h3>,
      );
      continue;
    }

    if (line.startsWith("## ") || line.startsWith("# ")) {
      blocks.push(
        <h2
          key={`h2-${i}`}
          className="text-sm sm:text-base font-extrabold text-slate-900 dark:text-white mt-3.5 mb-1.5"
        >
          {parseInlineMarkdown(line.replace(/^#+\s+/, ""), onCitationClick)}
        </h2>,
      );
      continue;
    }

    if (line.startsWith("> ")) {
      blocks.push(
        <blockquote
          key={`quote-${i}`}
          className="border-l-4 border-blue-500 bg-blue-50/60 dark:bg-blue-950/40 p-2.5 my-2 rounded-r-lg text-xs sm:text-sm text-slate-700 dark:text-slate-300"
        >
          {parseInlineMarkdown(line.replace(/^>\s+/, ""), onCitationClick)}
        </blockquote>,
      );
      continue;
    }

    const numMatch = line.match(/^(\d+)\.\s+(.*)$/);
    if (numMatch) {
      blocks.push(
        <div
          key={`ol-${i}`}
          className="flex items-start gap-2 py-0.5 text-xs sm:text-sm pl-1"
        >
          <span className="font-bold text-blue-700 dark:text-blue-400 shrink-0 select-none">
            {numMatch[1]}.
          </span>
          <div className="flex-1 text-slate-800 dark:text-slate-200">
            {parseInlineMarkdown(numMatch[2], onCitationClick)}
          </div>
        </div>,
      );
      continue;
    }

    if (line.trim().startsWith("- ") || line.trim().startsWith("* ")) {
      const indent = line.search(/\S/);
      blocks.push(
        <div
          key={`ul-${i}`}
          className={`flex items-start gap-2 py-0.5 text-xs sm:text-sm ${indent > 2 ? "pl-5" : "pl-2"}`}
        >
          <span className="text-blue-500 font-bold shrink-0 select-none">
            •
          </span>
          <div className="flex-1 text-slate-800 dark:text-slate-200">
            {parseInlineMarkdown(
              line.trim().replace(/^[-*]\s+/, ""),
              onCitationClick,
            )}
          </div>
        </div>,
      );
      continue;
    }

    blocks.push(
      <p
        key={`p-${i}`}
        className="text-xs sm:text-sm leading-relaxed text-slate-800 dark:text-slate-200"
      >
        {parseInlineMarkdown(line, onCitationClick)}
      </p>,
    );
  }

  if (currentTable.length > 0) {
    blocks.push(flushTable(lines.length));
  }

  return <div className="space-y-1">{blocks}</div>;
}

function getInitialWelcomeMessage(
  lang: IndianLanguage = IndianLanguage.EN,
  sessionId: string = "default-session",
): ChatMessage {
  if (lang === IndianLanguage.HI) {
    return {
      id: "welcome-msg",
      sessionId,
      role: "assistant",
      content: `### बीआईएस सारथी में आपका स्वागत है 👋\nमैं भारतीय मानकों (IS), बीआईएस प्रमाणन योजनाओं (ISI / CRS / FMCS), परीक्षण धाराओं, मान्यता प्राप्त प्रयोगशालाओं और हॉलमार्किंग के लिए आपका साक्ष्य-समर्थित एआई निर्णय सहायक हूँ।\n\n**आप क्या जानना चाहते हैं?**\n- **उत्पाद अनुपालन**: "मैं स्टेनलेस स्टील की बोतलें बनाता हूँ। कौन सा मानक लागू होगा?"\n- **परीक्षण आवश्यकताएं**: "टीएमटी स्टील बार के लिए आवश्यक नियमित परीक्षण क्या हैं?"\n- **प्रमाणन मार्गदर्शन**: "क्या मुझे इलेक्ट्रॉनिक्स के लिए अनिवार्य पंजीकरण योजना (CRS) की आवश्यकता है?"\n- **हॉलमार्किंग**: "बीआईएस केयर ऐप पर 6-अंकीय HUID कोड को कैसे सत्यापित करें?"\n- **धारा व्याख्या**: "IS 10500 धारा 4.2 को सरल भाषा में समझाएं।"`,
      confidence: ConfidenceLevel.HIGH,
      suggestedFollowUps: [
        "मेरे उत्पाद के लिए मानक खोजें",
        "क्या मुझे बीआईएस प्रमाणन की आवश्यकता है?",
        "कौन से परीक्षण आवश्यक हैं?",
        "सोने के हॉलमार्क को कैसे सत्यापित करें?",
      ],
      createdAt: "2026-01-01T00:00:00.000Z",
    };
  }

  if (lang === IndianLanguage.BN) {
    return {
      id: "welcome-msg",
      sessionId,
      role: "assistant",
      content: `### বিআইএস সারথিতে আপনাকে স্বাগতম 👋\nআমি ভারতীয় মানক (IS), বিআইএস সার্টিফিকেশন স্কিম, টেস্টিং ক্লজ, গবেষণাগার এবং হলমার্কিংয়ের জন্য আপনার প্রমাণ-ভিত্তিক সিদ্ধান্ত সহায়ক।\n\n**আপনি কি অন্বেষণ করতে চান?**\n- **পণ্য সম্মতি**: "আমি স্টেইনলেস স্টিলের বোতল তৈরি করি। কোন মানক প্রযোজ্য?"\n- **পরীক্ষার প্রয়োজনীয়তা**: "TMT স্টিল বারের জন্য প্রয়োজনীয় নিয়মিত পরীক্ষাগুলি কি কি?"\n- **হলমার্কিং**: "BIS Care অ্যাপে ৬-সংখ্যার HUID কোড কীভাবে যাচাই করবেন?"`,
      confidence: ConfidenceLevel.HIGH,
      suggestedFollowUps: [
        "আমার পণ্যের জন্য মানক খুঁজুন",
        "বিআইএস সার্টিফিকেশন কি বাধ্যতামূলক?",
        "কি কি পরীক্ষা প্রয়োজন?",
        "সোনার হলমার্ক কীভাবে যাচাই করবেন?",
      ],
      createdAt: "2026-01-01T00:00:00.000Z",
    };
  }

  if (lang === IndianLanguage.TA) {
    return {
      id: "welcome-msg",
      sessionId,
      role: "assistant",
      content: `### BIS சாரதிக்கு வரவேற்கிறோம் 👋\nஇந்திய தரநிலைகள் (IS), சான்றிதழ் திட்டங்கள், சோதனை விதிகள் மற்றும் ஹால்மார்க்கிங் வழிகாட்டுதல்களுக்கான உங்களின் நம்பகமான AI உதவியாளர்.\n\n**நீங்கள் என்ன ஆராய விரும்புகிறீர்கள்?**\n- **தயாரிப்பு இணக்கம்**: "நான் துருப்பிடிக்காத எஃகு பாட்டில்களை உற்பத்தி செய்கிறேன். எந்த தரநிலை பொருந்தும்?"\n- **சோதனை தேவைகள்**: "TMT எஃகு கம்பிகளுக்கு என்ன வழக்கமான சோதனைகள் தேவை?"\n- **ஹால்மார்க்கிங்**: "BIS Care செயலியில் 6 இலக்க HUID குறியீட்டை எவ்வாறு சரிபார்ப்பது?"`,
      confidence: ConfidenceLevel.HIGH,
      suggestedFollowUps: [
        "எனது தயாரிப்புக்கான தரநிலையைக் கண்டறியவும்",
        "BIS சான்றிதழ் கட்டாயமா?",
        "என்ன சோதனைகள் தேவை?",
        "தங்க ஹால்மார்க்கை எவ்வாறு சரிபார்ப்பது?",
      ],
      createdAt: "2026-01-01T00:00:00.000Z",
    };
  }

  if (lang === IndianLanguage.TE) {
    return {
      id: "welcome-msg",
      sessionId,
      role: "assistant",
      content: `### BIS సారథికి స్వాగతం 👋\nభారతీయ ప్రమాణాలు (IS), ధృవీకరణ పథకాలు, పరీక్ష నిబంధనలు మరియు హాల్‌మార్కింగ్ కోసం మీ అధికారిక AI నిర్ణయ సహాయకుడు.\n\n**మీరు ఏమి తెలుసుకోవాలనుకుంటున్నారు?**\n- **ఉత్పత్తి సమ్మతి**: "నేను స్టెయిన్‌లెస్ స్టీల్ బాటిళ్లను తయారు చేస్తాను. ఏ ప్రమాణం వర్తిస్తుంది?"\n- **పరీక్ష అవసరాలు**: "TMT స్టీల్ బార్‌లకు అవసరమైన పరీక్షలు ఏమిటి?"\n- **హాల్‌మార్కింగ్**: "BIS Care యాప్‌లో 6-అంకెల HUID కోడ్‌ను ఎలా ధృవీకరించాలి?"`,
      confidence: ConfidenceLevel.HIGH,
      suggestedFollowUps: [
        "నా ఉత్పత్తికి ప్రమాణాన్ని కనుగొనండి",
        "BIS ధృవీకరణ తప్పనిసరి?",
        "ఏ పరీక్షలు అవసరం?",
        "బంగారు హాల్‌మార్క్‌ను ఎలా ధృవీకరించాలి?",
      ],
      createdAt: "2026-01-01T00:00:00.000Z",
    };
  }

  if (lang === IndianLanguage.MR) {
    return {
      id: "welcome-msg",
      sessionId,
      role: "assistant",
      content: `### बीआयएस सारथी मध्ये आपले स्वागत आहे 👋\nभारतीय मानके (IS), बीआयएस प्रमाणन योजना, चाचणी कलमे, मान्यताप्राप्त प्रयोगशाळा आणि हॉलमार्किंगसाठी मी तुमचा पुरावा-समर्थित एआय सहाय्यक आहे.\n\n**तुम्हाला काय जाणून घ्यायचे आहे?**\n- **उत्पादन अनुपालन**: "मी स्टेनलेस स्टीलच्या बाटल्या बनवतो. कोणते मानक लागू होईल?"\n- **चाचणी आवश्यकता**: "टीएमटी स्टील बारसाठी कोणत्या चाचण्या आवश्यक आहेत?"\n- **हॉलमार्किंग**: "BIS Care ॲपवर ६-अंकी HUID कोड कसा पडताळावा?"`,
      confidence: ConfidenceLevel.HIGH,
      suggestedFollowUps: [
        "माझ्या उत्पादनासाठी मानक शोधा",
        "मला बीआयएस प्रमाणन आवश्यक आहे का?",
        "कोणत्या चाचण्या आवश्यक आहेत?",
        "हॉलमार्क कसा पडताळावा?",
      ],
      createdAt: "2026-01-01T00:00:00.000Z",
    };
  }

  if (lang === IndianLanguage.GU) {
    return {
      id: "welcome-msg",
      sessionId,
      role: "assistant",
      content: `### BIS સારથીમાં આપનું સ્વાગત છે 👋\nહું ભારતીય ધોરણો (IS), BIS પ્રમાણપત્ર યોજનાઓ, પરીક્ષણ કલમો અને હોલમાર્કિંગ માટે તમારો પુરાવા-સમર્થિત AI સહાયક છું.\n\n**તમે શું જાણવા માંગો છો?**\n- **ઉત્પાદન અનુપાલન**: "હું સ્ટેનલેસ સ્ટીલની બોટલો બનાવું છું. કયું ધોરણ લાગુ થશે?"\n- **પરીક્ષણ જરૂરિયાતો**: "TMT સ્ટીલ બાર માટે કયા પરીક્ષણો જરૂરી છે?"\n- **હોલમાર્કિંગ**: "BIS Care એપ પર 6-અંકનો HUID કોડ કેવી રીતે ચકાસવો?"`,
      confidence: ConfidenceLevel.HIGH,
      suggestedFollowUps: [
        "મારા ઉત્પાદન માટે ધોરણ શોધો",
        "શું મને BIS પ્રમાણપત્રની જરૂર છે?",
        "કયા પરીક્ષણો જરૂરી છે?",
        "સોનાના હોલમાર્કની ચકાસણી કેવી રીતે કરવી?",
      ],
      createdAt: "2026-01-01T00:00:00.000Z",
    };
  }

  if (lang === IndianLanguage.KN) {
    return {
      id: "welcome-msg",
      sessionId,
      role: "assistant",
      content: `### BIS ಸಾರಥಿಗೆ ಸುಸ್ವಾಗತ 👋\nಭಾರತೀಯ ಮಾನದಂಡಗಳು (IS), BIS ಪ್ರಮಾಣೀಕರಣ ಯೋಜನೆಗಳು, ಪರೀಕ್ಷಾ ನಿಯಮಗಳು ಮತ್ತು ಹಾಲ್‌ಮಾರ್ಕಿಂಗ್‌ಗಾಗಿ ನಿಮ್ಮ ಅಧಿಕೃತ AI ನಿರ್ಧಾರ ಸಹಾಯಕ.\n\n**ನೀವು ಏನನ್ನು ತಿಳಿಯಲು ಬಯಸುತ್ತೀರಿ?**\n- **ಉತ್ಪನ್ನ ಅನುಸರಣೆ**: "ನಾನು ಸ್ಟೇನ್‌ಲೆಸ್ ಸ್ಟೀಲ್ ಬಾಟಲಿಗಳನ್ನು ತಯಾರಿಸುತ್ತೇನೆ. ಯಾವ ಮಾನದಂಡ ಅನ್ವಯಿಸುತ್ತದೆ?"\n- **ಪರೀಕ್ಷಾ ಅವಶ್ಯಕತೆಗಳು**: "TMT ಸ್ಟೀಲ್ ಬಾರ್‌ಗಳಿಗೆ ಅಗತ್ಯವಿರುವ ಪರೀಕ್ಷೆಗಳು ಯಾವುವು?"\n- **ಹಾಲ್‌ಮಾರ್ಕಿಂಗ್**: "BIS Care ಆಪ್‌ನಲ್ಲಿ 6-ಅಂಕಿಯ HUID ಕೋಡ್ ಪರಿಶೀಲಿಸುವುದು ಹೇಗೆ?"`,
      confidence: ConfidenceLevel.HIGH,
      suggestedFollowUps: [
        "ನನ್ನ ಉತ್ಪನ್ನಕ್ಕೆ ಮಾನದಂಡ ಹುಡುಕಿ",
        "BIS ಪ್ರಮಾಣೀಕರಣ ಕಡ್ಡಾಯವೇ?",
        "ಯಾವ ಪರೀಕ್ಷೆಗಳು ಬೇಕು?",
        "ಚಿನ್ನದ ಹಾಲ್‌ಮಾರ್ಕ್ ಪರಿಶೀಲಿಸುವುದು ಹೇಗೆ?",
      ],
      createdAt: "2026-01-01T00:00:00.000Z",
    };
  }

  if (lang === IndianLanguage.ML) {
    return {
      id: "welcome-msg",
      sessionId,
      role: "assistant",
      content: `### BIS സാരഥിയിലേക്ക് സ്വാഗതം 👋\nഇന്ത്യൻ മാനദണ്ഡങ്ങൾ (IS), സർട്ടിഫിക്കേഷൻ സ്കീമുകൾ, ടെസ്റ്റിംഗ് രീതികൾ, ഹാൾമാർക്കിംഗ് എന്നിവയ്ക്കായുള്ള നിങ്ങളുടെ AI സഹായി.\n\n**നിങ്ങൾക്ക് എന്താണ് അറിയേണ്ടത്?**\n- **ഉൽപ്പന്ന അനുസരണം**: "ഞാൻ സ്റ്റെയിൻലെസ് സ്റ്റീൽ കുപ്പികൾ നിർമ്മിക്കുന്നു. ഏത് മാനദണ്ഡമാണ് ബാധകമാകുന്നത്?"\n- **ടെസ്റ്റിംഗ് ആവശ്യകതകൾ**: "TMT സ്റ്റീൽ ബാറുകൾക്ക് ആവശ്യമായ പരിശോധനകൾ എന്തൊക്കെയാണ്?"\n- **ഹാൾമാർക്കിംഗ്**: "BIS Care ആപ്പിൽ 6 അക്ക HUID കോഡ് എങ്ങനെ പരിശോധിക്കാം?"`,
      confidence: ConfidenceLevel.HIGH,
      suggestedFollowUps: [
        "എന്റെ ഉൽപ്പന്നത്തിന് മാനദണ്ഡം കണ്ടെത്തുക",
        "BIS സർട്ടിഫിക്കേഷൻ ആവശ്യമാണോ?",
        "ഏതൊക്കെ പരിശോധനകൾ ആവശ്യമാണ്?",
        "സ്വർണ്ണ ഹാൾമാർക്ക് എങ്ങനെ പരിശോധിക്കാം?",
      ],
      createdAt: "2026-01-01T00:00:00.000Z",
    };
  }

  if (lang === IndianLanguage.PA) {
    return {
      id: "welcome-msg",
      sessionId,
      role: "assistant",
      content: `### BIS ਸਾਰਥੀ ਵਿੱਚ ਤੁਹਾਡਾ ਸਵਾਗਤ ਹੈ 👋\nਮੈਂ ਭਾਰਤੀ ਮਿਆਰਾਂ (IS), ਪ੍ਰਮਾਣੀਕਰਨ ਸਕੀਮਾਂ, ਟੈਸਟਿੰਗ ਧਾਰਾਵਾਂ ਅਤੇ ਹਾਲਮਾਰਕਿੰਗ ਲਈ ਤੁਹਾਡਾ ਸਬੂਤ-ਅਧਾਰਤ AI ਸਹਾਇਕ ਹਾਂ।\n\n**ਤੁਸੀਂ ਕੀ ਜਾਣਨਾ ਚਾਹੁੰਦੇ ਹੋ?**\n- **ਉਤਪਾਦ ਅਨੁਕੂਲਤਾ**: "ਮੈਂ ਸਟੇਨਲੈਸ ਸਟੀਲ ਦੀਆਂ ਬੋਤਲਾਂ ਬਣਾਉਂਦਾ ਹਾਂ। ਕਿਹੜਾ ਮਿਆਰ ਲਾਗੂ ਹੋਵੇਗਾ?"\n- **ਟੈਸਟਿੰਗ ਲੋੜਾਂ**: "TMT ਸਟੀਲ ਬਾਰਾਂ ਲਈ ਕਿਹੜੇ ਟੈਸਟ ਜ਼ਰੂਰੀ ਹਨ?"\n- **ਹਾਲਮਾਰਕਿੰਗ**: "BIS Care ਐਪ 'ਤੇ 6-ਅੰਕਾਂ ਵਾਲਾ HUID ਕੋਡ ਕਿਵੇਂ ਜਾਂਚੀਏ?"`,
      confidence: ConfidenceLevel.HIGH,
      suggestedFollowUps: [
        "ਮੇਰੇ ਉਤਪਾਦ ਲਈ ਮਿਆਰ ਲੱਭੋ",
        "ਕੀ BIS ਪ੍ਰਮਾਣੀਕਰਨ ਜ਼ਰੂਰੀ ਹੈ?",
        "ਕਿਹੜੇ ਟੈਸਟ ਲੋੜੀਂਦੇ ਹਨ?",
        "ਸੋਨੇ ਦੇ ਹਾਲਮਾਰਕ ਦੀ ਜਾਂਚ ਕਿਵੇਂ ਕਰੀਏ?",
      ],
      createdAt: "2026-01-01T00:00:00.000Z",
    };
  }

  if (lang === IndianLanguage.OR) {
    return {
      id: "welcome-msg",
      sessionId,
      role: "assistant",
      content: `### BIS ସାରଥିକୁ ସ୍ୱାଗତ 👋\nମୁଁ ଭାରତୀୟ ମାନକ (IS), ପ୍ରମାଣପତ୍ର ଯୋଜନା, ପରୀକ୍ଷଣ ପଦ୍ଧତି ଏବଂ ହଲମାର୍କିଂ ପାଇଁ ଆପଣଙ୍କର ପ୍ରମାଣ-ଭିତ୍ତିକ AI ସହାୟକ।\n\n**ଆପଣ କଣ ଜାଣିବାକୁ ଚାହାଁନ୍ତି?**\n- **ଉତ୍ପାଦ ଅନୁପାଳନ**: "ମୁଁ ଷ୍ଟେନଲେସ୍ ଷ୍ଟିଲ୍ ବୋତଲ ତିଆରି କରେ। କେଉଁ ମାନକ ଲାଗୁ ହେବ?"\n- **ପରୀକ୍ଷଣ ଆବଶ୍ୟକତା**: "TMT ଷ୍ଟିଲ୍ ବାର୍ ପାଇଁ କେଉଁ ପରୀକ୍ଷଣ ଆବଶ୍ୟକ?"\n- **ହଲମାର୍କିଂ**: "BIS Care ଆପ୍‌ରେ ୬-ଅଙ୍କ ବିଶିଷ୍ଟ HUID କୋଡ୍ କିପରି ଯାଞ୍ଚ କରିବେ?"`,
      confidence: ConfidenceLevel.HIGH,
      suggestedFollowUps: [
        "ମୋର ଉତ୍ପାଦ ପାଇଁ ମାନକ ଖୋଜନ୍ତୁ",
        "BIS ପ୍ରମାଣପତ୍ର ଆବଶ୍ୟକ କି?",
        "କେଉଁ ପରୀକ୍ଷଣ ଆବଶ୍ୟକ?",
        "ସୁନା ହଲମାର୍କ କିପରି ଯାଞ୍ଚ କରିବେ?",
      ],
      createdAt: "2026-01-01T00:00:00.000Z",
    };
  }

  if (lang === IndianLanguage.UR) {
    return {
      id: "welcome-msg",
      sessionId,
      role: "assistant",
      content: `### BIS سارتھی میں خوش آمدید 👋\nمیں ہندوستانی معیارات (IS)، سرٹیفیکیشن اسکیموں، ٹیسٹنگ کے طریقہ کار اور ہال مارکنگ کے لیے آپ کا مستند AI معاون ہوں۔\n\n**آپ کیا جاننا چاہتے ہیں؟**\n- **مصنوعات کی تعمیل**: "میں سٹینلیس سٹیل کی بوتلیں بناتا ہوں۔ کون سا معیار لاگو ہوگا؟"\n- **ٹیسٹنگ کی ضروریات**: "TMT سٹیل بارز کے لیے کیا ٹیسٹ درکار ہیں؟"\n- **ہال مارکنگ**: "BIS Care ایپ پر 6 ہندسوں کا HUID کوڈ کیسے تصدیق کریں؟"`,
      confidence: ConfidenceLevel.HIGH,
      suggestedFollowUps: [
        "میری پروڈکٹ کے لیے معیار تلاش کریں",
        "کیا مجھے BIS سرٹیفیکیشن کی ضرورت ہے؟",
        "کون سے ٹیسٹ درکار ہیں؟",
        "سونے کے ہال مارک کی تصدیق کیسے کریں؟",
      ],
      createdAt: "2026-01-01T00:00:00.000Z",
    };
  }

  if (lang === IndianLanguage.AS) {
    return {
      id: "welcome-msg",
      sessionId,
      role: "assistant",
      content: `### BIS সাৰথীলৈ স্বাগতম 👋\nমই ভাৰতীয় মানক (IS), প্ৰমাণপত্ৰ আঁচনি, পৰীক্ষণ পদ্ধতি আৰু হলমাৰ্কিংৰ বাবে আপোনাৰ প্ৰমাণ-ভিত্তিক AI সহায়ক।\n\n**আপুনি কি জানিব বিচাৰে?**\n- **সামগ্ৰীৰ অনুপালন**: "মই ষ্টেইনলেছ ষ্টীলৰ বটল বনাওঁ। কোনটো মানক প্ৰযোজ্য হ’ব?"\n- **পৰীক্ষণৰ প্ৰয়োজনীয়তা**: "TMT ষ্টীল বাৰৰ বাবে কি পৰীক্ষা প্ৰয়োজন?"\n- **হলমাৰ্কিং**: "BIS Care এপত ৬-সংখ্যাৰ HUID ক’ড কেনেকৈ পৰীক্ষা কৰিব?"`,
      confidence: ConfidenceLevel.HIGH,
      suggestedFollowUps: [
        "মোৰ সামগ্ৰীৰ বাবে মানক বিচাৰক",
        "BIS প্ৰমাণপত্ৰ প্ৰয়োজনীয়নে?",
        "কি কি পৰীক্ষা প্ৰয়োজন?",
        "সোণৰ হলমাৰ্ক কেনেকৈ পৰীক্ষা কৰিব?",
      ],
      createdAt: "2026-01-01T00:00:00.000Z",
    };
  }

  if (lang === IndianLanguage.SAN) {
    return {
      id: "welcome-msg",
      sessionId,
      role: "assistant",
      content: `### बीआईएस सारथी इत्यत्र स्वागतम् 👋\nअहं भारतीयमानकानां (IS), बीआईएस-प्रमाणीकरणयोजनानां, परीक्षणविधीनां, हॉल्मार्किङ्गस्य च कृते भवतः प्रमाण-आधारितः एआई-सहायकः अस्मि।\n\n**भवन्तः किं ज्ञातुम् इच्छन्ति?**\n- **उत्पाद-अनुपालनम्**: "अहं स्टेनलेस स्टील कूपिकाः निर्मामि। किं मानकं प्रयोक्तव्यम्?"\n- **परीक्षण-आवश्यकताः**: "TMT लोह-दण्डानां कृते कानि परीक्षणानि आवश्यकानि?"\n- **हॉल्मार्किङ्गम्**: "BIS Care ॲप् मध्ये ६-अङ्कीय-HUID-सङ्केतं कथं सत्यापनीयम्?"`,
      confidence: ConfidenceLevel.HIGH,
      suggestedFollowUps: [
        "ममोत्पादार्थं मानकं अन्विष्यतु",
        "किं बीआईएस-प्रमाणीकरणं अनिवार्यम्?",
        "कानि परीक्षणानि आवश्यकानि?",
        "स्वर्णहॉल्मार्कं कथं सत्यापनीयम्?",
      ],
      createdAt: "2026-01-01T00:00:00.000Z",
    };
  }

  // Default English
  return {
    id: "welcome-msg",
    sessionId,
    role: "assistant",
    content: `### Welcome to SentinelX 👋\nI am your evidence-backed decision assistant for Indian Standards (IS), BIS certification schemes (ISI / CRS / FMCS), testing clauses, laboratory accreditation, and hallmarking.\n\n**What would you like to explore?**\n- **Product Compliance**: "I manufacture stainless steel bottles. Which standard applies?"\n- **Testing Requirements**: "What are the routine tests required for TMT steel bars?"\n- **Certification Guidance**: "Do I need Compulsory Registration Scheme (CRS) for electronics?"\n- **Hallmarking**: "How do I verify a 6-digit HUID code on BIS Care App?"\n- **Clause Explanation**: "Explain IS 10500 Clause 4.2 in simple language."`,
    confidence: ConfidenceLevel.HIGH,
    suggestedFollowUps: [
      "Find standard for my product",
      "Do I need BIS certification?",
      "What tests are required?",
      "How to verify a gold hallmark?",
    ],
    createdAt: "2026-01-01T00:00:00.000Z",
  };
}

function ChatContent() {
  const searchParams = useSearchParams();
  const initialQuery = searchParams.get("q") || "";
  const initialRole =
    (searchParams.get("role") as UserRole) || UserRole.INDUSTRY;

  const {
    t,
    language: selectedLanguage,
    setLanguage: setSelectedLanguage,
  } = useTranslation();

  const [sessions, setSessions] = useState<ChatSession[]>([]);
  const [currentSessionId, setCurrentSessionId] =
    useState<string>("default-session");
  const [messages, setMessages] = useState<ChatMessage[]>(() => [
    getInitialWelcomeMessage(selectedLanguage, "default-session"),
  ]);
  const [inputQuery, setInputQuery] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [activeEvidenceList, setActiveEvidenceList] = useState<Evidence[]>([]);
  const [activeEvidenceId, setActiveEvidenceId] = useState<
    string | undefined
  >();
  const [isEvidencePanelOpen, setIsEvidencePanelOpen] = useState(true);
  const [copiedMsgId, setCopiedMsgId] = useState<string | null>(null);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const initialQueryHandled = useRef(false);

  // Dynamic language update for the initial greeting card
  useEffect(() => {
    setMessages((prev) => {
      if (prev.length === 1 && prev[0].id === "welcome-msg") {
        return [getInitialWelcomeMessage(selectedLanguage, currentSessionId)];
      }
      return prev;
    });
  }, [selectedLanguage, currentSessionId]);

  // Handle URL query parameter if passed from landing page
  useEffect(() => {
    if (initialQuery && !initialQueryHandled.current) {
      initialQueryHandled.current = true;
      handleSendMessage(initialQuery);
    }
  }, [initialQuery]);

  // Auto-scroll chat stream to bottom when messages update (chatbot behavior)
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({
      behavior: "smooth",
      block: "end",
    });
  }, [messages, isLoading]);

  const handleSendMessage = async (queryText?: string) => {
    const textToSend = queryText || inputQuery;
    if (!textToSend.trim() || isLoading) return;

    setInputQuery("");
    setIsLoading(true);

    const userMessage: ChatMessage = {
      id: `user-${Date.now()}`,
      sessionId: currentSessionId,
      role: "user",
      content: textToSend,
      originalLanguage: selectedLanguage,
      createdAt: new Date().toISOString(),
    };

    setMessages((prev) => [...prev, userMessage]);

    try {
      const res = await apiClient.sendMessage({
        sessionId: currentSessionId,
        message: textToSend,
        roleMode: initialRole,
        language: selectedLanguage,
      });

      setMessages((prev) => [...prev, res.reply]);

      if (res.reply.evidence && res.reply.evidence.length > 0) {
        setActiveEvidenceList(res.reply.evidence);
        setActiveEvidenceId(res.reply.evidence[0].id);
        setIsEvidencePanelOpen(true);
      }
    } catch (err: any) {
      const errorMsg: ChatMessage = {
        id: `err-${Date.now()}`,
        sessionId: currentSessionId,
        role: "assistant",
        content: `Unable to process query: ${err.message || "Server connection issue. Please verify backend API status."}\n\nYou can also verify directly on the official BIS portal (https://www.services.bis.gov.in).`,
        confidence: ConfidenceLevel.LOW,
        createdAt: new Date().toISOString(),
      };
      setMessages((prev) => [...prev, errorMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCitationClick = (citation: Citation) => {
    if (citation.evidenceId) {
      setActiveEvidenceId(citation.evidenceId);
      setIsEvidencePanelOpen(true);
    }
  };

  const handleFeedback = async (
    messageId: string,
    type: "HELPFUL" | "NOT_HELPFUL" | "REPORTED",
  ) => {
    try {
      await apiClient.submitFeedback({ messageId, feedback: type as any });
      setMessages((prev) =>
        prev.map((m) => (m.id === messageId ? { ...m, feedback: type } : m)),
      );
    } catch {
      // ignore
    }
  };

  const handleCopyMessage = (msgId: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedMsgId(msgId);
    setTimeout(() => setCopiedMsgId(null), 2000);
  };

  const startNewChat = () => {
    const newId = `session-${Date.now()}`;
    setCurrentSessionId(newId);
    setMessages([getInitialWelcomeMessage(selectedLanguage, newId)]);
    setActiveEvidenceList([]);
    setActiveEvidenceId(undefined);
  };

  return (
    <div className="flex flex-col lg:flex-row h-[calc(100dvh-105px)] overflow-hidden bg-slate-100 dark:bg-slate-950">
      {/* 1. LEFT SIDEBAR */}
      <aside className="hidden lg:flex flex-col w-64 bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 shrink-0">
        <div className="p-3 border-b border-slate-200 dark:border-slate-800">
          <button
            type="button"
            onClick={startNewChat}
            className="flex items-center justify-center gap-2 w-full py-2 px-3 rounded-lg text-xs font-bold bg-gradient-to-r from-[#023E8A] via-[#0077B6] to-[#0077B6] hover:from-[#03045E] hover:to-[#023E8A] text-white shadow-sm shadow-[#0077B6]/25 transition-all cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>{t("chat.new_session", "New Chat Session")}</span>
          </button>
        </div>

        {/* Quick Tools Navigation */}
        <div className="p-3 border-b border-slate-200 dark:border-slate-800 space-y-1">
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 px-2">
            {t("chat.specialized_tools", "BIS Specialized Tools")}
          </span>
          <Link
            href="/standards/recommend"
            className="flex items-center gap-2 px-2.5 py-1.5 rounded-md text-xs font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <Compass className="w-3.5 h-3.5 text-blue-600" />
            <span>{t("chat.find_standard", "Find My Standard")}</span>
          </Link>
          <Link
            href="/certification"
            className="flex items-center gap-2 px-2.5 py-1.5 rounded-md text-xs font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <Award className="w-3.5 h-3.5 text-amber-600" />
            <span>
              {t("chat.certification_schemes", "Certification Schemes")}
            </span>
          </Link>
          <Link
            href="/testing"
            className="flex items-center gap-2 px-2.5 py-1.5 rounded-md text-xs font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <FlaskConical className="w-3.5 h-3.5 text-indigo-600" />
            <span>
              {t("chat.testing_requirements", "Testing Requirements")}
            </span>
          </Link>
          <Link
            href="/laboratories"
            className="flex items-center gap-2 px-2.5 py-1.5 rounded-md text-xs font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <Building2 className="w-3.5 h-3.5 text-emerald-600" />
            <span>{t("chat.find_lab", "Find Recognized Lab")}</span>
          </Link>
          <Link
            href="/reports"
            className="flex items-center gap-2 px-2.5 py-1.5 rounded-md text-xs font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <FileBarChart2 className="w-3.5 h-3.5 text-rose-600" />
            <span>
              {t("chat.generate_report", "Generate Compliance Report")}
            </span>
          </Link>
        </div>

        {/* Sessions list */}
        <div className="flex-1 overflow-y-auto p-3 space-y-1">
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 px-2">
            {t("chat.active_workspace", "Active Workspace")}
          </span>
          <div className="p-2.5 rounded-lg bg-blue-50/70 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-900 text-xs font-semibold text-blue-900 dark:text-blue-200 truncate">
            {t("chat.current_investigation", "Current Investigation")}
          </div>
        </div>

        {/* Footer info */}
        <div className="p-3 border-t border-slate-200 dark:border-slate-800 text-[11px] text-slate-500 space-y-1 pb-16">
          <div className="flex items-center gap-1.5 text-emerald-600 dark:text-emerald-400 font-semibold">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>
              {t("chat.grounded_active", "Grounded Retrieval Active")}
            </span>
          </div>
          <p className="text-[10px]">
            {t(
              "chat.grounded_desc",
              "Answers verified against published Gazette notifications.",
            )}
          </p>
        </div>
      </aside>

      {/* 2. CENTER CONVERSATION AREA */}
      <section className="flex-1 flex flex-col h-full bg-slate-50 dark:bg-slate-950 overflow-hidden relative min-h-0">
        {/* Top Chat Bar */}
        <div className="px-4 py-2.5 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2">
            <div className="p-1 rounded bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-400">
              <Bot className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-xs font-bold text-slate-800 dark:text-slate-200">
                {t("chat.conversation_title", "SentinelX Conversation")}
              </h2>
              <span className="text-[10px] text-slate-500">
                {t("chat.mode", "Mode:")} {initialRole}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-800/80 px-2 py-0.5 rounded-lg border border-slate-200 dark:border-slate-700">
              <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider hidden sm:inline">
                {t("chat.language_label", "Language:")}
              </span>
              <LanguageSelector
                selectedLanguage={selectedLanguage}
                onLanguageChange={setSelectedLanguage}
              />
            </div>

            <button
              type="button"
              onClick={() => setIsEvidencePanelOpen(!isEvidencePanelOpen)}
              className={`text-xs px-2.5 py-1 rounded font-medium border transition-colors ${
                isEvidencePanelOpen
                  ? "bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-950 dark:text-blue-300 dark:border-blue-800"
                  : "bg-white text-slate-600 border-slate-200 dark:bg-slate-800 dark:text-slate-300"
              }`}
            >
              {t("chat.evidence_panel_btn", "Evidence Panel")} (
              {activeEvidenceList.length})
            </button>
          </div>
        </div>

        {/* Messages Stream */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6 min-h-0">
          {messages.map((msg, index) => {
            const isUser = msg.role === "user";
            return (
              <div
                key={msg.id || index}
                className={`flex gap-3 max-w-4xl mx-auto ${isUser ? "justify-end" : "justify-start"}`}
              >
                {!isUser && (
                  <div className="w-7 h-7 rounded-lg bg-blue-700 text-white flex items-center justify-center shrink-0 mt-0.5 shadow-sm">
                    <Bot className="w-4 h-4" />
                  </div>
                )}

                <div
                  className={`flex flex-col space-y-2 max-w-[85%] rounded-2xl p-4 shadow-sm ${
                    isUser
                      ? "bg-blue-700 text-white rounded-tr-none"
                      : "bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-slate-100 rounded-tl-none"
                  }`}
                >
                  {/* Assistant Meta Header */}
                  {!isUser && (
                    <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-2 mb-1">
                      <div className="flex items-center gap-2">
                        {msg.confidence && (
                          <ConfidenceBadge
                            level={msg.confidence}
                            language={selectedLanguage}
                          />
                        )}
                        {msg.sourceFreshnessWarning && (
                          <span className="text-[10px] px-2 py-0.5 rounded bg-amber-50 text-amber-700 font-medium">
                            {t("evidence.freshness_notice", "Source Notice")}
                          </span>
                        )}
                      </div>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <button
                            type="button"
                            onClick={() =>
                              handleCopyMessage(msg.id, msg.content)
                            }
                            className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-1 inline-flex items-center justify-center"
                          >
                            {copiedMsgId === msg.id ? (
                              <Check className="w-3.5 h-3.5 text-emerald-600" />
                            ) : (
                              <Copy className="w-3.5 h-3.5" />
                            )}
                          </button>
                        </TooltipTrigger>
                        <TooltipContent className="px-2 py-0.5 text-[11px] rounded bg-gray-500 text-white shadow-sm">
                          <p>
                            {copiedMsgId === msg.id
                              ? t("chat.copied", "Copied")
                              : t("chat.copy_answer", "Copy answer")}
                          </p>
                        </TooltipContent>
                      </Tooltip>
                    </div>
                  )}

                  {/* Message Body */}
                  <div className="text-xs sm:text-sm leading-relaxed max-w-none">
                    <FormattedMessageContent
                      content={msg.content}
                      isUser={isUser}
                      onCitationClick={handleCitationClick}
                    />
                  </div>

                  {/* Citations Badges if available */}
                  {!isUser && msg.citations && msg.citations.length > 0 && (
                    <div className="pt-3 border-t border-slate-100 dark:border-slate-800 space-y-1.5">
                      <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">
                        {t(
                          "chat.traceable_citations",
                          "Traceable Authoritative Citations:",
                        )}
                      </span>
                      <div className="flex flex-wrap gap-1">
                        {msg.citations.map((cite, cIdx) => (
                          <CitationBadge
                            key={cIdx}
                            citation={cite}
                            onClick={handleCitationClick}
                          />
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Suggested follow-up prompt pills */}
                  {!isUser &&
                    msg.suggestedFollowUps &&
                    msg.suggestedFollowUps.length > 0 && (
                      <div className="pt-2 flex flex-wrap gap-1.5">
                        {msg.suggestedFollowUps.map((followUp, fIdx) => (
                          <button
                            key={fIdx}
                            type="button"
                            onClick={() => handleSendMessage(followUp)}
                            className="text-[11px] px-2.5 py-1 rounded-full bg-slate-100 dark:bg-slate-800 hover:bg-blue-50 hover:text-blue-700 dark:hover:bg-blue-950/60 dark:hover:text-blue-300 text-slate-600 dark:text-slate-300 transition-colors text-left"
                          >
                            {followUp} →
                          </button>
                        ))}
                      </div>
                    )}

                  {/* Assistant Footer Feedback */}
                  {!isUser && (
                    <div className="pt-2 flex items-center justify-between text-[11px] text-slate-400">
                      <FormattedTime dateString={msg.createdAt} />
                      <div className="flex items-center gap-1.5">
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <button
                              type="button"
                              onClick={() => handleFeedback(msg.id, "HELPFUL")}
                              className={`p-1 rounded hover:bg-slate-100 dark:hover:bg-slate-800 ${
                                msg.feedback === "HELPFUL"
                                  ? "text-emerald-600"
                                  : ""
                              }`}
                            >
                              <ThumbsUp className="w-3.5 h-3.5" />
                            </button>
                          </TooltipTrigger>
                          <TooltipContent
                            className="px-2 py-0.5 text-[11px] rounded bg-gray-500 text-white shadow-sm"
                            sideOffset={7}
                            side="bottom"
                          >
                            <p>{t("chat.helpful", "Helpful response")}</p>
                          </TooltipContent>
                        </Tooltip>

                        <Tooltip>
                          <TooltipTrigger asChild>
                            <button
                              type="button"
                              onClick={() =>
                                handleFeedback(msg.id, "NOT_HELPFUL")
                              }
                              className={`p-1 rounded hover:bg-slate-100 dark:hover:bg-slate-800 ${
                                msg.feedback === "NOT_HELPFUL"
                                  ? "text-rose-600"
                                  : ""
                              }`}
                            >
                              <ThumbsDown className="w-3.5 h-3.5" />
                            </button>
                          </TooltipTrigger>
                          <TooltipContent
                            className="px-2 py-0.5 text-[11px] rounded bg-gray-500 text-white shadow-sm"
                            sideOffset={7}
                            side="bottom"
                          >
                            <p>{t("chat.not_helpful", "Not helpful")}</p>
                          </TooltipContent>
                        </Tooltip>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <button
                              type="button"
                              onClick={() => handleFeedback(msg.id, "REPORTED")}
                              className={`p-1 rounded hover:bg-slate-100 dark:hover:bg-slate-800 ${
                                msg.feedback === "REPORTED"
                                  ? "text-amber-600"
                                  : ""
                              }`}
                            >
                              <Flag className="w-3.5 h-3.5" />
                            </button>
                          </TooltipTrigger>
                          <TooltipContent
                            className="px-2 py-0.5 text-[11px] rounded bg-gray-500 text-white shadow-sm"
                            sideOffset={7}
                            side="bottom"
                          >
                            <p>
                              {t(
                                "chat.report_citation",
                                "Report inaccurate citation",
                              )}
                            </p>
                          </TooltipContent>
                        </Tooltip>
                      </div>
                    </div>
                  )}
                </div>

                {isUser && (
                  <div className="w-7 h-7 rounded-lg bg-slate-800 text-white flex items-center justify-center shrink-0 mt-0.5 shadow-sm">
                    <User className="w-4 h-4" />
                  </div>
                )}
              </div>
            );
          })}

          {isLoading && (
            <div className="flex gap-3 max-w-4xl mx-auto items-start">
              <div className="w-7 h-7 rounded-lg bg-blue-700 text-white flex items-center justify-center shrink-0 shadow-sm animate-pulse">
                <Bot className="w-4 h-4" />
              </div>
              <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-2">
                <div className="flex items-center gap-2 text-xs font-semibold text-blue-700 dark:text-blue-400">
                  <Sparkles className="w-3.5 h-3.5 animate-spin" />
                  <span>
                    {t(
                      "chat.searching_status",
                      "Searching BIS Repository & Retrieving Clauses...",
                    )}
                  </span>
                </div>
                <div className="w-48 h-2 bg-slate-200 dark:bg-slate-700 rounded animate-pulse" />
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Bottom Input Form */}
        <div className="p-4 bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 shrink-0">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSendMessage();
            }}
            className="max-w-4xl mx-auto"
          >
            <div className="relative flex items-center bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-300 dark:border-slate-700 focus-within:border-blue-600 transition-all p-1.5">
              <input
                type="text"
                value={inputQuery}
                onChange={(e) => setInputQuery(e.target.value)}
                placeholder={t(
                  "chat.input_placeholder",
                  "Ask about standards, certification, test methods, lab credentials, or clauses...",
                )}
                disabled={isLoading}
                className="w-full px-3 py-2 text-xs sm:text-sm text-slate-900 dark:text-slate-100 bg-transparent border-none outline-none ring-0 shadow-none focus:outline-none focus:ring-0 focus-visible:outline-none focus-visible:ring-0 placeholder:text-slate-400"
              />
              <button
                type="submit"
                disabled={isLoading || !inputQuery.trim()}
                className="p-2 rounded-lg bg-blue-700 hover:bg-blue-800 disabled:opacity-40 text-white shadow-sm transition-all"
                aria-label="Send message"
              >
                <Send className="w-4 h-4" />
              </button>
            </div>
            <div className="flex items-center justify-between px-2 pt-2 text-[10px] text-slate-400">
              <span>
                {t(
                  "chat.disclaimer",
                  "Grounding: Strict adherence to Indian Standards. Never fabricates requirements.",
                )}
              </span>
              <span>
                {t("chat.bis_act_compliant", "BIS Act 2016 Compliant")}
              </span>
            </div>
          </form>
        </div>
      </section>

      {/* 3. RIGHT EVIDENCE PANEL */}
      {isEvidencePanelOpen && (
        <>
          {/* Mobile Backdrop */}
          <div
            onClick={() => setIsEvidencePanelOpen(false)}
            className="fixed inset-0 bg-black/40 z-40 lg:hidden"
          />

          <aside className="fixed inset-x-0 bottom-0 z-50 h-[65vh] rounded-t-2xl shadow-xl lg:static lg:h-full lg:w-80 xl:w-96 lg:rounded-none lg:shadow-none lg:border-t-0 lg:border-l border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 overflow-y-auto transition-transform">
            <div className="lg:hidden flex justify-center py-2">
              <div className="w-10 h-1 rounded-full bg-slate-300 dark:bg-slate-700" />
            </div>
            <EvidencePanel
              evidenceList={activeEvidenceList}
              activeEvidenceId={activeEvidenceId}
              onSelectEvidence={setActiveEvidenceId}
              onClose={() => setIsEvidencePanelOpen(false)}
              language={selectedLanguage}
            />
          </aside>
        </>
      )}
    </div>
  );
}

export default function ChatWorkspacePage() {
  return (
    <React.Suspense
      fallback={
        <div className="p-8 text-center text-xs text-slate-500">
          Loading SentinelX Workspace...
        </div>
      }
    >
      <ChatContent />
    </React.Suspense>
  );
}
