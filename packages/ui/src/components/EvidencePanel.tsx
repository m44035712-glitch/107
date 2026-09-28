import React from "react";
import { Evidence, IndianLanguage } from "@bis/shared-types";
import {
  ExternalLink,
  Copy,
  Check,
  FileText,
  BookOpen,
  AlertTriangle,
} from "lucide-react";
import { SourceFreshnessBadge } from "./SourceFreshnessBadge";

export interface EvidencePanelLabels {
  title?: string;
  indianStandard?: string;
  clause?: string;
  page?: string;
  publication?: string;
  relevance?: string;
  freshnessNotice?: string;
  freshnessDesc?: string;
  verbatimExcerpt?: string;
  copyExcerpt?: string;
  copied?: string;
  viewSource?: string;
  noEvidenceTitle?: string;
  noEvidenceDesc?: string;
}

interface EvidencePanelProps {
  evidenceList: Evidence[];
  activeEvidenceId?: string;
  onSelectEvidence?: (id: string) => void;
  onClose?: () => void;
  className?: string;
  language?: IndianLanguage;
  labels?: EvidencePanelLabels;
}

const DEFAULT_LABELS: Record<string, EvidencePanelLabels> = {
  [IndianLanguage.EN]: {
    title: "Authoritative Evidence",
    indianStandard: "Indian Standard",
    clause: "Clause:",
    page: "Page:",
    publication: "Publication:",
    relevance: "Relevance:",
    freshnessNotice: "Freshness Notice:",
    freshnessDesc:
      "This version of the standard may have subsequent amendments or reaffirmations. Verify against the current BIS Gazette list.",
    verbatimExcerpt: "Verbatim Clause Excerpt",
    copyExcerpt: "Copy Excerpt",
    copied: "Copied",
    viewSource: "View Source on Official BIS Portal",
    noEvidenceTitle: "No Evidence Referenced",
    noEvidenceDesc:
      "Ask a question or select a standard to inspect grounded Bureau of Indian Standards evidence clauses and Gazette excerpts.",
  },
  [IndianLanguage.HI]: {
    title: "प्रामाणिक साक्ष्य और उद्धरण",
    indianStandard: "भारतीय मानक (Indian Standard)",
    clause: "खंड (Clause):",
    page: "पृष्ठ (Page):",
    publication: "प्रकाशन तिथि:",
    relevance: "प्रासंगिकता (Relevance):",
    freshnessNotice: "नवीनता सूचना:",
    freshnessDesc:
      "इस मानक में संशोधन या पुनः पुष्टि हो सकती है। वर्तमान बीआईएस राजपत्र सूची से सत्यापित करें।",
    verbatimExcerpt: "मूल मानक धारा उद्धरण (Verbatim Excerpt)",
    copyExcerpt: "उद्धरण कॉपी करें",
    copied: "कॉपी किया गया",
    viewSource: "आधिकारिक बीआईएस पोर्टल पर स्रोत देखें",
    noEvidenceTitle: "कोई साक्ष्य संदर्भित नहीं है",
    noEvidenceDesc:
      "बीआईएस मानक धाराओं और राजपत्र अंशों का निरीक्षण करने के लिए कोई प्रश्न पूछें या मानक चुनें।",
  },
  [IndianLanguage.TA]: {
    title: "அதிகாரப்பூர்வ சான்றுகள் மற்றும் மேற்கோள்கள்",
    indianStandard: "இந்திய தரநிலை (Indian Standard)",
    clause: "பிரிவு (Clause):",
    page: "பக்கம் (Page):",
    publication: "வெளியீட்டு தேதி:",
    relevance: "பொருத்தம் (Relevance):",
    freshnessNotice: "புதிய நிலை அறிவிப்பு:",
    freshnessDesc:
      "இந்த தரநிலையின் திருத்தங்கள் அல்லது புதுப்பிப்புகளை அதிகாரப்பூர்வ BIS வர்த்தமானியில் சரிபார்க்கவும்.",
    verbatimExcerpt: "அசல் தரநிலை பிரிவு மேற்கோள்",
    copyExcerpt: "மேற்கோளை நகலெடுக்கவும்",
    copied: "நகலெடுக்கப்பட்டது",
    viewSource: "அதிகாரப்பூர்வ BIS தளத்தில் பார்க்கவும்",
    noEvidenceTitle: "எந்த சான்றும் குறிப்பிடப்படவில்லை",
    noEvidenceDesc:
      "BIS தரநிலை பிரிவுகள் மற்றும் வர்த்தமானி சான்றுகளை பார்க்க ஏதேனும் கேள்வி கேளுங்கள்.",
  },
  [IndianLanguage.TE]: {
    title: "అధికారిక ఆధారాలు మరియు అనులేఖనాలు",
    indianStandard: "భారతీయ ప్రమాణం (Indian Standard)",
    clause: "నియమం (Clause):",
    page: "పేజీ (Page):",
    publication: "ప్రచురణ తేదీ:",
    relevance: "ప్రాముఖ్యత (Relevance):",
    freshnessNotice: "తాజా సమాచార నోటీసు:",
    freshnessDesc:
      "ఈ ప్రమాణానికి సంబంధించిన తాజా సవరణలను అధికారిక BIS గెజిట్‌లో సరిచూసుకోండి.",
    verbatimExcerpt: "మూల ప్రమాణ నిబంధన భాగం",
    copyExcerpt: "కాపీ చేయండి",
    copied: "కాపీ చేయబడింది",
    viewSource: "అధికారిక BIS పోర్టల్‌లో చూడండి",
    noEvidenceTitle: "ఎలాంటి ఆధారం ప్రస్తావించబడలేదు",
    noEvidenceDesc:
      "BIS ప్రమాణాల నిబంధనలను పరిశీలించడానికి ప్రశ్నను అడగండి లేదా ప్రమాణాన్ని ఎంచుకోండి.",
  },
  [IndianLanguage.BN]: {
    title: "প্রামাণ্য প্রমাণ ও উদ্ধৃতি",
    indianStandard: "ভারতীয় মানক (Indian Standard)",
    clause: "ধারা (Clause):",
    page: "পৃষ্ঠা (Page):",
    publication: "প্রকাশের তারিখ:",
    relevance: "প্রাসঙ্গিকতা (Relevance):",
    freshnessNotice: "উৎস বিজ্ঞপ্তি:",
    freshnessDesc:
      "এই মানকের সংশোধন বা নবায়ন সংক্রান্ত তথ্য সরকারি BIS গেজেটে যাচাই করুন।",
    verbatimExcerpt: "মূল মানক ধারা উদ্ধৃতি",
    copyExcerpt: "উদ্ধৃতি কপি করুন",
    copied: "কপি করা হয়েছে",
    viewSource: "অফিসিয়াল BIS পোর্টালে উৎস দেখুন",
    noEvidenceTitle: "কোনো প্রমাণ উল্লেখিত নেই",
    noEvidenceDesc:
      "BIS মানক ধারা ও প্রমাণ পরীক্ষা করতে প্রশ্ন জিজ্ঞাসা করুন বা মানক নির্বাচন করুন।",
  },
  [IndianLanguage.MR]: {
    title: "अधिकृत पुरावे आणि उद्धरणे",
    indianStandard: "भारतीय मानक (Indian Standard)",
    clause: "कलम (Clause):",
    page: "पृष्ठ (Page):",
    publication: "प्रकाशन दिनांक:",
    relevance: "सुसंगतता (Relevance):",
    freshnessNotice: "ताजी सूचना:",
    freshnessDesc:
      "या मानकातील दुरुस्त्या किंवा फेरबदल अधिकृत BIS गॅझेटमध्ये तपासा.",
    verbatimExcerpt: "मूळ मानक कलम उद्धरण",
    copyExcerpt: "उद्धरण कॉपी करा",
    copied: "कॉपी केले",
    viewSource: "अधिकृत BIS पोर्टलवर स्रोत पहा",
    noEvidenceTitle: "कोणताही पुरावा संदर्भित नाही",
    noEvidenceDesc:
      "BIS मानक कलमे आणि राजपत्र तपासण्यासाठी प्रश्न विचारा किंवा मानक निवडा.",
  },
  [IndianLanguage.GU]: {
    title: "સત્તાવાર પુરાવા અને સંદર્ભો",
    indianStandard: "ભારતીય ધોરણ (Indian Standard)",
    clause: "કલમ (Clause):",
    page: "પૃષ્ઠ (Page):",
    publication: "પ્રકાશન તારીખ:",
    relevance: "પ્રાસંગિકતા (Relevance):",
    freshnessNotice: "તાજી માહિતી નોટિસ:",
    freshnessDesc: "આ ધોરણમાં સુધારાઓ માટે સત્તાવાર BIS ગેઝેટ ચકાસો.",
    verbatimExcerpt: "મૂળ ધોરણ કલમ અંશ",
    copyExcerpt: "અંશ કૉપિ કરો",
    copied: "કૉપિ થઈ ગયું",
    viewSource: "સત્તાવાર BIS પોર્ટલ પર સ્ત્રોત જુઓ",
    noEvidenceTitle: "કોઈ પુરાવો સંદર્ભિત નથી",
    noEvidenceDesc:
      "BIS ધોરણો અને પુરાવાઓ જોવા માટે પ્રશ્ન પૂછો અથવા ધોરણ પસંદ કરો.",
  },
  [IndianLanguage.KN]: {
    title: "ಅಧಿಕೃತ ಪುರಾವೆ ಮತ್ತು ಉಲ್ಲೇಖಗಳು",
    indianStandard: "ಭಾರತೀಯ ಮಾನಕ (Indian Standard)",
    clause: "ವಿಧಿ (Clause):",
    page: "ಪುಟ (Page):",
    publication: "ಪ್ರಕಟಣೆ ದಿನಾಂಕ:",
    relevance: "ಪ್ರಸ್ತುತತೆ (Relevance):",
    freshnessNotice: "ಮೂಲ ಸೂಚನೆ:",
    freshnessDesc:
      "ಈ ಮಾನಕದ ಇತ್ತೀಚಿನ ತಿದ್ದುಪಡಿಗಳನ್ನು ಅಧಿಕೃತ BIS ಗೆಜೆಟ್‌ನಲ್ಲಿ ಪರಿಶೀಲಿಸಿ.",
    verbatimExcerpt: "ಮೂಲ ಮಾನಕ ವಿಧಿ ಉಲ್ಲೇಖ",
    copyExcerpt: "ಉಲ್ಲೇಖ ನಕಲಿಸಿ",
    copied: "ನಕಲಿಸಲಾಗಿದೆ",
    viewSource: "ಅಧಿಕೃತ BIS ಪೋರ್ಟಲ್‌ನಲ್ಲಿ ವೀಕ್ಷಿಸಿ",
    noEvidenceTitle: "ಯಾವುದೇ ಪುರಾವೆ ಉಲ್ಲೇಖಿಸಿಲ್ಲ",
    noEvidenceDesc:
      "BIS ಮಾನಕ ವಿಧಿಗಳನ್ನು ವೀಕ್ಷಿಸಲು ಪ್ರಶ್ನೆ ಕೇಳಿ ಅಥವಾ ಮಾನಕವನ್ನು ಆಯ್ಕೆಮಾಡಿ.",
  },
  [IndianLanguage.ML]: {
    title: "ആധികാരിക തെളിവുകളും ഉദ്ധരണികളും",
    indianStandard: "ഇന്ത്യൻ സ്റ്റാൻഡേർഡ് (Indian Standard)",
    clause: "വകുപ്പ് (Clause):",
    page: "പേജ് (Page):",
    publication: "പ്രസിദ്ധീകരണ തീയതി:",
    relevance: "പ്രസക്തി (Relevance):",
    freshnessNotice: "അറിയിപ്പ്:",
    freshnessDesc:
      "ഈ മാനദണ്ഡത്തിന്റെ ഏറ്റവും പുതിയ ഭേദഗതികൾ ഔദ്യോഗിക BIS ഗസറ്റിൽ പരിശോധിക്കുക.",
    verbatimExcerpt: "യഥാർത്ഥ മാനദണ്ഡ വകുപ്പ് ഉദ്ധരണി",
    copyExcerpt: "പകർപ്പവകാശം എടുക്കുക",
    copied: "പകർത്തി",
    viewSource: "ഔദ്യോഗിക BIS പോർട്ടലിൽ കാണുക",
    noEvidenceTitle: "തെളിവുകളൊന്നും പരാമർശിച്ചിട്ടില്ല",
    noEvidenceDesc:
      "BIS മാനദണ്ഡങ്ങളും തെളിവുകളും പരിശോധിക്കാൻ ഒരു ചോദ്യം ചോദിക്കുക.",
  },
  [IndianLanguage.PA]: {
    title: "ਅਧਿਕਾਰਤ ਸਬੂਤ ਅਤੇ ਹਵਾਲੇ",
    indianStandard: "ਭਾਰਤੀ ਮਿਆਰ (Indian Standard)",
    clause: "ਧਾਰਾ (Clause):",
    page: "ਸਫ਼ਾ (Page):",
    publication: "ਪ੍ਰਕਾਸ਼ਨ ਮਿਤੀ:",
    relevance: "ਢੁਕਵਾਂਪਣ (Relevance):",
    freshnessNotice: "ਸੂਚਨਾ:",
    freshnessDesc: "ਇਸ ਮਿਆਰ ਦੇ ਨਵੇਂ ਸੋਧਾਂ ਲਈ ਸਰਕਾਰੀ BIS ਗਜ਼ਟ ਦੀ ਜਾਂਚ ਕਰੋ।",
    verbatimExcerpt: "ਅਸਲ ਮਿਆਰ ਧਾਰਾ ਦਾ ਅੰਸ਼",
    copyExcerpt: "ਹਵਾਲਾ ਕਾਪੀ ਕਰੋ",
    copied: "ਕਾਪੀ ਕੀਤਾ ਗਿਆ",
    viewSource: "ਸਰਕਾਰੀ BIS ਪੋਰਟਲ ਤੇ ਵੇਖੋ",
    noEvidenceTitle: "ਕੋਈ ਸਬੂਤ ਨਹੀਂ ਦਿੱਤਾ ਗਿਆ",
    noEvidenceDesc: "BIS ਮਿਆਰ ਧਾਰਾਵਾਂ ਵੇਖਣ ਲਈ ਕੋਈ ਸਵਾਲ ਪੁੱਛੋ ਜਾਂ ਮਿਆਰ ਚੁਣੋ।",
  },
  [IndianLanguage.OR]: {
    title: "ପ୍ରାମାଣିକ ପ୍ରମାଣ ଏବଂ ଉଦ୍ଧୃତି",
    indianStandard: "ଭାରତୀୟ ମାନକ (Indian Standard)",
    clause: "ଧାରା (Clause):",
    page: "ପୃଷ୍ଠା (Page):",
    publication: "ପ୍ରକାଶନ ତାରିଖ:",
    relevance: "ପ୍ରାସଙ୍ଗିକତା (Relevance):",
    freshnessNotice: "ସୂଚନା:",
    freshnessDesc: "ଏହି ମାନକର ନୂତନ ସଂଶୋଧନ ପାଇଁ ସରକାରୀ BIS ଗେଜେଟ ଯାଞ୍ଚ କରନ୍ତୁ।",
    verbatimExcerpt: "ମୂଳ ମାନକ ଧାରା ଉଦ୍ଧୃତି",
    copyExcerpt: "ଉଦ୍ଧୃତି କପି କରନ୍ତୁ",
    copied: "କପି ହୋଇଛି",
    viewSource: "ସରକାରୀ BIS ପୋର୍ଟାଲରେ ଦେଖନ୍ତୁ",
    noEvidenceTitle: "କୌଣସି ପ୍ରମାଣ ଉଲ୍ଲେଖ ନାହିଁ",
    noEvidenceDesc:
      "BIS ମାନକ ଧାରା ଦେଖିବା ପାଇଁ ପ୍ରଶ୍ନ ପଚାରନ୍ତୁ କିମ୍ବା ମାନକ ଚୟନ କରନ୍ତୁ।",
  },
  [IndianLanguage.UR]: {
    title: "مستند شواہد اور حوالہ جات",
    indianStandard: "ہندوستانی معیار (Indian Standard)",
    clause: "شق (Clause):",
    page: "صفحہ (Page):",
    publication: "تاریخ اشاعت:",
    relevance: "مطابقت (Relevance):",
    freshnessNotice: "تازہ ترین نوٹس:",
    freshnessDesc: "اس معیار میں ترامیم کی توثیق کے لیے سرکاری BIS گزٹ دیکھیں۔",
    verbatimExcerpt: "اصل معیار کی شق کا اقتباس",
    copyExcerpt: "اقتباس کاپی کریں",
    copied: "کاپی ہو گیا",
    viewSource: "سرکاری BIS پورٹل پر ماخذ دیکھیں",
    noEvidenceTitle: "کوئی حوالہ شدہ ثبوت نہیں ہے",
    noEvidenceDesc:
      "BIS معیار کی شقوں کو دیکھنے کے لیے کوئی سوال پوچھیں یا معیار منتخب کریں۔",
  },
  [IndianLanguage.AS]: {
    title: "প্ৰামাণিক প্ৰমাণ আৰু উদ্ধৃতি",
    indianStandard: "ভাৰতীয় মানক (Indian Standard)",
    clause: "ধাৰা (Clause):",
    page: "পৃষ্ঠা (Page):",
    publication: "প্ৰকাশৰ তাৰিখ:",
    relevance: "প্ৰাসংগিকতা (Relevance):",
    freshnessNotice: "জাননী:",
    freshnessDesc: "এই মানকৰ শেহতীয়া সংশোধনী চৰকাৰী BIS গেজেটত পৰীক্ষা কৰক।",
    verbatimExcerpt: "মূল মানক ধাৰা উদ্ধৃতি",
    copyExcerpt: "উদ্ধৃতি নকল কৰক",
    copied: "নকল কৰা হ’ল",
    viewSource: "চৰকাৰী BIS পোৰ্টেলত চাওক",
    noEvidenceTitle: "কোনো প্ৰমাণ উল্লেখ কৰা নাই",
    noEvidenceDesc: "BIS মানক ধাৰা পৰিদৰ্শন কৰিবলৈ প্ৰশ্ন সোধক বা মানক বাছক।",
  },
  [IndianLanguage.SAN]: {
    title: "प्रामाणिकानि प्रमाणानि उद्धरणानि च",
    indianStandard: "भारतीयमानकम् (Indian Standard)",
    clause: "खण्डः (Clause):",
    page: "पृष्ठम् (Page):",
    publication: "प्रकाशन-दिनाङ्कः:",
    relevance: "प्रासङ्गिकता (Relevance):",
    freshnessNotice: "नवीनता-सूचना:",
    freshnessDesc:
      "अस्य मानकस्य नूतनसंशोधनानि आधिकारिके बीआईएस-राजपत्रे सत्यापयन्तु।",
    verbatimExcerpt: "मूलमानकखण्डोद्धरणम्",
    copyExcerpt: "उद्धरणं प्रतिलिखतु",
    copied: "प्रतिलिखितम्",
    viewSource: "आधिकारिके बीआईएस-जालपुटे पश्यतु",
    noEvidenceTitle: "किमपि प्रमाणं न उल्लिखितम्",
    noEvidenceDesc:
      "बीआईएस-मानकखण्डान् राजपत्रभागान् च परीक्षितुं प्रश्नं पृच्छतु मानकं वा चिनोतु।",
  },
  [IndianLanguage.NEP]: {
    title: "आधिकारिक प्रमाण र उद्धरणहरू",
    indianStandard: "भारतीय मानक (Indian Standard)",
    clause: "दफा (Clause):",
    page: "पृष्ठ (Page):",
    publication: "प्रकाशन मिति:",
    relevance: "प्रासंगिकता (Relevance):",
    freshnessNotice: "ताजा सूचना:",
    freshnessDesc:
      "यस मानकका नवीनतम संशोधनहरूको लागि आधिकारिक BIS राजपत्र हेर्नुहोस्।",
    verbatimExcerpt: "मूल मानक दफा उद्धरण",
    copyExcerpt: "उद्धरण प्रतिलिपि गर्नुहोस्",
    copied: "प्रतिलिपि गरियो",
    viewSource: "आधिकारिक BIS पोर्टलमा स्रोत हेर्नुहोस्",
    noEvidenceTitle: "कुनै प्रमाण उल्लेख गरिएको छैन",
    noEvidenceDesc:
      "BIS मानक दफाहरू र राजपत्र अंशहरू हेर्न प्रश्न सोध्नुहोस् वा मानक छान्नुहोस्।",
  },
  [IndianLanguage.KOK]: {
    title: "अधिकृत पुरावो आनी संदर्भ",
    indianStandard: "भारतीय मानक (Indian Standard)",
    clause: "कलम (Clause):",
    page: "पान (Page):",
    publication: "प्रकाशन तारीख:",
    relevance: "सुसंगतता (Relevance):",
    freshnessNotice: "ताजी सुचोवणी:",
    freshnessDesc: "ह्या मानकातल्या दुरुस्त्यां खातीर अधिकृत BIS गॅझेट पळयात.",
    verbatimExcerpt: "मूळ मानक कलम संदर्भ",
    copyExcerpt: "संदर्भ कॉपी करात",
    copied: "कॉपी केली",
    viewSource: "अधिकृत BIS पोर्टलाचेर पळयात",
    noEvidenceTitle: "कसलोच पुरावो उल्लेखीला ना",
    noEvidenceDesc: "BIS मानक कलमां तपासपाक प्रस्न विचारात वा मानक निवडात.",
  },
  [IndianLanguage.MAI]: {
    title: "प्रामाणिक साक्ष्य आ उद्धरण",
    indianStandard: "भारतीय मानक (Indian Standard)",
    clause: "खंड (Clause):",
    page: "पृष्ठ (Page):",
    publication: "प्रकाशन तिथि:",
    relevance: "प्रासंगिकता (Relevance):",
    freshnessNotice: "नवीनता सूचना:",
    freshnessDesc: "एहि मानकक नवीनतम संशोधन लेल आधिकारिक बीआईएस राजपत्र देखू।",
    verbatimExcerpt: "मूल मानक धारा उद्धरण",
    copyExcerpt: "उद्धरण कॉपी करू",
    copied: "कॉपी कएल गेल",
    viewSource: "आधिकारिक बीआईएस पोर्टल पर स्रोत देखू",
    noEvidenceTitle: "कोनो साक्ष्य संदर्भित नहि अछि",
    noEvidenceDesc:
      "बीआईएस मानक धारा आ राजपत्र अंश देखबाक लेल प्रश्न पूछू वा मानक चुनू।",
  },
  [IndianLanguage.DOG]: {
    title: "प्रामाणिक प्रमाण ते हवाले",
    indianStandard: "भारतीय मानक (Indian Standard)",
    clause: "धारा (Clause):",
    page: "सफा (Page):",
    publication: "प्रकाशन मिती:",
    relevance: "प्रासंगिकता (Relevance):",
    freshnessNotice: "ताजा सूचना:",
    freshnessDesc: "इस मानक च नवीं तरमीम लेई सरकारी BIS गजट दिखो।",
    verbatimExcerpt: "मूल मानक धारा दा अंश",
    copyExcerpt: "हवाला कॉपी करो",
    copied: "कॉपी कीता गेआ",
    viewSource: "सरकारी BIS पोर्टल पर स्रोत दिखो",
    noEvidenceTitle: "कोई सबूत नेईं दित्ता गेआ",
    noEvidenceDesc: "BIS मानक धारा दिखणे लेई सवाल पुच्छो जां मानक चुनो।",
  },
  [IndianLanguage.BOD]: {
    title: "थार साखि आरो बिमुंफोर",
    indianStandard: "भारतारि मानथाखि (Indian Standard)",
    clause: "बाहागो (Clause):",
    page: "बिलाइ (Page):",
    publication: "फोसावनाय खालार:",
    relevance: "गोरोबनाय (Relevance):",
    freshnessNotice: "गोदान मिथिहोनाय:",
    freshnessDesc: "बे मानथाखिनि गोदान सोलायनायखौ सोरखारि BIS गेजेटआव नाय।",
    verbatimExcerpt: "गुबै मानथाखि खोन्दो",
    copyExcerpt: "खोन्दो कपि खालाम",
    copied: "कपि खालामबाय",
    viewSource: "सोरखारि BIS पर्टेलआव नाय",
    noEvidenceTitle: "जेबो साखि उखावनाय जायाखै",
    noEvidenceDesc: "BIS मानथाखि खोन्दोफोर नायनो सोंलु सों एबा मानथाखि सायख’।",
  },
  [IndianLanguage.MNI]: {
    title: "অচুম্বা প্রমাণ অমসুং সাইতেসনশিং",
    indianStandard: "ইন্দিয়ান স্তেন্দার্দ (Indian Standard)",
    clause: "ক্লজ (Clause):",
    page: "লমাই (Page):",
    publication: "ফোঙখিবা তারিখ:",
    relevance: "মরী লৈনবা (Relevance):",
    freshnessNotice: "অনৌবা পাউ:",
    freshnessDesc:
      "স্তেন্দার্দ অসিগী নৌবা শেমদোকপশিং BIS গেজেত্তা চেক তৌবীয়ু।",
    verbatimExcerpt: "স্তেন্দার্দ ক্লজকী অশেংবা শরুক",
    copyExcerpt: "ক্লজ কোপি তৌবীয়ু",
    copied: "কোপি তৌরে",
    viewSource: "অফিসিয়েল BIS পোর্তেলদা য়েংবীয়ু",
    noEvidenceTitle: "অমাখক প্রমাণ য়াওদে",
    noEvidenceDesc:
      "BIS স্তেন্দার্দ ক্লজশিং য়েংনবগীদমক ৱাহং অমা হংবীয়ু নত্রগা স্তেন্দার্দ খনবীয়ু।",
  },
  [IndianLanguage.SAT]: {
    title: "ᱥᱟᱹᱨᱤ ᱥᱟᱹᱠᱷᱤ ᱟᱨ ᱩᱫᱷᱨᱚᱬ",
    indianStandard: "ᱵᱷᱟᱨᱚᱛ ᱢᱟᱱᱚᱠ (Indian Standard)",
    clause: "ᱫᱷᱟᱨᱟ (Clause):",
    page: "ᱥᱟᱠᱟᱢ (Page):",
    publication: "ᱩᱪᱷᱟᱹᱱ ᱢᱟᱹᱦᱤᱛ:",
    relevance: "ᱥᱟᱹᱜᱟᱹᱭ (Relevance):",
    freshnessNotice: "ᱱᱟᱶᱟ ᱵᱟᱰᱟᱭ:",
    freshnessDesc:
      "ᱱᱚᱶᱟ ᱢᱟᱱᱚᱠ ᱨᱮᱱᱟᱜ ᱱᱟᱶᱟ ᱥᱩᱫᱷᱨᱟᱹᱣ ᱞᱟᱹᱜᱤᱫ ᱥᱚᱨᱠᱟᱨᱤ ᱜᱮᱡᱮᱴ ᱧᱮᱞ ᱢᱮ᱾",
    verbatimExcerpt: "ᱢᱩᱞ ᱢᱟᱱᱚᱠ ᱫᱷᱟᱨᱟ ᱦᱟᱹᱴᱤᱧ",
    copyExcerpt: "ᱦᱟᱹᱴᱤᱧ ᱠᱚᱯᱤ ᱢᱮ",
    copied: "ᱠᱚᱯᱤ ᱮᱱᱟ",
    viewSource: "ᱥᱚᱨᱠᱟᱨᱤ BIS ᱯᱳᱨᱴᱟᱞ ᱨᱮ ᱧᱮᱞ ᱢᱮ",
    noEvidenceTitle: "ᱡᱟᱦᱟᱸᱱ ᱥᱟᱹᱠᱷᱤ ᱵᱟᱹᱱᱩᱜᱼᱟ",
    noEvidenceDesc: "BIS ᱢᱟᱱᱚᱠ ᱧᱮᱞ ᱞᱟᱹᱜᱤᱫ ᱠᱩᱠᱞᱤ ᱠᱩᱞᱤ ᱢᱮ ᱥᱮ ᱢᱟᱱᱚᱠ ᱵᱟᱪᱷᱟᱣ ᱢᱮ᱾",
  },
  [IndianLanguage.KAS]: {
    title: "مستند ثبوت تہٕ حوالہ جات",
    indianStandard: "ہندوستانی معیار (Indian Standard)",
    clause: "شق (Clause):",
    page: "صفحہ (Page):",
    publication: "شائع گژھنُک تاریخ:",
    relevance: "مطابقت (Relevance):",
    freshnessNotice: "نوٹس:",
    freshnessDesc: "امکۍ نئ ترامیم سرکٲری BIS گزٹس منٛز وِچھِو۔",
    verbatimExcerpt: "اصل معیار شقُک اقتباس",
    copyExcerpt: "اقتباس کاپی کٔرِو",
    copied: "کاپی گوو",
    viewSource: "سرکاری BIS پورٹلس پؠٹھ وِچھِو",
    noEvidenceTitle: "کانٛہہ ثبوت چُھنہٕ حوالہ دِتھ",
    noEvidenceDesc: "BIS معیار شق وُچھنہٕ خٲطرٕ سوال پُچھِو یا معیار چُنِو۔",
  },
  [IndianLanguage.SD]: {
    title: "سرڪاري ثبوت ۽ حوالا",
    indianStandard: "ڀارتي معيار (Indian Standard)",
    clause: "شق (Clause):",
    page: "صفحو (Page):",
    publication: "اشاعت جي تاريخ:",
    relevance: "مطابقت (Relevance):",
    freshnessNotice: "نوٽيس:",
    freshnessDesc: "ھن معيار جي تازي ترميمن لاءِ سرڪاري BIS گزٽ چيڪ ڪريو.",
    verbatimExcerpt: "اصل معيار شق جو اقتباس",
    copyExcerpt: "اقتباس نقل ڪريو",
    copied: "نقل ٿي ويو",
    viewSource: "سرڪاري BIS پورٽل تي ماخذ ڏسو",
    noEvidenceTitle: "ڪو به ثبوت ڏنل ناهي",
    noEvidenceDesc: "BIS معيار شق ڏسڻ لاءِ سوال پڇو يا معيار چونڊيو.",
  },
};

export const EvidencePanel: React.FC<EvidencePanelProps> = ({
  evidenceList,
  activeEvidenceId,
  onSelectEvidence,
  onClose,
  className = "",
  language = IndianLanguage.EN,
  labels: customLabels,
}) => {
  const [copiedId, setCopiedId] = React.useState<string | null>(null);

  const langDict =
    DEFAULT_LABELS[language] || DEFAULT_LABELS[IndianLanguage.EN];
  const l: EvidencePanelLabels = { ...langDict, ...(customLabels || {}) };

  const activeEvidence =
    evidenceList.find((e) => e.id === activeEvidenceId) ||
    (evidenceList.length > 0 ? evidenceList[0] : null);

  const handleCopy = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  if (evidenceList.length === 0) {
    return (
      <div
        className={`flex flex-col items-center justify-center p-8 text-center text-slate-500 bg-slate-50/50 dark:bg-slate-900/30 rounded-lg border border-dashed border-slate-200 dark:border-slate-800 ${className}`}
      >
        <BookOpen className="w-10 h-10 text-slate-400 mb-3" />
        <h4 className="text-sm font-semibold text-slate-700 dark:text-slate-300">
          {l.noEvidenceTitle}
        </h4>
        <p className="text-xs text-slate-500 mt-1 max-w-xs">
          {l.noEvidenceDesc}
        </p>
      </div>
    );
  }

  return (
    <div
      className={`flex flex-col h-full bg-white dark:bg-slate-900 border-l border-slate-200 dark:border-slate-800 overflow-hidden ${className}`}
    >
      {/* Header */}
      <div className="p-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between bg-slate-50/80 dark:bg-slate-900/80 backdrop-blur">
        <div className="flex items-center gap-2">
          <FileText className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
          <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100 tracking-tight">
            {l.title} ({evidenceList.length})
          </h3>
        </div>
        {onClose && (
          <button
            type="button"
            onClick={onClose}
            className="text-xs text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-1 rounded"
          >
            ✕
          </button>
        )}
      </div>

      {/* Evidence Tabs if multiple */}
      {evidenceList.length > 1 && (
        <div className="flex items-center gap-1.5 p-2 bg-slate-100/70 dark:bg-slate-800/40 border-b border-slate-200 dark:border-slate-800 overflow-x-auto">
          {evidenceList.map((ev, index) => {
            const isSelected = activeEvidence?.id === ev.id;
            return (
              <button
                key={ev.id}
                type="button"
                onClick={() => onSelectEvidence && onSelectEvidence(ev.id)}
                className={`text-xs px-2.5 py-1 rounded whitespace-nowrap font-medium transition-all ${
                  isSelected
                    ? "bg-white dark:bg-slate-800 text-indigo-600 dark:text-indigo-300 shadow-sm border border-slate-200 dark:border-slate-700"
                    : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200"
                }`}
              >
                [{index + 1}] {ev.standardNumber}
              </button>
            );
          })}
        </div>
      )}

      {/* Main Evidence Content */}
      {activeEvidence && (
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {/* Metadata Card */}
          <div className="p-3.5 rounded-lg bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700/80 space-y-2">
            <div className="flex items-start justify-between gap-2">
              <div>
                <span className="text-[11px] font-bold text-indigo-600 dark:text-indigo-400 tracking-wide uppercase">
                  {l.indianStandard}
                </span>
                <h4 className="text-base font-bold text-slate-900 dark:text-slate-100">
                  {activeEvidence.standardNumber}
                </h4>
              </div>
              <SourceFreshnessBadge status={activeEvidence.status} />
            </div>

            <p className="text-xs font-medium text-slate-600 dark:text-slate-300 line-clamp-2">
              {activeEvidence.documentTitle}
            </p>

            <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-200/60 dark:border-slate-700/60 text-xs text-slate-500 dark:text-slate-400">
              <div>
                <span className="font-semibold text-slate-700 dark:text-slate-300">
                  {l.clause}{" "}
                </span>
                {activeEvidence.clause || "General Scope"}
              </div>
              <div>
                <span className="font-semibold text-slate-700 dark:text-slate-300">
                  {l.page}{" "}
                </span>
                {activeEvidence.page || "N/A"}
              </div>
              <div>
                <span className="font-semibold text-slate-700 dark:text-slate-300">
                  {l.publication}{" "}
                </span>
                {activeEvidence.publicationDate || "Official Publication"}
              </div>
              <div>
                <span className="font-semibold text-slate-700 dark:text-slate-300">
                  {l.relevance}{" "}
                </span>
                <span className="font-semibold text-indigo-600 dark:text-indigo-400">
                  {Math.round(activeEvidence.similarityScore * 100)}%
                </span>
              </div>
            </div>
          </div>

          {/* Outdated Warning if applicable */}
          {activeEvidence.isOutdated && (
            <div className="p-3 rounded-md bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800 text-xs text-amber-800 dark:text-amber-200 flex gap-2">
              <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
              <span>
                <strong>{l.freshnessNotice}</strong> {l.freshnessDesc}
              </span>
            </div>
          )}

          {/* Verbatim Excerpt */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                {l.verbatimExcerpt}
              </label>
              <button
                type="button"
                onClick={() =>
                  handleCopy(activeEvidence.id, activeEvidence.excerpt)
                }
                className="inline-flex items-center gap-1 text-[11px] text-slate-500 hover:text-slate-700 dark:hover:text-slate-300 font-medium"
              >
                {copiedId === activeEvidence.id ? (
                  <>
                    <Check className="w-3 h-3 text-emerald-600" /> {l.copied}
                  </>
                ) : (
                  <>
                    <Copy className="w-3 h-3" /> {l.copyExcerpt}
                  </>
                )}
              </button>
            </div>

            <div className="p-3.5 rounded-lg bg-slate-900 text-slate-100 font-mono text-xs leading-relaxed overflow-x-auto border border-slate-800 shadow-inner">
              {activeEvidence.excerpt}
            </div>
          </div>

          {/* Action links */}
          <div className="pt-2">
            <a
              href={activeEvidence.sourceUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 w-full px-3 py-2 text-xs font-semibold rounded-md bg-indigo-50 text-indigo-700 dark:bg-indigo-950/60 dark:text-indigo-300 hover:bg-indigo-100 dark:hover:bg-indigo-900 border border-indigo-200 dark:border-indigo-800 transition-colors"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              <span>{l.viewSource}</span>
            </a>
          </div>
        </div>
      )}
    </div>
  );
};
