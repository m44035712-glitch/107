"use client";

import { FormEvent, useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { useTranslation } from "@/lib/i18n";
import { apiClient } from "@bis/api-client";
import {
  Bell,
  Bot,
  ClipboardCheck,
  CheckCircle2,
  ChevronRight,
  ChevronDown,
  FileText,
  FlaskConical,
  GraduationCap,
  Handshake,
  Info,
  Maximize2,
  Minus,
  Paperclip,
  PanelRightClose,
  PanelRightOpen,
  Send,
  Minimize2,
  Mic,
  X,
  UserRound,
} from "lucide-react";

const notifications = [
  {
    title: "New Standard Published",
    text: "IS 302-2-17:2024 (Safety of household and similar electrical appliances) is now available.",
    date: "23 Sep 2025 • 10:24 AM",
    icon: FileText,
    color: "text-blue-600 bg-blue-50",
  },
  {
    title: "Certification Update",
    text: "Your application for ISI Mark certification (Ref: C-2025-7843) has been approved.",
    date: "22 Sep 2025 • 04:17 PM",
    icon: CheckCircle2,
    color: "text-emerald-600 bg-emerald-50",
  },
  {
    title: "Lab Notice",
    text: "Testing slots for Electrical Products - October 2025 are now open.",
    date: "21 Sep 2025 • 11:03 AM",
    icon: FlaskConical,
    color: "text-violet-600 bg-violet-50",
  },
  {
    title: "Important Notice",
    text: "Revised format for Hallmark application forms effective from 1 Oct 2025.",
    date: "20 Sep 2025 • 09:45 AM",
    icon: Info,
    color: "text-amber-600 bg-amber-50",
  },
];

type VoiceRecognition = {
  lang: string;
  interimResults: boolean;
  start: () => void;
  stop: () => void;
  onresult: ((event: { results: ArrayLike<ArrayLike<{ transcript: string }>> }) => void) | null;
  onerror: (() => void) | null;
  onend: (() => void) | null;
};

type VoiceWindow = Window & {
  SpeechRecognition?: new () => VoiceRecognition;
  webkitSpeechRecognition?: new () => VoiceRecognition;
};

export default function LandingPage() {
  const router = useRouter();
  const { t } = useTranslation();
  const [activeMode, setActiveMode] = useState("seller");
  const [message, setMessage] = useState("");
  const [submittedMessage, setSubmittedMessage] = useState("");
  const [chatReply, setChatReply] = useState("");
  const [chatLoading, setChatLoading] = useState(false);
  const [voiceListening, setVoiceListening] = useState(false);
  const voiceRecognitionRef = useRef<VoiceRecognition | null>(null);
  const [showNotifications, setShowNotifications] = useState(false);
  const [notificationsExpanded, setNotificationsExpanded] = useState(true);
  const [showChat, setShowChat] = useState(false);
  const [chatExpanded, setChatExpanded] = useState(false);
  const [labNotification, setLabNotification] = useState<{ title: string; text: string; date: string; icon: typeof ClipboardCheck; color: string } | null>(null);

  useEffect(() => {
    const savedApplication = window.localStorage.getItem("bis-lab-application");
    if (savedApplication) {
      const application = JSON.parse(savedApplication);
      setLabNotification({ title: application.title, text: application.text, date: application.date, icon: ClipboardCheck, color: "text-cyan-600 bg-cyan-50" });
    }
  }, []);

  const visibleNotifications = labNotification ? [labNotification, ...notifications] : notifications;
  const profileModes = [
    {
      id: "seller",
      title: t("home.mode_seller", "Product Seller"),
      subtitle: t("home.mode_industry", "Industry / MSME"),
      description: t(
        "hero.subtitle",
        "Standards, Certification Schemes, Lab Testing, Compliance Roadmap",
      ),
      audience: t("home.mode_admin", "MANUFACTURERS & LABS"),
      icon: Handshake,
      href: "/seller",
    },
    {
      id: "consumer",
      title: t("home.mode_consumer", "Consumer"),
      description: t(
        "home.mode_consumer_placeholder",
        "Verify ISI Mark, Gold Hallmark, HUD Check, Consumer Grievance",
      ),
      audience: t("home.mode_consumer", "BUYERS & PUBLIC"),
      icon: UserRound,
      href: "/consumer",
    },
    {
      id: "industry",
      title: t("home.mode_industry", "Industry / MSME"),
      description: t(
        "home.mode_student_placeholder",
        "Technical Clauses, Standards Explorer, Comparative Analysis",
      ),
      audience: t("home.mode_student", "ACADEMIA & ANALYSIS"),
      icon: GraduationCap,
      href: "/standards",
    },
  ];

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const query = message.trim();
    if (!query || chatLoading) return;
    setSubmittedMessage(query);
    setMessage("");
    setChatLoading(true);
    try {
      const response = await apiClient.sendMessage({ message: query, roleMode: activeMode, language: "en" });
      setChatReply(response.reply.content);
    } catch (error) {
      setChatReply(error instanceof Error ? `Unable to connect to BIS AI: ${error.message}` : "Unable to connect to BIS AI.");
    } finally {
      setChatLoading(false);
    }
  };

  const handleVoiceInput = () => {
    if (voiceListening) {
      voiceRecognitionRef.current?.stop();
      return;
    }
    const voiceConstructor = (window as VoiceWindow).SpeechRecognition || (window as VoiceWindow).webkitSpeechRecognition;
    if (!voiceConstructor) {
      setChatReply("Voice input is not supported in this browser. Please type your question.");
      return;
    }
    const recognition = new voiceConstructor();
    voiceRecognitionRef.current = recognition;
    recognition.lang = "en-IN";
    recognition.interimResults = false;
    recognition.onresult = (event) => setMessage(event.results[0][0].transcript);
    recognition.onerror = () => setVoiceListening(false);
    recognition.onend = () => setVoiceListening(false);
    setVoiceListening(true);
    recognition.start();
  };

  return (
    <main className="landing-page relative min-h-[calc(100vh-4rem)] overflow-hidden bg-[#05072e] text-[#d9f6ff]">
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-52 overflow-hidden opacity-70">
        <div className="absolute -bottom-32 left-[-8%] h-56 w-[65%] rounded-[50%] bg-[#023E8A] blur-[1px]" />
        <div className="absolute -bottom-36 right-[-5%] h-60 w-[70%] rounded-[50%] bg-[#0077B6]" />
        <div className="absolute -bottom-44 left-[29%] h-56 w-[55%] rounded-[50%] border border-white/70" />
      </div>

      <div className="relative mx-auto grid min-h-[calc(100vh-4rem)] max-w-[1540px] gap-5 px-4 py-4 lg:grid-cols-[218px_minmax(0,1fr)_220px] lg:px-5">
        <div className="mb-3 flex items-center justify-between lg:hidden">
          <button type="button" onClick={() => setShowNotifications((current) => !current)} className="inline-flex items-center gap-2 rounded-xl border border-[#12304A] bg-[#10283c] px-3 py-2 text-[11px] font-bold text-[#d9f6ff] shadow-sm">
            <Bell className="h-4 w-4 text-[#0077B6]" /> Notifications <span className="rounded-full bg-[#ff4058] px-1.5 py-0.5 text-[9px] text-white">3</span><ChevronDown className={`h-3.5 w-3.5 transition-transform ${showNotifications ? "rotate-180" : ""}`} />
          </button>
          <span className="text-[10px] font-semibold uppercase tracking-[0.16em] text-[#6582a2]">BIS SentinelX</span>
        </div>

        <aside className={`${showNotifications ? "block" : "hidden"} ${notificationsExpanded ? "lg:w-[218px] lg:min-h-[560px]" : "lg:w-[46px] lg:min-h-[430px]"} relative mb-4 rounded-2xl border border-[#12304A] bg-[#10283c]/95 shadow-[0_8px_30px_rgba(0,0,0,0.22)] transition-[width,min-height] duration-300 lg:mb-0 lg:block lg:absolute lg:left-5 lg:top-4`}>
          <button type="button" onClick={() => setNotificationsExpanded((current) => !current)} aria-label={notificationsExpanded ? "Collapse notifications" : "Expand notifications"} className="absolute -right-3 top-1/2 z-10 flex h-6 w-6 -translate-y-1/2 items-center justify-center rounded-full border border-[#12304A] bg-[#10283c] text-[#48CAE4] shadow-sm transition hover:bg-[#023E8A]">
            {notificationsExpanded ? <PanelRightClose className="h-3.5 w-3.5" /> : <PanelRightOpen className="h-3.5 w-3.5" />}
          </button>
          <div className={`${notificationsExpanded ? "flex" : "lg:hidden"} items-center justify-between border-b border-[#12304A] px-3 py-4`}>
            <div className="flex items-center gap-2 text-xs font-bold">
              <Bell className="h-4 w-4 text-[#48CAE4]" />
              Notifications <span className="rounded-full bg-[#ff4058] px-1.5 py-0.5 text-[10px] text-white">3</span>
            </div>
            <button type="button" className="text-[10px] font-bold text-[#48CAE4]">View All <ChevronRight className="inline h-3 w-3" /></button>
          </div>
          <div className={`${notificationsExpanded ? "block" : "lg:hidden"} px-3`}>
            {visibleNotifications.map((notification) => {
              const Icon = notification.icon;
              return (
                <button type="button" key={notification.title} className="block w-full border-b border-[#12304A] py-3 text-left transition-colors hover:bg-[#023E8A] last:border-0">
                  <div className="flex gap-2">
                    <span className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full ${notification.color}`}><Icon className="h-3.5 w-3.5" /></span>
                    <div>
                      <p className="text-[11px] font-bold text-[#d9f6ff]">{notification.title}</p>
                      <p className="mt-1 text-[10px] leading-[1.45] text-[#9dc5dc]">{notification.text}</p>
                      <p className="mt-1.5 text-[9px] text-[#789ab0]">{notification.date}</p>
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </aside>

        <section className="flex min-h-[calc(100vh-7rem)] flex-col items-center pt-5 text-center sm:pt-10 lg:col-start-2">
          <h1 className="max-w-3xl bg-gradient-to-r from-[#0077B6] via-[#48CAE4] to-[#5aff90] bg-clip-text text-4xl font-black leading-[1.08] tracking-[-0.04em] text-transparent sm:text-5xl lg:text-[52px]">
            {t("hero.title", "Your AI Assistant for Indian Standards & BIS Services")}
          </h1>
          <p className="mt-5 max-w-2xl text-sm leading-relaxed text-[#c9e0ef] sm:text-[15px]">
            {t("hero.subtitle", "Find the right standard. Understand certification schemes. Verify hallmarking and test clauses with evidence-backed, zero-hallucination AI.")}
          </p>

          <div className="mt-9 w-full max-w-[780px] text-left">
            <p className="mb-3 text-[10px] font-bold uppercase tracking-[0.1em] text-[#d9f6ff]">{t("hero.select_profile", "Select your profile mode:")}</p>
            <div className="grid gap-3 md:grid-cols-3">
              {profileModes.map((mode) => {
                const Icon = mode.icon;
                const active = activeMode === mode.id;
                return (
                  <button key={mode.id} type="button" onClick={() => { setActiveMode(mode.id); router.push(mode.href); }} className={`group min-h-[142px] rounded-2xl border p-4 text-left transition-all hover:-translate-y-0.5 ${active ? "border-[#48CAE4] bg-[#12304A] shadow-[0_10px_26px_rgba(0,157,232,0.18)] ring-1 ring-[#0077B6]" : "border-[#12304A] bg-[#10283c] hover:border-[#0077B6] hover:shadow-[0_8px_20px_rgba(0,0,0,0.18)]"}`}>
                    <div className="flex items-start justify-between gap-2">
                      <span className={`flex h-9 w-9 items-center justify-center rounded-full ${active ? "bg-[#023E8A] text-[#48CAE4]" : "bg-[#12304A] text-[#90E0EF]"}`}><Icon className="h-4 w-4" /></span>
                      {active && <span className="rounded-full bg-[#0077B6] px-2 py-0.5 text-[8px] font-bold text-white">ACTIVE</span>}
                    </div>
                    <p className="mt-3 text-[13px] font-bold text-[#d9f6ff]">{mode.title}</p>
                    {mode.subtitle && <p className="mt-0.5 text-[10px] font-semibold text-[#9dc5dc]">{mode.subtitle}</p>}
                    <p className="mt-1 text-[10px] leading-snug text-[#9dc5dc]">{mode.description}</p>
                    <div className="mt-3 flex items-center justify-between text-[8px] font-bold tracking-[0.04em] text-[#789ab0]"><span>{mode.audience}</span><span className={`h-1.5 w-1.5 rounded-full ${active ? "bg-[#48CAE4]" : "bg-[#0077B6]"}`} /></div>
                  </button>
                );
              })}
            </div>
          </div>
        </section>

        <button type="button" onClick={() => setShowChat(true)} className={`${showChat ? "hidden" : "flex"} fixed bottom-5 right-5 z-30 h-12 items-center gap-2 rounded-full bg-[#0077B6] px-4 text-xs font-bold text-white shadow-lg shadow-[#0077B6]/25 lg:hidden`}><Bot className="h-4 w-4" /> BIS AI Assistant</button>

        <aside className={`${showChat ? "flex" : "hidden"} ${chatExpanded ? "lg:w-[360px]" : "lg:w-[218px]"} fixed inset-x-4 bottom-4 z-40 h-[min(650px,calc(100vh-2rem))] flex-col overflow-hidden rounded-2xl border border-[#12304A] bg-[#10283c] text-[10px] shadow-[0_10px_34px_rgba(0,0,0,0.22)] transition-[width] duration-300 lg:h-[560px] lg:min-h-[560px] lg:static lg:col-start-3 lg:row-start-1 lg:flex lg:justify-self-end lg:shadow-[0_10px_34px_rgba(0,0,0,0.2)]`}>
          <div className="flex items-center justify-between bg-gradient-to-r from-[#0077B6] to-[#00B4D8] px-3 py-3 text-white">
            <div className="flex items-center gap-2"><span className="flex h-7 w-7 items-center justify-center rounded-full bg-white/20"><Bot className="h-4 w-4" /></span><div><p className="text-xs font-bold">BIS AI Assistant</p><p className="text-[9px] text-[#CAF0F8]"><span className="mr-1 inline-block h-1.5 w-1.5 rounded-full bg-[#5aff90]" />Online</p></div></div>
            <div className="flex items-center gap-1"><button type="button" aria-label={chatExpanded ? "Shrink chat" : "Expand chat"} onClick={() => setChatExpanded((current) => !current)} className="hidden rounded-md p-1 text-white/80 transition hover:bg-white/15 hover:text-white lg:block">{chatExpanded ? <Minimize2 className="h-3.5 w-3.5" /> : <Maximize2 className="h-3.5 w-3.5" />}</button><button type="button" aria-label="Minimize chat" onClick={() => setShowChat(false)} className="rounded-md p-1 text-white/80 transition hover:bg-white/15 hover:text-white"><Minus className="h-4 w-4" /></button><button type="button" aria-label="Close chat" onClick={() => setShowChat(false)} className="rounded-md p-1 text-white/80 transition hover:bg-white/15 hover:text-white"><X className="h-4 w-4" /></button></div>
          </div>
          <div className="flex min-h-0 flex-1 flex-col gap-3 overflow-y-auto p-3">
            <div className="rounded-xl bg-[#12304A] p-3 text-[#9dc5dc]"><p className="font-bold text-[#d9f6ff]">🤖 &nbsp;{t("chat.welcome_title", "Hello! I’m your BIS AI assistant")} 👋</p><p className="mt-1">{t("chat.specialized_tools", "I can help you with:")}</p><ul className="mt-2 space-y-1 text-[9px]"><li>♧ &nbsp;{t("chat.find_standard", "Standards and IS codes")}</li><li>♧ &nbsp;{t("chat.certification_schemes", "Certification schemes")}</li><li>♧ &nbsp;{t("chat.testing_requirements", "Lab testing and compliance")}</li><li>♧ &nbsp;{t("chat.find_lab", "Find a recognized lab")}</li><li>♧ &nbsp;{t("chat.generate_report", "Generate a compliance report")}</li></ul></div>
            {submittedMessage && <div className="self-end rounded-xl bg-[#023E8A] px-3 py-2 text-[#d9f6ff]">{submittedMessage}</div>}
            {chatReply && <div className="rounded-xl bg-[#12304A] p-3 text-[#9dc5dc] whitespace-pre-wrap">{chatReply}</div>}
            <div className="rounded-xl bg-[#023E8A] px-3 py-2 text-[#d9f6ff]">{t("chat.input_placeholder", "Ask me anything about BIS services, standards, certification, or testing.")}</div>
            <p className="mt-auto text-[9px] text-[#789ab0]">10:24 AM</p>
          </div>
          <form onSubmit={handleSubmit} className="m-3 flex items-center gap-2 rounded-full border border-[#12304A] bg-[#0d2234] px-2 py-1.5 shadow-sm"><button type="button" aria-label="Attach a file" className="text-[#789ab0]"><Paperclip className="h-4 w-4" /></button><button type="button" aria-label={voiceListening ? "Stop voice input" : "Start voice input"} title={voiceListening ? "Stop voice input" : "Voice input"} onClick={handleVoiceInput} disabled={chatLoading} className={`flex h-6 w-6 items-center justify-center rounded-full transition ${voiceListening ? "bg-red-100 text-red-600" : "text-[#789ab0] hover:bg-[#12304A] hover:text-[#48CAE4]"}`}><Mic className="h-3.5 w-3.5" /></button><input value={message} onChange={(event) => setMessage(event.target.value)} placeholder={voiceListening ? "Listening..." : chatLoading ? "BIS AI is responding..." : "Type your question..."} disabled={chatLoading} className="min-w-0 flex-1 bg-transparent px-1 text-[10px] text-[#d9f6ff] outline-none placeholder:text-[#789ab0]" /><button type="submit" aria-label="Send message" disabled={chatLoading} className="flex h-6 w-6 items-center justify-center rounded-full bg-[#0077B6] text-white hover:bg-[#023E8A] disabled:cursor-not-allowed disabled:opacity-50"><Send className="h-3.5 w-3.5" /></button></form>
        </aside>

      </div>
    </main>
  );
}
