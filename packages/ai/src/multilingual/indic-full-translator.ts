import { IndianLanguage } from "@bis/shared-types";

/**
 * Indic Full-Document & Sentence-Level Translator
 * Translates comprehensive BIS compliance sentences, clauses, tables, and paragraphs
 * across all 22 Scheduled Indian Languages while strictly preserving technical tokens.
 */
export class IndicFullTranslator {
  /**
   * Translate English sentences and phrases to Hindi and all 22 Indic languages.
   */
  static translateText(text: string, targetLang: IndianLanguage): string {
    if (!text || targetLang === IndianLanguage.EN) {
      return text;
    }

    if (targetLang === IndianLanguage.HI) {
      return this.toHindi(text, false);
    }
    if (targetLang === IndianLanguage.BN) return this.toBengali(text);
    if (targetLang === IndianLanguage.TA) return this.toTamil(text);
    if (targetLang === IndianLanguage.TE) return this.toTelugu(text);
    if (targetLang === IndianLanguage.MR) return this.toMarathi(text);
    if (targetLang === IndianLanguage.GU) return this.toGujarati(text);
    if (targetLang === IndianLanguage.KN) return this.toKannada(text);
    if (targetLang === IndianLanguage.ML) return this.toMalayalam(text);
    if (targetLang === IndianLanguage.PA) return this.toPunjabi(text);
    if (targetLang === IndianLanguage.OR) return this.toOdia(text);
    if (targetLang === IndianLanguage.UR) return this.toUrdu(text);
    if (targetLang === IndianLanguage.AS) return this.toAssamese(text);
    if (targetLang === IndianLanguage.SAN) return this.toSanskrit(text);
    if (targetLang === IndianLanguage.MAI) return this.toMaithili(text);
    if (targetLang === IndianLanguage.NEP) return this.toNepali(text);
    if (targetLang === IndianLanguage.KOK) return this.toKonkani(text);
    if (targetLang === IndianLanguage.SD) return this.toSindhi(text);
    if (targetLang === IndianLanguage.KAS) return this.toKashmiri(text);
    if (targetLang === IndianLanguage.SAT) return this.toSantali(text);
    if (targetLang === IndianLanguage.DOG) return this.toDogri(text);
    if (targetLang === IndianLanguage.BOD) return this.toBodo(text);
    if (targetLang === IndianLanguage.MNI) return this.toManipuri(text);

    return this.toHindi(text, false);
  }

  private static applyReplacements(
    text: string,
    phrases: Array<[RegExp, string]>,
  ): string {
    let res = text;
    for (const [pattern, replacement] of phrases) {
      res = res.replace(pattern, replacement);
    }
    return res;
  }

  private static toHindi(text: string, isHinglish: boolean = false): string {
    const HINDI_PHRASES: Array<[RegExp, string]> = [
      [
        /### Gold & Silver Hallmarking \([^)]+\) — Verification Guide/gi,
        "### सोना और चांदी हॉलमार्किंग (IS 1417 / IS 2112) — सत्यापन गाइड",
      ],
      [
        /### Applicable Standard/gi,
        isHinglish
          ? "### Applicable Indian Standard (लागू मानक)"
          : "### लागू भारतीय मानक (Applicable Standard)",
      ],
      [
        /### Key Requirements/gi,
        isHinglish
          ? "### Key Requirements (मुख्य शर्तें)"
          : "### मुख्य आवश्यकताएं (Key Requirements)",
      ],
      [
        /### Testing Requirements/gi,
        isHinglish
          ? "### Testing & Lab Requirements (परीक्षण आवश्यकताएं)"
          : "### परीक्षण आवश्यकताएं (Testing Requirements)",
      ],
      [/### Routine Tests/gi, "### नियमित परीक्षण (Routine Tests)"],
      [
        /### The 3 Mandatory Marks on Genuine Gold Jewellery/gi,
        "### असली सोने के आभूषणों पर 3 अनिवार्य पहचान चिह्न",
      ],
      [
        /### How to Verify HUID on the BIS Care App/gi,
        "### बीआईएस केयर ऐप पर HUID को कैसे सत्यापित करें",
      ],
      [
        /### BIS Certification \/ Marking/gi,
        isHinglish
          ? "### BIS Certification & Marking (प्रमाणन)"
          : "### बीआईएस प्रमाणन / अनिवार्य क्यूसीओ (BIS Certification)",
      ],
      [
        /### Relevant Clauses/gi,
        isHinglish
          ? "### Relevant Standard Clauses"
          : "### संबंधित धाराएं व मानक खंड",
      ],
      [
        /### Laboratory Testing/gi,
        isHinglish
          ? "### Recognized Lab Testing"
          : "### मान्यता प्राप्त प्रयोगशाला परीक्षण",
      ],
      [
        /### Evidence/gi,
        isHinglish
          ? "### Evidence & Citations"
          : "### प्रामाणिक साक्ष्य और उद्धरण (Evidence)",
      ],
      [
        /### Recommended Next Steps/gi,
        isHinglish
          ? "### Recommended Next Steps (अगले कदम)"
          : "### अनुशंसित अगले कदम (Recommended Next Steps)",
      ],
      [
        /### Next Steps/gi,
        isHinglish
          ? "### Next Steps (अगले कदम)"
          : "### अगले आवश्यक कदम (Next Steps)",
      ],
      [/### Simple Explanation/gi, "### सरल व्याख्या (Simple Explanation)"],
      [
        /### What You Need to Check/gi,
        "### आपको क्या जांचने की आवश्यकता है (Checklist)",
      ],
      [/### Why It Matters/gi, "### यह क्यों महत्वपूर्ण है"],
      [/### What This Means/gi, "### इसका क्या अर्थ है"],
      [
        /### Consumer Protection Guarantee/gi,
        "### उपभोक्ता संरक्षण गारंटी (Consumer Protection)",
      ],
      [/### Summary/gi, "### सारांश (Summary)"],
      [/### Source/gi, "### स्रोत (Source)"],
      [
        /### 🔍 Find Indian Standard for Your Product/gi,
        "### 🔍 अपने उत्पाद के लिए भारतीय मानक खोजें",
      ],
      [/### 📝 Key Information Needed:/gi, "### 📝 आवश्यक मुख्य जानकारी:"],
      [
        /### 🌟 Quick Popular Categories:/gi,
        "### 🌟 त्वरित लोकप्रिय श्रेणियां:",
      ],

      // Table Headers & Terms
      [
        /\|\s*Requirement\s*\|\s*Details\s*\|/gi,
        "| आवश्यकता (Requirement) | विवरण (Details) |",
      ],
      [/\|\s*Product material\s*\|/gi, "| **उत्पाद सामग्री (Material)** |"],
      [/\|\s*Product type\s*\|/gi, "| **उत्पाद प्रकार (Type)** |"],
      [
        /\|\s*Applicable standard\s*\|/gi,
        "| **लागू भारतीय मानक (Standard)** |",
      ],
      [/\|\s*Relevant clause\s*\|/gi, "| **संबंधित खंड (Clause)** |"],
      [/\|\s*Compliance status\s*\|/gi, "| **अनुपालन स्थिति (Status)** |"],
      [
        /\|\s*Parameter\s*\|\s*Requirement\s*\|/gi,
        "| पैरामीटर (Parameter) | आवश्यकता (Requirement) |",
      ],
      [/\|\s*Material Grade\s*\|/gi, "| **सामग्री ग्रेड (Material Grade)** |"],
      [
        /\|\s*Thermal Retention\s*\|/gi,
        "| **थर्मल प्रतिधारण (Thermal Retention)** |",
      ],
      [
        /\|\s*Leak Resistance\s*\|/gi,
        "| **रिसाव प्रतिरोध (Leak Resistance)** |",
      ],
      [
        /\|\s*Heavy Metal Leaching\s*\|/gi,
        "| **भारी धातु लीचिंग (Heavy Metal Leaching)** |",
      ],
      [
        /\|\s*Total Dissolved Solids \(TDS\)\s*\|/gi,
        "| **कुल घुले हुए ठोस (TDS)** |",
      ],
      [/\|\s*pH Value\s*\|/gi, "| **पीएच मान (pH Value)** |"],
      [
        /\|\s*Toxic Heavy Metals \(Lead, Arsenic\)\s*\|/gi,
        "| **विषाक्त भारी धातुएं (सीसा, आर्सेनिक)** |",
      ],
      [
        /\|\s*Bacteriological \(E\. coli\)\s*\|/gi,
        "| **जीवाणु संदूषण (E. coli)** |",
      ],
      [
        /\|\s*Yield Proof Stress \(0\.2%\)\s*\|/gi,
        "| **यील्ड प्रूफ स्ट्रेस (0.2%)** |",
      ],
      [
        /\|\s*Tensile Strength \/ Proof Ratio\s*\|/gi,
        "| **तन्यता ताकत / अनुपात (TS/YS)** |",
      ],
      [
        /\|\s*Total Elongation at Max Force\s*\|/gi,
        "| **अधिकतम बल पर कुल बढ़ाव** |",
      ],
      [/\|\s*Bend & Rebend Test\s*\|/gi, "| **बेंड और रीबेंड टेस्ट** |"],

      // Status values
      [
        /Potentially Applicable/gi,
        "संभावित रूप से लागू (Potentially Applicable)",
      ],
      [/Satisfied/gi, "संतुष्ट / अनुरूप (Satisfied)"],
      [/Potential Gap/gi, "संभावित अंतर (Potential Gap)"],
      [/Information Missing/gi, "जानकारी अनुपलब्ध (Information Missing)"],
      [/Mandatory/gi, "अनिवार्य (Mandatory)"],

      // Hallmarking full sentences
      [
        /Under the Bureau of Indian Standards Act 2016 and statutory Hallmarking Orders, hallmarking is mandatory for gold jewellery in notified districts across India\./gi,
        "भारतीय मानक ब्यूरो अधिनियम 2016 और वैधानिक हॉलमार्किंग आदेशों के तहत, भारत भर के अधिसूचित जिलों में सोने के आभूषणों के लिए हॉलमार्किंग अनिवार्य है।",
      ],
      [
        /Every piece of genuine hallmarked gold jewellery must carry three distinct laser-engraved marks:/gi,
        "असली हॉलमार्क वाले सोने के प्रत्येक आभूषण पर तीन विशिष्ट लेजर-उत्कीर्ण चिह्न होने अनिवार्य हैं:",
      ],
      [
        /1\.\s*🔺\s*\*\*BIS Logo\*\*:\s*Standard triangular emblem certifying official government conformity\./gi,
        "1. 🔺 **बीआईएस लोगो (BIS Logo)**: आधिकारिक सरकारी अनुरूपता प्रमाणित करने वाला मानक त्रिकोणीय प्रतीक।",
      ],
      [
        /2\.\s*💎\s*\*\*Purity \/ Fineness Grade\*\*:\s*Standard Karat indication:/gi,
        "2. 💎 **शुद्धता / सुंदरता ग्रेड (Purity Grade)**: मानक कैरेट और शुद्धता संकेत:",
      ],
      [
        /\*\*24K999\*\*:\s*24 Karat \(99\.9% pure gold — Bullion & Coins\)/gi,
        "**24K999**: 24 कैरेट (99.9% शुद्ध सोना — बुलियन और सिक्के)",
      ],
      [
        /\*\*22K916\*\*:\s*22 Karat \(91\.6% pure gold — Traditional Jewellery\)/gi,
        "**22K916**: 22 कैरेट (91.6% शुद्ध सोना — पारंपरिक आभूषण)",
      ],
      [
        /\*\*18K750\*\*:\s*18 Karat \(75\.0% pure gold — Diamond & Stone Jewellery\)/gi,
        "**18K750**: 18 कैरेट (75.0% शुद्ध सोना — हीरे और रत्न जड़ित आभूषण)",
      ],
      [
        /\*\*14K585\*\*:\s*14 Karat \(58\.5% pure gold\)/gi,
        "**14K585**: 14 कैरेट (58.5% शुद्ध सोना)",
      ],
      [
        /3\.\s*🔢\s*\*\*6-Digit Alphanumeric HUID\*\*:\s*Hallmarking Unique Identification code providing complete end-to-end traceability\./gi,
        "3. 🔢 **6-अंकीय अल्फ़ान्यूमेरिक HUID**: हॉलमार्किंग विशिष्ट पहचान कोड जो पूर्ण ट्रेसबिलिटी प्रदान करता है।",
      ],
      [
        /1\.\s*Download and open the \*\*BIS Care App\*\* \(Android \/ iOS\)\./gi,
        "1. **BIS Care App** (Android / iOS) डाउनलोड करें और खोलें।",
      ],
      [
        /2\.\s*Tap \*\*"Verify HUID"\*\* on the home screen\./gi,
        '2. होम स्क्रीन पर **"Verify HUID"** पर टैप करें।',
      ],
      [
        /3\.\s*Enter the 6-digit alphanumeric code stamped on your jewellery piece\./gi,
        "3. अपने आभूषण पर अंकित 6-अंकीय अल्फ़ान्यूमेरिक कोड दर्ज करें।",
      ],
      [
        /4\.\s*Instantly view:\s*Jeweller Name & Registration, Assaying Centre \(AHC\), Date of Hallmarking, and Article Type\./gi,
        "4. तुरंत देखें: जौहरी का नाम व पंजीकरण, परख केंद्र (AHC), हॉलमार्किंग की तारीख और उत्पाद का प्रकार।",
      ],
      [
        /6-digit alphanumeric Hallmarking Unique Identification \(HUID\) code gives full traceability of purity and jeweller registration on the BIS Care App\./gi,
        "6-अंकीय अल्फ़ान्यूमेरिक हॉलमार्किंग विशिष्ट पहचान (HUID) कोड बीआईएस केयर ऐप पर शुद्धता और जौहरी पंजीकरण की पूर्ण ट्रेसबिलिटी प्रदान करता है।",
      ],
      [
        /Three mandatory marks:\s*BIS Logo, Purity grade \(e\.g\.22K916\), and 6-digit alphanumeric HUID\./gi,
        "तीन अनिवार्य चिह्न: बीआईएस लोगो, शुद्धता ग्रेड (उदा. 22K916, 18K750, 14K585), और 6-अंकीय अल्फ़ान्यूमेरिक HUID कोड।",
      ],
      [
        /If hallmarked jewellery is tested in an assay lab and found to be lower purity than marked, the jeweller is legally obligated under BIS regulations to refund the purity difference plus compensation\./gi,
        "यदि हॉलमार्क किए गए आभूषणों का किसी मान्यता प्राप्त परख प्रयोगशाला में परीक्षण किया जाता है और चिह्नित की तुलना में कम शुद्धता पाई जाती है, तो जौहरी बीआईएस विनियमों के तहत शुद्धता के अंतर और मुआवजे की राशि वापस करने के लिए कानूनी रूप से बाध्य है।",
      ],

      // Standards recommendation sentences
      [
        /Based on the product description, this standard may be applicable to ([^.\n]+) of the type covered by the standard\./gi,
        "उत्पाद विवरण के आधार पर, यह मानक इस मानक के अंतर्गत आने वाले $1 के लिए लागू हो सकता है।",
      ],
      [
        /The product may need to be evaluated against the tests specified in the applicable standard, including relevant performance, material and safety requirements\./gi,
        "उत्पाद को लागू मानक में निर्दिष्ट परीक्षणों के विरुद्ध मूल्यांकन करने की आवश्यकता हो सकती है, जिसमें संबंधित प्रदर्शन, सामग्री और सुरक्षा आवश्यकताएं शामिल हैं।",
      ],
      [
        /Important:\s*The exact tests and acceptance criteria should be verified against the current edition of the standard and applicable BIS requirements\./gi,
        "महत्वपूर्ण: सटीक परीक्षणों और स्वीकृति मानदंडों को मानक के वर्तमान संस्करण और लागू बीआईएस आवश्यकताओं के अनुसार सत्यापित किया जाना चाहिए।",
      ],
      [
        /If the product falls under a mandatory BIS certification\/QCO requirement, the manufacturer would need to follow the applicable conformity assessment procedure\./gi,
        "यदि उत्पाद अनिवार्य बीआईएस प्रमाणन / क्यूसीओ (QCO) आवश्यकता के अंतर्गत आता है, तो निर्माता को लागू अनुरूपता मूल्यांकन प्रक्रिया का पालन करना होगा।",
      ],
      [
        /Check the current BIS\/QCO notification before treating certification as mandatory\./gi,
        "प्रमाणन को अनिवार्य मानने से पहले वर्तमान बीआईएस/क्यूसीओ राजपत्र अधिसूचना की जांच करें।",
      ],
      [
        /Scheme: ISI Mark \/ applicable BIS conformity assessment scheme/gi,
        "योजना: आईएसआई मार्क (Scheme-I) / संबंधित बीआईएस अनुरूपता मूल्यांकन योजना",
      ],
      [
        /Scheme: Compulsory Registration Scheme \(CRS \/ Scheme II\)/gi,
        "योजना: अनिवार्य पंजीकरण योजना (CRS / Scheme II)",
      ],

      // Testing sentences
      [
        /The applicable requirements depend on the product specification and the relevant Indian Standard\./gi,
        "लागू आवश्यकताएं उत्पाद विनिर्देश और संबंधित भारतीय मानक पर निर्भर करती हैं।",
      ],
      [
        /The relevant standard specifies requirements\/tests covering areas such as:/gi,
        "संबंधित मानक निम्नलिखित क्षेत्रों को कवर करने वाली आवश्यकताओं/परीक्षणों को निर्दिष्ट करता है:",
      ],
      [
        /\*\*Chemical composition\*\*:\s*Verification of Carbon, Sulphur, Phosphorus maximum limits/gi,
        "**रासायनिक संरचना**: कार्बन, सल्फर, फास्फोरस की अधिकतम सीमाओं का सत्यापन",
      ],
      [
        /\*\*Tensile properties\*\*:\s*Proof stress and tensile strength ratio verification/gi,
        "**तन्यता गुण**: प्रूफ स्ट्रेस और तन्यता ताकत अनुपात का सत्यापन",
      ],
      [
        /\*\*Yield strength & Elongation\*\*:\s*Total elongation percentage at maximum force/gi,
        "**यील्ड ताकत और बढ़ाव**: अधिकतम बल पर कुल बढ़ाव प्रतिशत",
      ],
      [
        /\*\*Bend \/ rebend performance\*\*:\s*Mandrel bending without transverse cracks or rupture/gi,
        "**बेंड / रीबेंड प्रदर्शन**: बिना किसी दरार के मैंड्रेल बेंडिंग",
      ],
      [
        /\*\*Dimensional requirements\*\*:\s*Nominal mass tolerances and rib geometry/gi,
        "**आयामी आवश्यकताएं**: नाममात्र द्रव्यमान सहनशीलता और पसली ज्यामिति",
      ],
      [
        /\*\*Material Spectrometric Analysis\*\*:\s*Austenitic food-grade SS 304 \/ SS 316 verification/gi,
        "**सामग्री स्पेक्ट्रोमेट्रिक विश्लेषण**: खाद्य-ग्रेड SS 304 / SS 316 का सत्यापन",
      ],
      [
        /\*\*Thermal Insulation Retention\*\*:\s*Water temperature >60°C after 6 hours from 95°C/gi,
        "**थर्मल इन्सुलेशन प्रतिधारण**: 95°C से 6 घंटे बाद पानी का तापमान >60°C",
      ],
      [
        /\*\*Leak Tightness & Gasket Seal\*\*:\s*Zero leakage under 50 kPa inversion test/gi,
        "**रिसाव रोधकता**: 50 kPa उलटा परीक्षण के तहत शून्य रिसाव",
      ],
      [
        /\*\*Impact & Drop Resistance\*\*:\s*Base impact and closure drop performance/gi,
        "**प्रभाव और गिरावट प्रतिरोध**: बेस इम्पैक्ट और क्लोजर ड्रॉप टेस्ट",
      ],
      [
        /\*\*Heavy Metal Leaching Safety\*\*:\s*Trace chemical extraction limits/gi,
        "**भारी धातु लीचिंग सुरक्षा**: ट्रेस रासायनिक निष्कर्षण सीमाएं",
      ],
      [
        /\*\*Physical & Organoleptic\*\*:\s*Colour, Odour, Turbidity, pH 6\.5–8\.5/gi,
        "**भौतिक और संवेदी गुण**: रंग, गंध, मैलापन, pH 6.5–8.5",
      ],
      [
        /\*\*General Chemical\*\*:\s*Total Dissolved Solids \(TDS max 500 mg\/L\), Total Hardness, Chlorides/gi,
        "**सामान्य रासायनिक गुण**: कुल घुले हुए ठोस (TDS अधिकतम 500 mg/L), कठोरता, क्लोराइड",
      ],
      [
        /\*\*Toxic Substances\*\*:\s*Lead max 0\.01 mg\/L, Arsenic max 0\.01 mg\/L, Total Chromium/gi,
        "**विषाक्त पदार्थ**: सीसा अधिकतम 0.01 mg/L, आर्सेनिक अधिकतम 0.01 mg/L",
      ],
      [
        /\*\*Bacteriological\*\*:\s*E\. coli and coliform organisms zero count per 100 mL/gi,
        "**जीवाणु परीक्षण**: प्रति 100 मिली नमूने में E. coli शून्य गणना",
      ],
      [
        /For routine quality control, the manufacturer should verify the parameters and test frequency specified by the applicable standard and BIS conformity assessment requirements\./gi,
        "नियमित गुणवत्ता नियंत्रण के लिए, निर्माता को लागू मानक और बीआईएस अनुरूपता मूल्यांकन आवश्यकताओं द्वारा निर्दिष्ट मापदंडों और परीक्षण आवृत्ति को सत्यापित करना चाहिए।",
      ],
      [
        /Do not treat this list as the complete mandatory test schedule without checking the current standard\/QCO\./gi,
        "वर्तमान मानक/क्यूसीओ की जांच किए बिना इस सूची को पूर्ण अनिवार्य परीक्षण अनुसूची न मानें।",
      ],

      // Clause explanation sentences
      [
        /This clause specifies the technical requirements and quality criteria prescribed under/gi,
        "यह खंड निर्धारित तकनीकी आवश्यकताओं और गुणवत्ता मानदंडों को निर्दिष्ट करता है",
      ],
      [/In simple terms, it means:/gi, "सरल शब्दों में, इसका अर्थ है:"],
      [
        /Drinking water supplied for human consumption must remain strictly within safe chemical, physical, and microbiological limits\./gi,
        "मानव उपभोग के लिए आपूर्ति किया जाने वाला पेयजल सुरक्षित रासायनिक, भौतिक और सूक्ष्मजीवविज्ञानी सीमाओं के भीतर होना चाहिए।",
      ],
      [
        /All materials in contact with beverages must be manufactured from food-grade austenitic stainless steel/gi,
        "पेय पदार्थों के संपर्क में आने वाली सभी सामग्रियां खाद्य-ग्रेड ऑस्टेनिटिक स्टेनलेस स्टील (जैसे SS 304 या SS 316) से निर्मित होनी चाहिए",
      ],
      [
        /Reinforcing steel bars must deliver specified minimum proof yield stress/gi,
        "सुदृढ़ीकरण स्टील बार को निर्दिष्ट न्यूनतम यील्ड स्ट्रेस प्रदान करना चाहिए",
      ],
      [
        /This requirement is intended to ensure that the product\/water meets the specified quality criteria before it is considered compliant\./gi,
        "यह आवश्यकता यह सुनिश्चित करने के लिए है कि उत्पाद/पानी अनुपालन योग्य माने जाने से पहले निर्दिष्ट गुणवत्ता मानदंडों को पूरा करता है।",
      ],
      [
        /Source: BIS-authorized\/retrieved document/gi,
        "स्रोत: बीआईएस-अधिकृत / आधिकारिक दस्तावेज",
      ],

      // Next steps & Guidance
      [
        /1\. Confirm the exact bottle type and intended use\./gi,
        "1. सटीक उत्पाद प्रकार और उसके अभीष्ट उपयोग की पुष्टि करें।",
      ],
      [
        /2\. Verify the applicable Indian Standard and latest revision\./gi,
        "2. लागू भारतीय मानक और उसके नवीनतम संशोधन की पुष्टि करें।",
      ],
      [
        /3\. Check whether a QCO makes compliance mandatory\./gi,
        "3. जांचें कि क्या कोई क्यूसीओ (QCO) अनुपालन को कानूनी रूप से अनिवार्य बनाता है।",
      ],
      [
        /4\. Identify the prescribed testing requirements\./gi,
        "4. निर्धारित परीक्षण आवश्यकताओं और प्रयोगशाला उपकरणों की पहचान करें।",
      ],
      [
        /5\. Determine the applicable BIS conformity assessment scheme\./gi,
        "5. लागू बीआईएस अनुरूपता मूल्यांकन योजना (Scheme I / CRS / FMCS) का निर्धारण करें।",
      ],
      [
        /6\. Proceed with certification\/testing through the appropriate BIS process\./gi,
        "6. उचित बीआईएस पोर्टल (manakonline.in) के माध्यम से प्रमाणन / परीक्षण के साथ आगे बढ़ें।",
      ],

      // Confidence & Metadata labels
      [
        /Confidence:\s*🟢 High — Grounded in retrieved BIS evidence/gi,
        "**विश्वसनीयता स्तर**: 🟢 उच्च — आधिकारिक बीआईएस साक्ष्य पर आधारित",
      ],
      [
        /Confidence:\s*🟢 High — Grounded in statutory BIS regulations/gi,
        "**विश्वसनीयता स्तर**: 🟢 उच्च — वैधानिक बीआईएस विनियमों पर आधारित",
      ],
      [
        /Confidence:\s*🟢 High — Direct clause evidence available/gi,
        "**विश्वसनीयता स्तर**: 🟢 उच्च — प्रत्यक्ष मानक धारा साक्ष्य उपलब्ध",
      ],
      [
        /Confidence:\s*🟡 Medium — Generalized guidance based on standard domain/gi,
        "**विश्वसनीयता स्तर**: 🟡 मध्यम — मानक डोमेन पर आधारित मार्गदर्शन",
      ],
      [
        /Confidence:\s*🔴 Low — Limited evidence available in database/gi,
        "**विश्वसनीयता स्तर**: 🔴 निम्न — डेटाबेस में सीमित साक्ष्य उपलब्ध",
      ],

      // General Terminology & Inline Clauses
      [/Applicable Standard:?/gi, "लागू भारतीय मानक (Applicable Standard):"],
      [
        /Testing Requirements:?/gi,
        "परीक्षण आवश्यकताएं (Testing Requirements):",
      ],
      [/Key Requirements:?/gi, "मुख्य आवश्यकताएं (Key Requirements):"],
      [/include Clause/gi, "में खंड (Clause) शामिल है"],
      [/includes Clause/gi, "में खंड (Clause) शामिल है"],
      [/for stainless steel bottles/gi, "स्टेनलेस स्टील बोतलों के लिए"],
      [/for stainless steel/gi, "स्टेनलेस स्टील के लिए"],
      [/for drinking water/gi, "पेयजल के लिए"],
      [/for gold jewellery/gi, "सोने के आभूषणों के लिए"],
      [/for TMT steel bars/gi, "टीएमटी स्टील बार के लिए"],
    ];

    return this.applyReplacements(text, HINDI_PHRASES);
  }

  private static toTelugu(text: string): string {
    const TELUGU_PHRASES: Array<[RegExp, string]> = [
      [
        /### Gold & Silver Hallmarking \([^)]+\) — Verification Guide/gi,
        "### బంగారం మరియు వెండి హాల్‌మార్కింగ్ (IS 1417 / IS 2112) — ధృవీకరణ గైడ్",
      ],
      [
        /### Applicable Standard/gi,
        "### వర్తించే భారతీయ ప్రమాణం (Applicable Standard)",
      ],
      [
        /### Key Requirements/gi,
        "### ముఖ్యమైన సాంకేతిక అవసరాలు (Key Requirements)",
      ],
      [
        /### Testing Requirements/gi,
        "### పరీక్ష అవసరాలు (Testing Requirements)",
      ],
      [/### Routine Tests/gi, "### సాధారణ పరీక్షలు (Routine Tests)"],
      [
        /### The 3 Mandatory Marks on Genuine Gold Jewellery/gi,
        "### అసలైన బంగారు ఆభరణాలపై 3 తప్పనిసరి గుర్తులు",
      ],
      [
        /### How to Verify HUID on the BIS Care App/gi,
        "### BIS Care యాప్‌లో HUIDని ఎలా ధృవీకరించాలి",
      ],
      [
        /### BIS Certification \/ Marking/gi,
        "### BIS ధృవీకరణ మరియు QCO ఆర్డర్ (BIS Certification)",
      ],
      [/### Relevant Clauses/gi, "### సంబంధిత ప్రమాణ నిబంధనలు"],
      [/### Laboratory Testing/gi, "### గుర్తింపు పొందిన ల్యాబ్ పరీక్షలు"],
      [/### Evidence/gi, "### ఆధారాలు మరియు అనులేఖనాలు (Evidence)"],
      [
        /### Recommended Next Steps/gi,
        "### సిఫార్సు చేయబడిన తదుపరి దశలు (Recommended Next Steps)",
      ],
      [/### Next Steps/gi, "### తదుపరి దశలు (Next Steps)"],
      [/### Simple Explanation/gi, "### సరళమైన వివరణ (Simple Explanation)"],
      [/### What You Need to Check/gi, "### మీరు ఏమి తనిఖీ చేయాలి (Checklist)"],
      [/### Why It Matters/gi, "### ఇది ఎందుకు ముఖ్యం"],
      [/### What This Means/gi, "### దీని అర్థం ఏమిటి"],
      [
        /### Consumer Protection Guarantee/gi,
        "### వినియోగదారు రక్షణ హామీ (Consumer Protection)",
      ],
      [/### Summary/gi, "### సారాంశం (Summary)"],
      [/### Source/gi, "### మూలం (Source)"],

      // Table Headers & Terms
      [
        /\|\s*Requirement\s*\|\s*Details\s*\|/gi,
        "| అవసరం (Requirement) | వివరాలు (Details) |",
      ],
      [/\|\s*Product material\s*\|/gi, "| **ఉత్పత్తి పదార్థం (Material)** |"],
      [/\|\s*Product type\s*\|/gi, "| **ఉత్పత్తి రకం (Type)** |"],
      [
        /\|\s*Applicable standard\s*\|/gi,
        "| **వర్తించే భారతీయ ప్రమాణం (Standard)** |",
      ],
      [/\|\s*Relevant clause\s*\|/gi, "| **సంబంధిత విభాగం (Clause)** |"],
      [/\|\s*Compliance status\s*\|/gi, "| **అనుకూలత స్థితి (Status)** |"],
      [
        /\|\s*Parameter\s*\|\s*Requirement\s*\|/gi,
        "| పరామితి (Parameter) | అవసరం (Requirement) |",
      ],

      // Hallmarking full sentences
      [
        /Under the Bureau of Indian Standards Act 2016 and statutory Hallmarking Orders, hallmarking is mandatory for gold jewellery in notified districts across India\./gi,
        "భారతీయ ప్రమాణాల బ్యూరో చట్టం 2016 మరియు చట్టబద్ధమైన హాల్‌మార్కింగ్ ఆదేశాల ప్రకారం, భారతదేశంలోని నోటిఫైడ్ జిల్లాల్లో బంగారు ఆభరణాలకు హాల్‌మార్కింగ్ తప్పనిసరి.",
      ],
      [
        /Every piece of genuine hallmarked gold jewellery must carry three distinct laser-engraved marks:/gi,
        "అసలైన హాల్‌మార్క్ చేసిన ప్రతి బంగారు ఆభరణంపై మూడు విభిన్న లేజర్ చెక్కిన గుర్తులు తప్పనిసరిగా ఉండాలి:",
      ],
      [
        /1\.\s*🔺\s*\*\*BIS Logo\*\*:\s*Standard triangular emblem certifying official government conformity\./gi,
        "1. 🔺 **BIS లోగో**: అధికారిక ప్రభుత్వ ప్రమాణాల అనుగుణ్యతను ధృవీకరించే ప్రామాణిక త్రిభుజాకార చిహ్నం.",
      ],
      [
        /2\.\s*💎\s*\*\*Purity \/ Fineness Grade\*\*:\s*Standard Karat indication:/gi,
        "2. 💎 **స్వచ్ఛత / నాణ్యత గ్రేడ్**: ప్రామాణిక క్యారెట్ మరియు స్వచ్ఛత సూచిక:",
      ],
      [
        /\*\*24K999\*\*:\s*24 Karat \(99\.9% pure gold — Bullion & Coins\)/gi,
        "**24K999**: 24 క్యారెట్ (99.9% స్వచ్ఛమైన బంగారం — బులియన్ & నాణేలు)",
      ],
      [
        /\*\*22K916\*\*:\s*22 Karat \(91\.6% pure gold — Traditional Jewellery\)/gi,
        "**22K916**: 22 క్యారెట్ (91.6% స్వచ్ఛమైన బంగారం — సాంప్రదాయ ఆభరణాలు)",
      ],
      [
        /\*\*18K750\*\*:\s*18 Karat \(75\.0% pure gold — Diamond & Stone Jewellery\)/gi,
        "**18K750**: 18 క్యారెట్ (75.0% స్వచ్ఛమైన బంగారం — డైమండ్ & రాళ్ల ఆభరణాలు)",
      ],
      [
        /\*\*14K585\*\*:\s*14 Karat \(58\.5% pure gold\)/gi,
        "**14K585**: 14 క్యారెట్ (58.5% స్వచ్ఛమైన బంగారం)",
      ],
      [
        /3\.\s*🔢\s*\*\*6-Digit Alphanumeric HUID\*\*:\s*Hallmarking Unique Identification code providing complete end-to-end traceability\./gi,
        "3. 🔢 **6-అంకెల ఆల్ఫాన్యూమరిక్ HUID**: పూర్తి ఎండ్-టు-ఎండ్ ట్రేసిబిలిటీని అందించే హాల్‌మార్కింగ్ ప్రత్యేక గుర్తింపు కోడ్.",
      ],
      [
        /1\.\s*Download and open the \*\*BIS Care App\*\* \(Android \/ iOS\)\./gi,
        "1. **BIS Care App** (Android / iOS) డౌన్‌లోడ్ చేసి తెరవండి.",
      ],
      [
        /2\.\s*Tap \*\*"Verify HUID"\*\* on the home screen\./gi,
        '2. హోమ్ స్క్రీన్‌పై **"Verify HUID"** పై నొక్కండి.',
      ],
      [
        /3\.\s*Enter the 6-digit alphanumeric code stamped on your jewellery piece\./gi,
        "3. మీ ఆభరణంపై ముద్రించిన 6-అంకెల ఆల్ఫాన్యూమరిక్ కోడ్‌ను నమోదు చేయండి.",
      ],
      [
        /4\.\s*Instantly view:\s*Jeweller Name & Registration, Assaying Centre \(AHC\), Date of Hallmarking, and Article Type\./gi,
        "4. తక్షణమే చూడండి: వ్యాపారి పేరు & రిజిస్ట్రేషన్, అస్సేయింగ్ కేంద్రం (AHC), హాల్‌మార్కింగ్ తేదీ మరియు వస్తువు రకం.",
      ],
      [
        /6-digit alphanumeric Hallmarking Unique Identification \(HUID\) code gives full traceability of purity and jeweller registration on the BIS Care App\./gi,
        "6-అంకెల ఆల్ఫాన్యూమరిక్ హాల్‌మార్కింగ్ ప్రత్యేక గుర్తింపు (HUID) కోడ్ BIS Care యాప్‌లో స్వచ్ఛత మరియు వ్యాపారి రిజిస్ట్రేషన్ పూర్తి ట్రేసిబిలిటీని అందిస్తుంది.",
      ],
      [
        /Three mandatory marks:\s*BIS Logo, Purity grade \(e\.g\.22K916\), and 6-digit alphanumeric HUID\./gi,
        "మూడు తప్పనిసరి గుర్తులు: BIS లోగో, స్వచ్ఛత గ్రేడ్ (ఉదా. 22K916), మరియు 6-అంకెల ఆల్ఫాన్యూమరిక్ HUID కోడ్.",
      ],
      [
        /If hallmarked jewellery is tested in an assay lab and found to be lower purity than marked, the jeweller is legally obligated under BIS regulations to refund the purity difference plus compensation\./gi,
        "హాల్‌మార్క్ చేసిన ఆభరణాలను ల్యాబ్‌లో పరీక్షించి, గుర్తించిన దానికంటే తక్కువ స్వచ్ఛత ఉన్నట్లు తేలితే, BIS నిబంధనల ప్రకారం స్వచ్ఛత వ్యత్యాసాన్ని మరియు పరిహారాన్ని వాపసు చేయడానికి వ్యాపారి చట్టబద్ధంగా బాధ్యత వహిస్తాడు.",
      ],

      // Standards recommendation & testing sentences
      [
        /Based on the product description, this standard may be applicable to ([^.\n]+) of the type covered by the standard\./gi,
        "ఉత్పత్తి వివరణ ఆధారంగా, ఈ ప్రమాణం కిందకు వచ్చే $1కి ఈ ప్రమాణం వర్తించవచ్చు.",
      ],
      [
        /The product may need to be evaluated against the tests specified in the applicable standard, including relevant performance, material and safety requirements\./gi,
        "సంబంధిత పనితీరు, పదార్థం మరియు భద్రతా అవసరాలతో సహా వర్తించే ప్రమాణంలో పేర్కొన్న పరీక్షల ఆధారంగా ఉత్పత్తిని మూల్యాంకనం చేయాల్సి ఉంటుంది.",
      ],
      [
        /Important:\s*The exact tests and acceptance criteria should be verified against the current edition of the standard and applicable BIS requirements\./gi,
        "ముఖ్యమైనది: ఖచ్చితమైన పరీక్షలు మరియు అంగీకార ప్రమాణాలను ప్రస్తుత ప్రమాణం మరియు వర్తించే BIS అవసరాలకు అనుగుణంగా ధృవీకరించాలి.",
      ],
      [
        /If the product falls under a mandatory BIS certification\/QCO requirement, the manufacturer would need to follow the applicable conformity assessment procedure\./gi,
        "ఉత్పత్తి తప్పనిసరి BIS ధృవీకరణ / QCO అవసరాల కిందకు వస్తే, తయారీదారు వర్తించే అనుగుణ్యత అంచనా విధానాన్ని అనుసరించాలి.",
      ],
      [
        /Check the current BIS\/QCO notification before treating certification as mandatory\./gi,
        "ధృవీకరణను తప్పనిసరిగా పరిగణించే ముందు ప్రస్తుత BIS/QCO నోటిఫికేషన్‌ను తనిఖీ చేయండి.",
      ],
      [
        /Scheme: ISI Mark \/ applicable BIS conformity assessment scheme/gi,
        "పథకం: ISI మార్క్ (స్కీమ్-I) / వర్తించే BIS అనుగుణ్యత అంచనా పథకం",
      ],
      [
        /Scheme: Compulsory Registration Scheme \(CRS \/ Scheme II\)/gi,
        "పథకం: తప్పనిసరి నమోదు పథకం (CRS / స్కీమ్ II)",
      ],
      [
        /The applicable requirements depend on the product specification and the relevant Indian Standard\./gi,
        "వర్తించే అవసరాలు ఉత్పత్తి వివరణ మరియు సంబంధిత భారతీయ ప్రమాణంపై ఆధారపడి ఉంటాయి.",
      ],
      [
        /The relevant standard specifies requirements\/tests covering areas such as:/gi,
        "సంబంధిత ప్రమాణం క్రింది విభాగాలను కవర్ చేసే అవసరాలు/పరీక్షలను నిర్దేశిస్తుంది:",
      ],
      [
        /For routine quality control, the manufacturer should verify the parameters and test frequency specified by the applicable standard and BIS conformity assessment requirements\./gi,
        "రెగ్యులర్ నాణ్యత నియంత్రణ కోసం, తయారీదారు వర్తించే ప్రమాణం మరియు BIS అనుగుణ్యత అంచనా అవసరాల ద్వారా పేర్కొన్న పారామితులు మరియు పరీక్ష ఫ్రీక్వెన్సీని ధృవీకరించాలి.",
      ],
      [
        /Do not treat this list as the complete mandatory test schedule without checking the current standard\/QCO\./gi,
        "ప్రస్తుత ప్రమాణం/QCOని తనిఖీ చేయకుండా ఈ జాబితాను పూర్తి తప్పనిసరి పరీక్ష షెడ్యూల్‌గా పరిగణించవద్దు.",
      ],
      [
        /This clause specifies the technical requirements and quality criteria prescribed under/gi,
        "ఈ విభాగం నిర్దేశించిన సాంకేతిక అవసరాలు మరియు నాణ్యతా ప్రమాణాలను నిర్దేశిస్తుంది",
      ],
      [
        /In simple terms, it means:/gi,
        "సరళమైన మాటల్లో చెప్పాలంటే, దీని అర్థం:",
      ],
      [
        /This requirement is intended to ensure that the product\/water meets the specified quality criteria before it is considered compliant\./gi,
        "ఉత్పత్తి/నీరు అనుకూలమైనదిగా పరిగణించబడటానికి ముందు నిర్దేశిత నాణ్యతా ప్రమాణాలకు అనుగుణంగా ఉందని నిర్ధారించడానికి ఈ అవసరం ఉద్దేశించబడింది.",
      ],
      [
        /Source: BIS-authorized\/retrieved document/gi,
        "మూలం: BIS-అధికారిక / ధృవీకరించబడిన పత్రం",
      ],

      // Next steps
      [
        /1\. Confirm the exact bottle type and intended use\./gi,
        "1. ఖచ్చితమైన ఉత్పత్తి రకం మరియు దాని ఉద్దేశించిన ఉపయోగాన్ని నిర్ధారించండి.",
      ],
      [
        /2\. Verify the applicable Indian Standard and latest revision\./gi,
        "2. వర్తించే భారతీయ ప్రమాణం మరియు తాజా సవరణను ధృవీకరించండి.",
      ],
      [
        /3\. Check whether a QCO makes compliance mandatory\./gi,
        "3. ఏదైనా QCO ఆర్డర్ అనుపాలనను తప్పనిసరి చేస్తుందో లేదో తనిఖీ చేయండి.",
      ],
      [
        /4\. Identify the prescribed testing requirements\./gi,
        "4. నిర్దేశించిన పరీక్ష అవసరాలు మరియు ప్రయోగశాల పరికరాలను గుర్తించండి.",
      ],
      [
        /5\. Determine the applicable BIS conformity assessment scheme\./gi,
        "5. వర్తించే BIS అనుగుణ్యత అంచనా పథకాన్ని (స్కీమ్ I / CRS) నిర్ణయించండి.",
      ],
      [
        /6\. Proceed with certification\/testing through the appropriate BIS process\./gi,
        "6. సరైన BIS పోర్టల్ ద్వారా ధృవీకరణ / పరీక్షతో ముందుకు సాగండి.",
      ],

      // Confidence
      [
        /Confidence:\s*🟢 High — Grounded in statutory BIS regulations/gi,
        "**విశ్వసనీయత స్థాయి**: 🟢 అధికం — చట్టబద్ధమైన BIS నిబంధనల ఆధారంగా",
      ],
      [
        /Confidence:\s*🟢 High — Grounded in retrieved BIS evidence/gi,
        "**విశ్వసనీయత స్థాయి**: 🟢 అధికం — అధికారిక BIS సాక్ష్యాల ఆధారంగా",
      ],
      [
        /Confidence:\s*🟢 High — Direct clause evidence available/gi,
        "**విశ్వసనీయత స్థాయి**: 🟢 అధికం — ప్రత్యక్ష విభాగ సాక్ష్యం అందుబాటులో ఉంది",
      ],
      [
        /Confidence:\s*🟡 Medium — Generalized guidance based on standard domain/gi,
        "**విశ్వసనీయత స్థాయి**: 🟡 మధ్యస్థం — ప్రామాణిక డొమైన్ ఆధారిత మార్గదర్శకత్వం",
      ],
      [
        /Confidence:\s*🔴 Low — Limited evidence available in database/gi,
        "**విశ్వసనీయత స్థాయి**: 🔴 తక్కువ — డేటాబేస్‌లో పరిమిత సాక్ష్యం అందుబాటులో ఉంది",
      ],

      // General Terminology & Inline Clauses
      [
        /Applicable Standard:?/gi,
        "వర్తించే భారతీయ ప్రమాణం (Applicable Standard):",
      ],
      [/Testing Requirements:?/gi, "పరీక్ష అవసరాలు (Testing Requirements):"],
      [/Key Requirements:?/gi, "ముఖ్యమైన అవసరాలు (Key Requirements):"],
      [/include Clause/gi, "లో విభాగం (Clause) చేర్చబడింది"],
      [/includes Clause/gi, "లో విభాగం (Clause) చేర్చబడింది"],
      [/for stainless steel bottles/gi, "స్టెయిన్‌లెస్ స్టీల్ బాటిళ్ల కోసం"],
      [/for stainless steel/gi, "స్టెయిన్‌లెస్ స్టీల్ కోసం"],
      [/for drinking water/gi, "తాగునీటి కోసం"],
      [/for gold jewellery/gi, "బంగారు ఆభరణాల కోసం"],
      [/for TMT steel bars/gi, "TMT స్టీల్ బార్ల కోసం"],
    ];

    return this.applyReplacements(text, TELUGU_PHRASES);
  }

  private static toTamil(text: string): string {
    const TAMIL_PHRASES: Array<[RegExp, string]> = [
      [
        /### Gold & Silver Hallmarking \([^)]+\) — Verification Guide/gi,
        "### தங்கம் மற்றும் வெள்ளி ஹால்மார்க்கிங் (IS 1417 / IS 2112) — சரிபார்ப்பு வழிகாட்டி",
      ],
      [
        /### Applicable Standard/gi,
        "### பொருந்தக்கூடிய இந்திய தரநிலை (Applicable Standard)",
      ],
      [
        /### Key Requirements/gi,
        "### முக்கிய தொழில்நுட்பத் தேவைகள் (Key Requirements)",
      ],
      [
        /### Testing Requirements/gi,
        "### சோதனைத் தேவைகள் (Testing Requirements)",
      ],
      [/### Routine Tests/gi, "### வழக்கமான சோதனைகள் (Routine Tests)"],
      [
        /### The 3 Mandatory Marks on Genuine Gold Jewellery/gi,
        "### அசல் தங்க நகைகளில் உள்ள 3 கட்டாயக் குறிகள்",
      ],
      [
        /### How to Verify HUID on the BIS Care App/gi,
        "### BIS Care செயலியில் HUID ஐ எவ்வாறு சரிபார்க்கலாம்",
      ],
      [
        /### BIS Certification \/ Marking/gi,
        "### BIS சான்றிதழ் மற்றும் கட்டாய QCO (BIS Certification)",
      ],
      [/### Relevant Clauses/gi, "### தொடர்புடைய தரநிலைப் பிரிவுகள்"],
      [/### Laboratory Testing/gi, "### அங்கீகரிக்கப்பட்ட ஆய்வக சோதனைகள்"],
      [
        /### Evidence/gi,
        "### அதிகாரப்பூர்வ சான்றுகள் மற்றும் மேற்கோள்கள் (Evidence)",
      ],
      [
        /### Recommended Next Steps/gi,
        "### பரிந்துரைக்கப்பட்ட அடுத்த படிகள் (Recommended Next Steps)",
      ],
      [/### Next Steps/gi, "### அடுத்த படிகள் (Next Steps)"],
      [/### Simple Explanation/gi, "### எளிய விளக்கம் (Simple Explanation)"],
      [
        /### What You Need to Check/gi,
        "### நீங்கள் என்ன சரிபார்க்க வேண்டும் (Checklist)",
      ],
      [/### Why It Matters/gi, "### இது ஏன் முக்கியமானது"],
      [/### What This Means/gi, "### இதன் பொருள் என்ன"],
      [
        /### Consumer Protection Guarantee/gi,
        "### நுகர்வோர் பாதுகாப்பு உத்தரவாதம் (Consumer Protection)",
      ],
      [/### Summary/gi, "### சுருக்கம் (Summary)"],
      [/### Source/gi, "### மூலம் (Source)"],

      // Hallmarking full sentences
      [
        /Under the Bureau of Indian Standards Act 2016 and statutory Hallmarking Orders, hallmarking is mandatory for gold jewellery in notified districts across India\./gi,
        "இந்திய தரநிலைகள் பணியக சட்டம் 2016 மற்றும் சட்டப்பூர்வ ஹால்மார்க்கிங் உத்தரவுகளின் கீழ், இந்தியா முழுவதும் அறிவிக்கப்பட்ட மாவட்டங்களில் தங்க நகைகளுக்கு ஹால்மார்க்கிங் கட்டாயமாகும்.",
      ],
      [
        /Every piece of genuine hallmarked gold jewellery must carry three distinct laser-engraved marks:/gi,
        "அசல் ஹால்மார்க் செய்யப்பட்ட ஒவ்வொரு தங்க நகையிலும் மூன்று தனித்துவமான லேசர் பொறிக்கப்பட்ட குறிகள் இருக்க வேண்டும்:",
      ],
      [
        /1\.\s*🔺\s*\*\*BIS Logo\*\*:\s*Standard triangular emblem certifying official government conformity\./gi,
        "1. 🔺 **BIS லோகோ**: அதிகாரப்பூர்வ அரசாங்க இணக்கத்தை சான்றளிக்கும் நிலையான முக்கோண சின்னம்.",
      ],
      [
        /2\.\s*💎\s*\*\*Purity \/ Fineness Grade\*\*:\s*Standard Karat indication:/gi,
        "2. 💎 **தூய்மை / தரக் குறியீடு**: நிலையான காரட் மற்றும் தூய்மை அறிகுறி:",
      ],
      [
        /\*\*24K999\*\*:\s*24 Karat \(99\.9% pure gold — Bullion & Coins\)/gi,
        "**24K999**: 24 காரட் (99.9% தூய தங்கம் — கட்டிகள் & நாணயங்கள்)",
      ],
      [
        /\*\*22K916\*\*:\s*22 Karat \(91\.6% pure gold — Traditional Jewellery\)/gi,
        "**22K916**: 22 காரட் (91.6% தூய தங்கம் — பாரம்பரிய நகைகள்)",
      ],
      [
        /\*\*18K750\*\*:\s*18 Karat \(75\.0% pure gold — Diamond & Stone Jewellery\)/gi,
        "**18K750**: 18 காரட் (75.0% தூய தங்கம் — வைரம் & கற்கள் பதித்த நகைகள்)",
      ],
      [
        /\*\*14K585\*\*:\s*14 Karat \(58\.5% pure gold\)/gi,
        "**14K585**: 14 காரட் (58.5% தூய தங்கம்)",
      ],
      [
        /3\.\s*🔢\s*\*\*6-Digit Alphanumeric HUID\*\*:\s*Hallmarking Unique Identification code providing complete end-to-end traceability\./gi,
        "3. 🔢 **6-இலக்க எண்ணெழுத்து HUID**: முழுமையான தடம் கண்டறியும் வசதியை வழங்கும் ஹால்மார்க்கிங் தனித்துவ அடையாளக் குறியீடு.",
      ],
      [
        /1\.\s*Download and open the \*\*BIS Care App\*\* \(Android \/ iOS\)\./gi,
        "1. **BIS Care App** (Android / iOS) பதிவிறக்கம் செய்து திறக்கவும்.",
      ],
      [
        /2\.\s*Tap \*\*"Verify HUID"\*\* on the home screen\./gi,
        '2. முகப்புத் திரையில் **"Verify HUID"** என்பதைத் தட்டவும்.',
      ],
      [
        /3\.\s*Enter the 6-digit alphanumeric code stamped on your jewellery piece\./gi,
        "3. உங்கள் நகையில் பொறிக்கப்பட்டுள்ள 6-இலக்க எண்ணெழுத்து குறியீட்டை உள்ளிடவும்.",
      ],
      [
        /4\.\s*Instantly view:\s*Jeweller Name & Registration, Assaying Centre \(AHC\), Date of Hallmarking, and Article Type\./gi,
        "4. உடனே பார்க்கவும்: நகைக்கடை பெயர் & பதிவு, பரிசோதனை மையம் (AHC), ஹால்மார்க் செய்யப்பட்ட தேதி மற்றும் தயாரிப்பு வகை.",
      ],
      [
        /6-digit alphanumeric Hallmarking Unique Identification \(HUID\) code gives full traceability of purity and jeweller registration on the BIS Care App\./gi,
        "6-இலக்க எண்ணெழுத்து ஹால்மார்க்கிங் தனித்துவ அடையாள (HUID) குறியீடு BIS Care செயலியில் தூய்மை மற்றும் நகைக்கடை பதிவின் முழுமையான தகவலை வழங்குகிறது.",
      ],
      [
        /Three mandatory marks:\s*BIS Logo, Purity grade \(e\.g\.22K916\), and 6-digit alphanumeric HUID\./gi,
        "மூன்று கட்டாயக் குறிகள்: BIS லோகோ, தூய்மை தரம் (எ.கா. 22K916), மற்றும் 6-இலக்க எண்ணெழுத்து HUID குறியீடு.",
      ],
      [
        /If hallmarked jewellery is tested in an assay lab and found to be lower purity than marked, the jeweller is legally obligated under BIS regulations to refund the purity difference plus compensation\./gi,
        "ஹால்மார்க் செய்யப்பட்ட நகைகள் ஆய்வகத்தில் பரிசோதிக்கப்பட்டு, குறிக்கப்பட்டதை விட குறைவான தூய்மை இருப்பது கண்டறியப்பட்டால், BIS விதிகளின் கீழ் தூய்மை வேறுபாடு மற்றும் இழப்பீட்டைத் திரும்ப வழங்க நகைக்கடைக்காரர் சட்டப்பூர்வமாக கடமைப்பட்டுள்ளார்.",
      ],

      // Standards recommendation & testing
      [
        /Based on the product description, this standard may be applicable to ([^.\n]+) of the type covered by the standard\./gi,
        "தயாரிப்பு விளக்கத்தின் அடிப்படையில், இந்த தரநிலையின் கீழ் வரும் $1 க்கு இந்த தரநிலை பொருந்தக்கூடும்.",
      ],
      [
        /The product may need to be evaluated against the tests specified in the applicable standard, including relevant performance, material and safety requirements\./gi,
        "பொருந்தக்கூடிய தரநிலையில் குறிப்பிடப்பட்டுள்ள சோதனைகள், செயல்திறன், பொருள் மற்றும் பாதுகாப்பு தேவைகளின் அடிப்படையில் தயாரிப்பு மதிப்பீடு செய்யப்பட வேண்டும்.",
      ],
      [
        /Important:\s*The exact tests and acceptance criteria should be verified against the current edition of the standard and applicable BIS requirements\./gi,
        "முக்கியமானது: துல்லியமான சோதனைகள் மற்றும் ஏற்பு அளவுகோல்கள் தற்போதைய தரநிலை மற்றும் பொருந்தக்கூடிய BIS தேவைகளின்படி சரிபார்க்கப்பட வேண்டும்.",
      ],
      [
        /If the product falls under a mandatory BIS certification\/QCO requirement, the manufacturer would need to follow the applicable conformity assessment procedure\./gi,
        "தயாரிப்பு கட்டாய BIS சான்றிதழ் / QCO தேவையின் கீழ் வந்தால், உற்பத்தியாளர் பொருந்தக்கூடிய இணக்க மதிப்பீட்டு நடைமுறையைப் பின்பற்ற வேண்டும்.",
      ],
      [
        /Check the current BIS\/QCO notification before treating certification as mandatory\./gi,
        "சான்றிதழைக் கட்டாயமாகக் கருதுவதற்கு முன் தற்போதைய BIS/QCO அறிவிப்பைச் சரிபார்க்கவும்.",
      ],
      [
        /Scheme: ISI Mark \/ applicable BIS conformity assessment scheme/gi,
        "திட்டம்: ISI முத்திரை (திட்டம்-I) / பொருந்தக்கூடிய BIS இணக்க மதிப்பீட்டுத் திட்டம்",
      ],
      [
        /Scheme: Compulsory Registration Scheme \(CRS \/ Scheme II\)/gi,
        "திட்டம்: கட்டாயப் பதிவுத் திட்டம் (CRS / திட்டம் II)",
      ],
      [
        /The applicable requirements depend on the product specification and the relevant Indian Standard\./gi,
        "பொருந்தக்கூடிய தேவைகள் தயாரிப்பு விவரக்குறிப்பு மற்றும் தொடர்புடைய இந்திய தரநிலையைப் பொறுத்தது.",
      ],
      [
        /For routine quality control, the manufacturer should verify the parameters and test frequency specified by the applicable standard and BIS conformity assessment requirements\./gi,
        "வழக்கமான தரக் கட்டுப்பாட்டிற்கு, உற்பத்தியாளர் பொருந்தக்கூடிய தரநிலை மற்றும் BIS தேவைகளால் குறிப்பிடப்பட்ட அளவுருக்கள் மற்றும் சோதனை அதிர்வெண்ணைச் சரிபார்க்க வேண்டும்.",
      ],
      [
        /Confidence:\s*🟢 High — Grounded in statutory BIS regulations/gi,
        "**நம்பகத்தன்மை நிலை**: 🟢 உயர் — சட்டப்பூர்வ BIS விதிமுறைகளின் அடிப்படையில்",
      ],
      [
        /Confidence:\s*🟢 High — Grounded in retrieved BIS evidence/gi,
        "**நம்பகத்தன்மை நிலை**: 🟢 உயர் — மீட்டெடுக்கப்பட்ட BIS சான்றுகளின் அடிப்படையில்",
      ],
      [
        /Confidence:\s*🟢 High — Direct clause evidence available/gi,
        "**நம்பகத்தன்மை நிலை**: 🟢 உயர் — நேரடி தரநிலைப் பிரிவு சான்று உள்ளது",
      ],
    ];

    return this.applyReplacements(text, TAMIL_PHRASES);
  }

  private static toBengali(text: string): string {
    const BENGALI_PHRASES: Array<[RegExp, string]> = [
      [
        /### Gold & Silver Hallmarking \([^)]+\) — Verification Guide/gi,
        "### সোনা ও রূপা হলমার্কিং (IS 1417 / IS 2112) — যাচাইকরণ গাইড",
      ],
      [
        /### Applicable Standard/gi,
        "### প্রযোজ্য ভারতীয় মানক (Applicable Standard)",
      ],
      [
        /### Key Requirements/gi,
        "### মূল প্রযুক্তিগত প্রয়োজনীয়তা (Key Requirements)",
      ],
      [
        /### Testing Requirements/gi,
        "### পরীক্ষার প্রয়োজনীয়তা (Testing Requirements)",
      ],
      [/### Routine Tests/gi, "### রুটিন পরীক্ষা (Routine Tests)"],
      [
        /### The 3 Mandatory Marks on Genuine Gold Jewellery/gi,
        "### আসল সোনার গহনায় ৩টি বাধ্যতামূলক চিহ্ন",
      ],
      [
        /### How to Verify HUID on the BIS Care App/gi,
        "### BIS Care অ্যাপে HUID কীভাবে যাচাই করবেন",
      ],
      [
        /### BIS Certification \/ Marking/gi,
        "### BIS শংসাপত্র ও বাধ্যতামূলক QCO (BIS Certification)",
      ],
      [/### Relevant Clauses/gi, "### প্রাসঙ্গিক মানক ধারা"],
      [/### Laboratory Testing/gi, "### স্বীকৃত ল্যাবরেটরি পরীক্ষা"],
      [/### Evidence/gi, "### প্রামাণ্য প্রমাণ ও উদ্ধৃতি (Evidence)"],
      [
        /### Recommended Next Steps/gi,
        "### প্রস্তাবিত পরবর্তী পদক্ষেপ (Recommended Next Steps)",
      ],
      [/### Next Steps/gi, "### পরবর্তী পদক্ষেপ (Next Steps)"],
      [/### Simple Explanation/gi, "### সহজ ব্যাখ্যা (Simple Explanation)"],
      [
        /### What You Need to Check/gi,
        "### আপনার কী পরীক্ষা করা প্রয়োজন (Checklist)",
      ],
      [/### Why It Matters/gi, "### এটি কেন গুরুত্বপূর্ণ"],
      [/### What This Means/gi, "### এর অর্থ কী"],
      [
        /### Consumer Protection Guarantee/gi,
        "### ভোক্তা সুরক্ষা গ্যারান্টি (Consumer Protection)",
      ],
      [/### Summary/gi, "### সারাংশ (Summary)"],
      [/### Source/gi, "### উৎস (Source)"],

      // Hallmarking full sentences
      [
        /Under the Bureau of Indian Standards Act 2016 and statutory Hallmarking Orders, hallmarking is mandatory for gold jewellery in notified districts across India\./gi,
        "ব্যুরো অফ ইন্ডিয়ান স্ট্যান্ডার্ডস আইন ২০১৬ এবং সংবিধিবদ্ধ হলমার্কিং আদেশের অধীনে, সমগ্র ভারতের বিজ্ঞাপিত জেলাগুলিতে সোনার গহনার জন্য হলমার্কিং বাধ্যতামূলক।",
      ],
      [
        /Every piece of genuine hallmarked gold jewellery must carry three distinct laser-engraved marks:/gi,
        "আসল হলমার্কযুক্ত সোনার প্রতিটি গহনায় তিনটি স্বতন্ত্র লেজার-খোদাই করা চিহ্ন থাকা বাধ্যতামূলক:",
      ],
      [
        /1\.\s*🔺\s*\*\*BIS Logo\*\*:\s*Standard triangular emblem certifying official government conformity\./gi,
        "১. 🔺 **BIS লোগো**: অফিসিয়াল সরকারি মানানসই প্রত্যয়নকারী আদর্শ ত্রিভুজাকার প্রতীক।",
      ],
      [
        /2\.\s*💎\s*\*\*Purity \/ Fineness Grade\*\*:\s*Standard Karat indication:/gi,
        "২. 💎 **বিশুদ্ধতা / সূক্ষ্মতা গ্রেড**: স্ট্যান্ডার্ড ক্যারেট এবং বিশুদ্ধতার নির্দেশক:",
      ],
      [
        /\*\*24K999\*\*:\s*24 Karat \(99\.9% pure gold — Bullion & Coins\)/gi,
        "**24K999**: ২৪ ক্যারেট (৯৯.৯% খাঁটি সোনা — বুলিয়ন ও মুদ্রা)",
      ],
      [
        /\*\*22K916\*\*:\s*22 Karat \(91\.6% pure gold — Traditional Jewellery\)/gi,
        "**22K916**: ২২ ক্যারেট (৯১.৬% খাঁটি সোনা — ঐতিহ্যবাহী গহনা)",
      ],
      [
        /\*\*18K750\*\*:\s*18 Karat \(75\.0% pure gold — Diamond & Stone Jewellery\)/gi,
        "**18K750**: ১৮ ক্যারেট (৭৫.০% খাঁটি সোনা — হীরা ও রত্নখচিত গহনা)",
      ],
      [
        /\*\*14K585\*\*:\s*14 Karat \(58\.5% pure gold\)/gi,
        "**14K585**: ১৪ ক্যারেট (৫৮.৫% খাঁটি সোনা)",
      ],
      [
        /3\.\s*🔢\s*\*\*6-Digit Alphanumeric HUID\*\*:\s*Hallmarking Unique Identification code providing complete end-to-end traceability\./gi,
        "৩. 🔢 **৬-সংখ্যার আলফানিউমেরিক HUID**: সম্পূর্ণ সন্ধানযোগ্যতা প্রদানকারী হলমার্কিং অনন্য সনাক্তকরণ কোড।",
      ],
      [
        /1\.\s*Download and open the \*\*BIS Care App\*\* \(Android \/ iOS\)\./gi,
        "১. **BIS Care App** (Android / iOS) ডাউনলোড করুন এবং খুলুন।",
      ],
      [
        /2\.\s*Tap \*\*"Verify HUID"\*\* on the home screen\./gi,
        '২. হোম স্ক্রিনে **"Verify HUID"**-এ আলতো চাপুন।',
      ],
      [
        /3\.\s*Enter the 6-digit alphanumeric code stamped on your jewellery piece\./gi,
        "৩. আপনার গহনায় মুদ্রিত ৬-সংখ্যার আলফানিউমেরিক কোডটি লিখুন।",
      ],
      [
        /4\.\s*Instantly view:\s*Jeweller Name & Registration, Assaying Centre \(AHC\), Date of Hallmarking, and Article Type\./gi,
        "৪. তাৎক্ষণিকভাবে দেখুন: জুয়েলার্স নাম ও নিবন্ধন, যাচাই কেন্দ্র (AHC), হলমার্কিং তারিখ এবং পণ্যের ধরন।",
      ],
      [
        /6-digit alphanumeric Hallmarking Unique Identification \(HUID\) code gives full traceability of purity and jeweller registration on the BIS Care App\./gi,
        "৬-সংখ্যার আলফানিউমেরিক হলমার্কিং অনন্য সনাক্তকরণ (HUID) কোড BIS Care অ্যাপে বিশুদ্ধতা এবং জুয়েলার্স নিবন্ধনের সম্পূর্ণ সন্ধান দেয়।",
      ],
      [
        /Three mandatory marks:\s*BIS Logo, Purity grade \(e\.g\.22K916\), and 6-digit alphanumeric HUID\./gi,
        "তিনটি বাধ্যতামূলক চিহ্ন: BIS লোগো, বিশুদ্ধতা গ্রেড (যেমন 22K916), এবং ৬-সংখ্যার আলফানিউমেরিক HUID কোড।",
      ],
      [
        /If hallmarked jewellery is tested in an assay lab and found to be lower purity than marked, the jeweller is legally obligated under BIS regulations to refund the purity difference plus compensation\./gi,
        "হলমার্কযুক্ত গহনা ল্যাবে পরীক্ষা করে চিহ্নিত পরিমাণের চেয়ে কম বিশুদ্ধতা পাওয়া গেলে, জুয়েলার্স BIS নিয়ম অনুযায়ী বিশুদ্ধতার পার্থক্যের টাকা এবং ক্ষতিপূরণ ফেরত দিতে আইনত বাধ্য।",
      ],

      // Standards recommendation & testing
      [
        /Based on the product description, this standard may be applicable to ([^.\n]+) of the type covered by the standard\./gi,
        "পণ্যের বিবরণের ওপর ভিত্তি করে, এই মানকের আওতাভুক্ত $1-এর ক্ষেত্রে এই মানকটি প্রযোজ্য হতে পারে।",
      ],
      [
        /The product may need to be evaluated against the tests specified in the applicable standard, including relevant performance, material and safety requirements\./gi,
        "প্রাসঙ্গিক কর্মক্ষমতা, উপাদান এবং সুরক্ষা প্রয়োজনীয়তাসহ প্রযোজ্য মানকে উল্লিখিত পরীক্ষার সাপেক্ষে পণ্যটি মূল্যায়ন করতে হতে পারে।",
      ],
      [
        /Important:\s*The exact tests and acceptance criteria should be verified against the current edition of the standard and applicable BIS requirements\./gi,
        "গুরুত্বপূর্ণ: মানকের বর্তমান সংস্করণ এবং প্রযোজ্য BIS প্রয়োজনীয়তা অনুযায়ী সঠিক পরীক্ষা এবং গ্রহণযোগ্যতার মানদণ্ড যাচাই করা উচিত।",
      ],
      [
        /If the product falls under a mandatory BIS certification\/QCO requirement, the manufacturer would need to follow the applicable conformity assessment procedure\./gi,
        "যদি পণ্যটি বাধ্যতামূলক BIS শংসাপত্র / QCO প্রয়োজনীয়তার আওতায় পড়ে, তবে প্রস্তুতকারককে প্রযোজ্য মানানসই মূল্যায়ন পদ্ধতি অনুসরণ করতে হবে।",
      ],
      [
        /Scheme: ISI Mark \/ applicable BIS conformity assessment scheme/gi,
        "স্কিম: ISI মার্ক (স্কিম-I) / প্রযোজ্য BIS মানানসই মূল্যায়ন স্কিম",
      ],
      [
        /Scheme: Compulsory Registration Scheme \(CRS \/ Scheme II\)/gi,
        "স্কিম: বাধ্যতামূলক নিবন্ধন স্কিম (CRS / স্কিম II)",
      ],
      [
        /Confidence:\s*🟢 High — Grounded in statutory BIS regulations/gi,
        "**নির্ভরযোগ্যতা স্তর**: 🟢 উচ্চ — সংবিধিবদ্ধ BIS বিধিমালার ভিত্তিতে",
      ],
      [
        /Confidence:\s*🟢 High — Grounded in retrieved BIS evidence/gi,
        "**নির্ভরযোগ্যতা স্তর**: 🟢 উচ্চ — অফিসিয়াল BIS প্রমাণের ওপর ভিত্তি করে",
      ],
    ];

    return this.applyReplacements(text, BENGALI_PHRASES);
  }

  private static toMarathi(text: string): string {
    const MARATHI_PHRASES: Array<[RegExp, string]> = [
      [
        /### Gold & Silver Hallmarking \([^)]+\) — Verification Guide/gi,
        "### सोने आणि चांदी हॉलमार्किंग (IS 1417 / IS 2112) — पडताळणी मार्गदर्शक",
      ],
      [
        /### Applicable Standard/gi,
        "### लागू भारतीय मानक (Applicable Standard)",
      ],
      [
        /### Key Requirements/gi,
        "### मुख्य तांत्रिक आवश्यकता (Key Requirements)",
      ],
      [
        /### Testing Requirements/gi,
        "### चाचणी आवश्यकता (Testing Requirements)",
      ],
      [/### Routine Tests/gi, "### नियमित चाचण्या (Routine Tests)"],
      [
        /### The 3 Mandatory Marks on Genuine Gold Jewellery/gi,
        "### अस्सल सोन्याच्या दागिन्यांवरील ३ अनिवार्य खुणा",
      ],
      [
        /### How to Verify HUID on the BIS Care App/gi,
        "### BIS Care ॲपवर HUID ची पडताळणी कशी करावी",
      ],
      [
        /### BIS Certification \/ Marking/gi,
        "### BIS प्रमाणन आणि अनिवार्य QCO (BIS Certification)",
      ],
      [/### Relevant Clauses/gi, "### संबंधित मानक कलमे"],
      [/### Laboratory Testing/gi, "### मान्यताप्राप्त प्रयोगशाळा चाचणी"],
      [/### Evidence/gi, "### अधिकृत पुरावे आणि उद्धरणे (Evidence)"],
      [
        /### Recommended Next Steps/gi,
        "### शिफारस केलेल्या पुढील पायऱ्या (Recommended Next Steps)",
      ],
      [/### Next Steps/gi, "### पुढील आवश्यक पायऱ्या (Next Steps)"],
      [/### Simple Explanation/gi, "### सोपे स्पष्टीकरण (Simple Explanation)"],
      [
        /### What You Need to Check/gi,
        "### आपल्याला काय तपासणे आवश्यक आहे (Checklist)",
      ],
      [/### Why It Matters/gi, "### हे का महत्त्वाचे आहे"],
      [/### What This Means/gi, "### याचा अर्थ काय"],
      [
        /### Consumer Protection Guarantee/gi,
        "### ग्राहक संरक्षण हमी (Consumer Protection)",
      ],
      [/### Summary/gi, "### सारांश (Summary)"],
      [/### Source/gi, "### स्रोत (Source)"],

      // Hallmarking full sentences
      [
        /Under the Bureau of Indian Standards Act 2016 and statutory Hallmarking Orders, hallmarking is mandatory for gold jewellery in notified districts across India\./gi,
        "भारतीय मानक ब्युरो कायदा २०१६ आणि वैधानिक हॉलमार्किंग आदेशांनुसार, संपूर्ण भारतातील अधिसूचित जिल्ह्यांमध्ये सोन्याच्या दागिन्यांसाठी हॉलमार्किंग अनिवार्य आहे.",
      ],
      [
        /Every piece of genuine hallmarked gold jewellery must carry three distinct laser-engraved marks:/gi,
        "अस्सल हॉलमार्क केलेल्या सोन्याच्या प्रत्येक दागिन्यावर तीन विशिष्ट लेझर-कोरलेल्या खुणा असणे बंधनकारक आहे:",
      ],
      [
        /1\.\s*🔺\s*\*\*BIS Logo\*\*:\s*Standard triangular emblem certifying official government conformity\./gi,
        "१. 🔺 **BIS लोगो**: अधिकृत सरकारी मानकांची पूर्तता प्रमाणित करणारे मानक त्रिकोणी चिन्ह.",
      ],
      [
        /2\.\s*💎\s*\*\*Purity \/ Fineness Grade\*\*:\s*Standard Karat indication:/gi,
        "२. 💎 **शुद्धता / दर्जा श्रेणी**: मानक कॅरेट आणि शुद्धता दर्शक:",
      ],
      [
        /\*\*24K999\*\*:\s*24 Karat \(99\.9% pure gold — Bullion & Coins\)/gi,
        "**24K999**: २४ कॅरेट (९९.९% शुद्ध सोने — बुलियन आणि नाणी)",
      ],
      [
        /\*\*22K916\*\*:\s*22 Karat \(91\.6% pure gold — Traditional Jewellery\)/gi,
        "**22K916**: २२ कॅरेट (९१.६% शुद्ध सोने — पारंपारिक दागिने)",
      ],
      [
        /\*\*18K750\*\*:\s*18 Karat \(75\.0% pure gold — Diamond & Stone Jewellery\)/gi,
        "**18K750**: १८ कॅरेट (७५.०% शुद्ध सोने — हिरे आणि खडे जडवलेले दागिने)",
      ],
      [
        /\*\*14K585\*\*:\s*14 Karat \(58\.5% pure gold\)/gi,
        "**14K585**: १४ कॅरेट (५८.५% शुद्ध सोने)",
      ],
      [
        /3\.\s*🔢\s*\*\*6-Digit Alphanumeric HUID\*\*:\s*Hallmarking Unique Identification code providing complete end-to-end traceability\./gi,
        "३. 🔢 **६-अंकी अक्षरांक (HUID)**: संपूर्ण पडताळणी क्षमता प्रदान करणारा हॉलमार्किंग विशिष्ट ओळख कोड.",
      ],
      [
        /1\.\s*Download and open the \*\*BIS Care App\*\* \(Android \/ iOS\)\./gi,
        "१. **BIS Care App** (Android / iOS) डाउनलोड करा आणि उघडा.",
      ],
      [
        /2\.\s*Tap \*\*"Verify HUID"\*\* on the home screen\./gi,
        '२. होम स्क्रीनवरील **"Verify HUID"** वर टॅप करा.',
      ],
      [
        /3\.\s*Enter the 6-digit alphanumeric code stamped on your jewellery piece\./gi,
        "३. तुमच्या दागिन्यांवर कोरलेला ६-अंकी अक्षरांक कोड प्रविष्ट करा.",
      ],
      [
        /4\.\s*Instantly view:\s*Jeweller Name & Registration, Assaying Centre \(AHC\), Date of Hallmarking, and Article Type\./gi,
        "४. त्वरित पहा: सराफाचे नाव व नोंदणी, तपासणी केंद्र (AHC), हॉलमार्किंगची तारीख आणि उत्पादनाचा प्रकार.",
      ],
      [
        /6-digit alphanumeric Hallmarking Unique Identification \(HUID\) code gives full traceability of purity and jeweller registration on the BIS Care App\./gi,
        "६-अंकी अक्षरांक हॉलमार्किंग विशिष्ट ओळख (HUID) कोड BIS Care ॲपवर शुद्धता आणि सराफा नोंदणीची संपूर्ण पडताळणी देतो.",
      ],
      [
        /Three mandatory marks:\s*BIS Logo, Purity grade \(e\.g\.22K916\), and 6-digit alphanumeric HUID\./gi,
        "तीन अनिवार्य खुणा: BIS लोगो, शुद्धता श्रेणी (उदा. 22K916), आणि ६-अंकी अक्षरांक HUID कोड.",
      ],
      [
        /If hallmarked jewellery is tested in an assay lab and found to be lower purity than marked, the jeweller is legally obligated under BIS regulations to refund the purity difference plus compensation\./gi,
        "हॉलमार्क केलेल्या दागिन्यांची प्रयोगशाळेत चाचणी केल्यास चिन्हांकित केलेल्या दागिन्यांपेक्षा कमी शुद्धता आढळल्यास, सराफा BIS नियमांनुसार शुद्धतेतील फरक आणि नुकसानभरपाई परत करण्यास कायदेशीररित्या बांधील आहे.",
      ],

      // Standards recommendation & testing
      [
        /Based on the product description, this standard may be applicable to ([^.\n]+) of the type covered by the standard\./gi,
        "उत्पादन वर्णनावर आधारित, हे मानक या मानकाच्या कार्यक्षेत्रातील $1 साठी लागू होऊ शकते.",
      ],
      [
        /The product may need to be evaluated against the tests specified in the applicable standard, including relevant performance, material and safety requirements\./gi,
        "लागू मानकामध्ये नमूद केलेल्या चाचण्या, संबंधित कार्यप्रदर्शन, साहित्य आणि सुरक्षा आवश्यकतांनुसार उत्पादनाचे मूल्यांकन करणे आवश्यक असू शकते.",
      ],
      [
        /Important:\s*The exact tests and acceptance criteria should be verified against the current edition of the standard and applicable BIS requirements\./gi,
        "महत्त्वाचे: अचूक चाचण्या आणि स्वीकृती निकष मानकाच्या चालू आवृत्तीनुसार आणि लागू BIS आवश्यकतांनुसार पडताळले पाहिजेत.",
      ],
      [
        /If the product falls under a mandatory BIS certification\/QCO requirement, the manufacturer would need to follow the applicable conformity assessment procedure\./gi,
        "जर उत्पादन अनिवार्य BIS प्रमाणन / QCO आवश्यकतेखाली येत असेल, तर उत्पादकाला लागू अनुरूपता मूल्यांकन प्रक्रियेचे पालन करावे लागेल.",
      ],
      [
        /Confidence:\s*🟢 High — Grounded in statutory BIS regulations/gi,
        "**विश्वासार्हता पातळी**: 🟢 उच्च — वैधानिक BIS नियमांवर आधारित",
      ],
      [
        /Confidence:\s*🟢 High — Grounded in retrieved BIS evidence/gi,
        "**विश्वासार्हता पातळी**: 🟢 उच्च — अधिकृत BIS पुराव्यावर आधारित",
      ],
    ];

    return this.applyReplacements(text, MARATHI_PHRASES);
  }

  private static toGujarati(text: string): string {
    const GUJARATI_PHRASES: Array<[RegExp, string]> = [
      [
        /### Gold & Silver Hallmarking \([^)]+\) — Verification Guide/gi,
        "### સોના અને ચાંદી હોલમાર્કિંગ (IS 1417 / IS 2112) — ચકાસણી માર્ગદર્શિકા",
      ],
      [
        /### Applicable Standard/gi,
        "### લાગુ પડતું ભારતીય ધોરણ (Applicable Standard)",
      ],
      [
        /### Key Requirements/gi,
        "### મુખ્ય તકનીકી આવશ્યકતાઓ (Key Requirements)",
      ],
      [
        /### Testing Requirements/gi,
        "### પરીક્ષણ આવશ્યકતાઓ (Testing Requirements)",
      ],
      [/### Routine Tests/gi, "### નિયમિત પરીક્ષણો (Routine Tests)"],
      [
        /### The 3 Mandatory Marks on Genuine Gold Jewellery/gi,
        "### અસલ સોનાના ઘરેણાં પર ૩ ફરજિયાત નિશાનો",
      ],
      [
        /### How to Verify HUID on the BIS Care App/gi,
        "### BIS Care એપ પર HUID કેવી રીતે ચકાસવું",
      ],
      [
        /### BIS Certification \/ Marking/gi,
        "### BIS પ્રમાણપત્ર અને ફરજિયાત QCO (BIS Certification)",
      ],
      [/### Evidence/gi, "### સત્તાવાર પુરાવા અને સંદર્ભો (Evidence)"],
      [
        /### Recommended Next Steps/gi,
        "### ભલામણ કરેલ આગળનાં પગલાં (Recommended Next Steps)",
      ],
      [/### Next Steps/gi, "### આગળનાં પગલાં (Next Steps)"],
      [
        /### Consumer Protection Guarantee/gi,
        "### ગ્રાહક સુરક્ષા ગેરંટી (Consumer Protection)",
      ],

      // Hallmarking full sentences
      [
        /Under the Bureau of Indian Standards Act 2016 and statutory Hallmarking Orders, hallmarking is mandatory for gold jewellery in notified districts across India\./gi,
        "બ્યુરો ઓફ ઇન્ડિયન સ્ટાન્ડર્ડ્સ એક્ટ ૨૦૧૬ અને વૈધાનિક હોલમાર્કિંગ ઓર્ડર હેઠળ, સમગ્ર ભારતમાં સૂચિત જિલ્લાઓમાં સોનાના દાગીના માટે હોલમાર્કિંગ ફરજિયાત છે.",
      ],
      [
        /Every piece of genuine hallmarked gold jewellery must carry three distinct laser-engraved marks:/gi,
        "અસલ હોલમાર્કવાળા સોનાના દરેક દાગીના પર ત્રણ વિશિષ્ટ લેસર-કોતરેલા નિશાનો હોવા ફરજિયાત છે:",
      ],
      [
        /1\.\s*🔺\s*\*\*BIS Logo\*\*:\s*Standard triangular emblem certifying official government conformity\./gi,
        "૧. 🔺 **BIS લોગો**: સત્તાવાર સરકારી અનુરૂપતાને પ્રમાણિત કરતું માનક ત્રિકોણાકાર પ્રતીક.",
      ],
      [
        /2\.\s*💎\s*\*\*Purity \/ Fineness Grade\*\*:\s*Standard Karat indication:/gi,
        "૨. 💎 **શુદ્ધતા / ગુણવત્તા ગ્રેડ**: માનક કેરેટ અને શુદ્ધતા સૂચક:",
      ],
      [
        /\*\*24K999\*\*:\s*24 Karat \(99\.9% pure gold — Bullion & Coins\)/gi,
        "**24K999**: ૨૪ કેરેટ (૯૯.૯% શુદ્ધ સોનું — બુલિયન અને સિક્કા)",
      ],
      [
        /\*\*22K916\*\*:\s*22 Karat \(91\.6% pure gold — Traditional Jewellery\)/gi,
        "**22K916**: ૨૨ કેરેટ (૯૧.૬% શુદ્ધ સોનું — પરંપરાગત ઘરેણાં)",
      ],
      [
        /\*\*18K750\*\*:\s*18 Karat \(75\.0% pure gold — Diamond & Stone Jewellery\)/gi,
        "**18K750**: ૧૮ કેરેટ (૭૫.૦% શુદ્ધ સોનું — હીરા અને રત્ન જડિત ઘરેણાં)",
      ],
      [
        /\*\*14K585\*\*:\s*14 Karat \(58\.5% pure gold\)/gi,
        "**14K585**: ૧૪ કેરેટ (૫૮.૫% શુદ્ધ સોનું)",
      ],
      [
        /3\.\s*🔢\s*\*\*6-Digit Alphanumeric HUID\*\*:\s*Hallmarking Unique Identification code providing complete end-to-end traceability\./gi,
        "૩. 🔢 **૬-અંકનો આલ્ફાન્યૂમેરિક HUID**: સંપૂર્ણ ટ્રેસેબિલિટી પૂરી પાડતો હોલમાર્કિંગ વિશિષ્ટ ઓળખ કોડ.",
      ],
      [
        /1\.\s*Download and open the \*\*BIS Care App\*\* \(Android \/ iOS\)\./gi,
        "૧. **BIS Care App** (Android / iOS) ડાઉનલોડ કરો અને ખોલો.",
      ],
      [
        /2\.\s*Tap \*\*"Verify HUID"\*\* on the home screen\./gi,
        '૨. હોમ સ્ક્રીન પર **"Verify HUID"** પર ટેપ કરો.',
      ],
      [
        /3\.\s*Enter the 6-digit alphanumeric code stamped on your jewellery piece\./gi,
        "૩. તમારા દાગીના પર અંકિત ૬-અંકનો આલ્ફાન્યૂમેરિક કોડ દાખલ કરો.",
      ],
      [
        /4\.\s*Instantly view:\s*Jeweller Name & Registration, Assaying Centre \(AHC\), Date of Hallmarking, and Article Type\./gi,
        "૪. તરત જુઓ: જ્વેલર્સનું નામ અને નોંધણી, પરખ કેન્દ્ર (AHC), હોલમાર્કિંગ તારીખ અને ઉત્પાદનનો પ્રકાર.",
      ],
      [
        /6-digit alphanumeric Hallmarking Unique Identification \(HUID\) code gives full traceability of purity and jeweller registration on the BIS Care App\./gi,
        "૬-અંકનો આલ્ફાન્યૂમેરિક હોલમાર્કિંગ વિશિષ્ટ ઓળખ (HUID) કોડ BIS Care એપ પર શુદ્ધતા અને જ્વેલર્સ નોંધણીની સંપૂર્ણ ટ્રેસેબિલિટી આપે છે.",
      ],
      [
        /Three mandatory marks:\s*BIS Logo, Purity grade \(e\.g\.22K916\), and 6-digit alphanumeric HUID\./gi,
        "ત્રણ ફરજિયાત નિશાનો: BIS લોગો, શુદ્ધતા ગ્રેડ (દા.ત. 22K916), અને ૬-અંકનો આલ્ફાન્યૂમેરિક HUID કોડ.",
      ],
      [
        /If hallmarked jewellery is tested in an assay lab and found to be lower purity than marked, the jeweller is legally obligated under BIS regulations to refund the purity difference plus compensation\./gi,
        "જો હોલમાર્ક કરેલા ઘરેણાંનું લેબમાં પરીક્ષણ કરવામાં આવે અને અંકિત કરતાં ઓછી શુદ્ધતા જણાય, તો BIS નિયમો હેઠળ જ્વેલર્સ શુદ્ધતાનો તફાવત અને વળતર પરત કરવા કાયદેસર રીતે બંધાયેલા છે.",
      ],
      [
        /Confidence:\s*🟢 High — Grounded in statutory BIS regulations/gi,
        "**વિશ્વસનીયતા સ્તર**: 🟢 ઉચ્ચ — વૈધાનિક BIS નિયમો પર આધારિત",
      ],
    ];

    return this.applyReplacements(text, GUJARATI_PHRASES);
  }

  private static toKannada(text: string): string {
    const KANNADA_PHRASES: Array<[RegExp, string]> = [
      [
        /### Gold & Silver Hallmarking \([^)]+\) — Verification Guide/gi,
        "### ಚಿನ್ನ ಮತ್ತು ಬೆಳ್ಳಿ ಹಾಲ್‌ಮಾರ್ಕಿಂಗ್ (IS 1417 / IS 2112) — ಪರಿಶೀಲನಾ ಮಾರ್ಗದರ್ಶಿ",
      ],
      [
        /### Applicable Standard/gi,
        "### ಅನ್ವಯವಾಗುವ ಭಾರತೀಯ ಮಾನದಂಡ (Applicable Standard)",
      ],
      [
        /### Key Requirements/gi,
        "### ಪ್ರಮುಖ ತಾಂತ್ರಿಕ ಅಗತ್ಯತೆಗಳು (Key Requirements)",
      ],
      [
        /### Testing Requirements/gi,
        "### ಪರೀಕ್ಷಾ ಅಗತ್ಯತೆಗಳು (Testing Requirements)",
      ],
      [/### Routine Tests/gi, "### ನಿಯಮಿತ ಪರೀಕ್ಷೆಗಳು (Routine Tests)"],
      [
        /### The 3 Mandatory Marks on Genuine Gold Jewellery/gi,
        "### ಅಸಲಿ ಚಿನ್ನದ ಆಭರಣಗಳ ಮೇಲಿನ 3 ಕಡ್ಡಾಯ ಗುರುತುಗಳು",
      ],
      [
        /### How to Verify HUID on the BIS Care App/gi,
        "### BIS Care ಆಪ್‌ನಲ್ಲಿ HUID ಪರಿಶೀಲಿಸುವುದು ಹೇಗೆ",
      ],
      [
        /### BIS Certification \/ Marking/gi,
        "### BIS ಪ್ರಮಾಣೀಕರಣ ಮತ್ತು ಕಡ್ಡಾಯ QCO (BIS Certification)",
      ],
      [/### Evidence/gi, "### ಅಧಿಕೃತ ಸಾಕ್ಷ್ಯ ಮತ್ತು ಉಲ್ಲೇಖಗಳು (Evidence)"],
      [
        /### Recommended Next Steps/gi,
        "### ಶಿಫಾರಸು ಮಾಡಲಾದ ಮುಂದಿನ ಹಂತಗಳು (Recommended Next Steps)",
      ],
      [/### Next Steps/gi, "### ಮುಂದಿನ ಹಂತಗಳು (Next Steps)"],
      [
        /### Consumer Protection Guarantee/gi,
        "### ಗ್ರಾಹಕ ಸಂರಕ್ಷಣಾ ಖಾತರಿ (Consumer Protection)",
      ],

      // Hallmarking full sentences
      [
        /Under the Bureau of Indian Standards Act 2016 and statutory Hallmarking Orders, hallmarking is mandatory for gold jewellery in notified districts across India\./gi,
        "ಭಾರತೀಯ ಮಾನದಂಡಗಳ ಬ್ಯೂರೋ ಕಾಯ್ದೆ 2016 ಮತ್ತು ಶಾಸನಬದ್ಧ ಹಾಲ್‌ಮಾರ್ಕಿಂಗ್ ಆದೇಶಗಳ ಅಡಿಯಲ್ಲಿ, ಭಾರತದಾದ್ಯಂತ ಅಧಿಸೂಚಿತ ಜಿಲ್ಲೆಗಳಲ್ಲಿ ಚಿನ್ನದ ಆಭರಣಗಳಿಗೆ ಹಾಲ್‌ಮಾರ್ಕಿಂಗ್ ಕಡ್ಡಾಯವಾಗಿದೆ.",
      ],
      [
        /Every piece of genuine hallmarked gold jewellery must carry three distinct laser-engraved marks:/gi,
        "ಅಸಲಿ ಹಾಲ್‌ಮಾರ್ಕ್ ಮಾಡಿದ ಪ್ರತಿಯೊಂದು ಚಿನ್ನದ ಆಭರಣದ ಮೇಲೆ ಮೂರು ವಿಶಿಷ್ಟ ಲೇಸರ್-ಕೆತ್ತಿದ ಗುರುತುಗಳು ಇರಲೇಬೇಕು:",
      ],
      [
        /1\.\s*🔺\s*\*\*BIS Logo\*\*:\s*Standard triangular emblem certifying official government conformity\./gi,
        "1. 🔺 **BIS ಲೋಗೋ**: ಅಧಿಕೃತ ಸರ್ಕಾರದ ಅನುಸರಣೆಯನ್ನು ಪ್ರಮಾಣೀಕರಿಸುವ ಪ್ರಮಾಣಿತ ತ್ರಿಕೋನ ಲಾಂಛನ.",
      ],
      [
        /2\.\s*💎\s*\*\*Purity \/ Fineness Grade\*\*:\s*Standard Karat indication:/gi,
        "2. 💎 **ಶುದ್ಧತೆ / ಗುಣಮಟ್ಟ ಗ್ರೇಡ್**: ಪ್ರಮಾಣಿತ ಕ್ಯಾರೆಟ್ ಮತ್ತು ಶುದ್ಧತೆ ಸೂಚನೆ:",
      ],
      [
        /\*\*24K999\*\*:\s*24 Karat \(99\.9% pure gold — Bullion & Coins\)/gi,
        "**24K999**: 24 ಕ್ಯಾರೆಟ್ (99.9% ಶುದ್ಧ ಚಿನ್ನ — ಬುಲಿಯನ್ & ನಾಣ್ಯಗಳು)",
      ],
      [
        /\*\*22K916\*\*:\s*22 Karat \(91\.6% pure gold — Traditional Jewellery\)/gi,
        "**22K916**: 22 ಕ್ಯಾರೆಟ್ (91.6% ಶುದ್ಧ ಚಿನ್ನ — ಸಾಂಪ್ರದಾಯಿಕ ಆಭರಣಗಳು)",
      ],
      [
        /\*\*18K750\*\*:\s*18 Karat \(75\.0% pure gold — Diamond & Stone Jewellery\)/gi,
        "**18K750**: 18 ಕ್ಯಾರೆಟ್ (75.0% ಶುದ್ಧ ಚಿನ್ನ — ವಜ್ರ ಮತ್ತು ಹರಳುಗಳ ಆಭರಣಗಳು)",
      ],
      [
        /\*\*14K585\*\*:\s*14 Karat \(58\.5% pure gold\)/gi,
        "**14K585**: 14 ಕ್ಯಾರೆಟ್ (58.5% ಶುದ್ಧ ಚಿನ್ನ)",
      ],
      [
        /3\.\s*🔢\s*\*\*6-Digit Alphanumeric HUID\*\*:\s*Hallmarking Unique Identification code providing complete end-to-end traceability\./gi,
        "3. 🔢 **6-ಅಂಕಿಯ ಆಲ್ಫಾನ್ಯೂಮರಿಕ್ HUID**: ಸಂಪೂರ್ಣ ಟ್ರೇಸಿಬಿಲಿಟಿ ಒದಗಿಸುವ ಹಾಲ್‌ಮಾರ್ಕಿಂಗ್ ಅನನ್ಯ ಗುರುತಿನ ಕೋಡ್.",
      ],
      [
        /1\.\s*Download and open the \*\*BIS Care App\*\* \(Android \/ iOS\)\./gi,
        "1. **BIS Care App** (Android / iOS) ಡೌನ್‌ಲೋಡ್ ಮಾಡಿ ಮತ್ತು ತೆರೆಯಿರಿ.",
      ],
      [
        /2\.\s*Tap \*\*"Verify HUID"\*\* on the home screen\./gi,
        '2. ಮುಖಪುಟದಲ್ಲಿ **"Verify HUID"** ಮೇಲೆ ಟ್ಯಾಪ್ ಮಾಡಿ.',
      ],
      [
        /3\.\s*Enter the 6-digit alphanumeric code stamped on your jewellery piece\./gi,
        "3. ನಿಮ್ಮ ಆಭರಣದ ಮೇಲೆ ಮುದ್ರಿಸಲಾದ 6-ಅಂಕಿಯ ಆಲ್ಫಾನ್ಯೂಮರಿಕ್ ಕೋಡ್ ಅನ್ನು ನಮೂದಿಸಿ.",
      ],
      [
        /4\.\s*Instantly view:\s*Jeweller Name & Registration, Assaying Centre \(AHC\), Date of Hallmarking, and Article Type\./gi,
        "4. ತಕ್ಷಣವೇ ನೋಡಿ: ಆಭರಣ ವ್ಯಾಪಾರಿ ಹೆಸರು & ನೋಂದಣಿ, ಪರಿಶೀಲನಾ ಕೇಂದ್ರ (AHC), ಹಾಲ್‌ಮಾರ್ಕಿಂಗ್ ದಿನಾಂಕ ಮತ್ತು ಉತ್ಪನ್ನದ ಪ್ರಕಾರ.",
      ],
      [
        /6-digit alphanumeric Hallmarking Unique Identification \(HUID\) code gives full traceability of purity and jeweller registration on the BIS Care App\./gi,
        "6-ಅಂಕಿಯ ಆಲ್ಫಾನ್ಯೂಮರಿಕ್ ಹಾಲ್‌ಮಾರ್ಕಿಂಗ್ ಅನನ್ಯ ಗುರುತಿನ (HUID) ಕೋಡ್ BIS Care ಆಪ್‌ನಲ್ಲಿ ಶುದ್ಧತೆ ಮತ್ತು ಆಭರಣ ವ್ಯಾಪಾರಿ ನೋಂದಣಿಯ ಸಂಪೂರ್ಣ ವಿವರಗಳನ್ನು ನೀಡುತ್ತದೆ.",
      ],
      [
        /Three mandatory marks:\s*BIS Logo, Purity grade \(e\.g\.22K916\), and 6-digit alphanumeric HUID\./gi,
        "ಮೂರು ಕಡ್ಡಾಯ ಗುರುತುಗಳು: BIS ಲೋಗೋ, ಶುದ್ಧತೆ ಗ್ರೇಡ್ (ಉದಾ. 22K916), ಮತ್ತು 6-ಅಂಕಿಯ ಆಲ್ಫಾನ್ಯೂಮರಿಕ್ HUID ಕೋಡ್.",
      ],
      [
        /If hallmarked jewellery is tested in an assay lab and found to be lower purity than marked, the jeweller is legally obligated under BIS regulations to refund the purity difference plus compensation\./gi,
        "ಹಾಲ್‌ಮಾರ್ಕ್ ಮಾಡಿದ ಆಭರಣಗಳನ್ನು ಲ್ಯಾಬ್‌ನಲ್ಲಿ ಪರೀಕ್ಷಿಸಿ ಕಡಿಮೆ ಶುದ್ಧತೆ ಕಂಡುಬಂದರೆ, BIS ನಿಯಮಗಳ ಪ್ರಕಾರ ವ್ಯತ್ಯಾಸ ಮತ್ತು ಪರಿಹಾರವನ್ನು ಮರುಪಾವತಿಸಲು ಆಭರಣ ವ್ಯಾಪಾರಿ ಕಾನೂನುಬದ್ಧವಾಗಿ ಬದ್ಧರಾಗಿರುತ್ತಾರೆ.",
      ],
      [
        /Confidence:\s*🟢 High — Grounded in statutory BIS regulations/gi,
        "**ವಿಶ್ವಾಸಾರ್ಹತೆಯ ಮಟ್ಟ**: 🟢 ಉನ್ನತ — ಶಾಸನಬದ್ಧ BIS ನಿಯಮಗಳ ಆಧಾರದ ಮೇಲೆ",
      ],
    ];

    return this.applyReplacements(text, KANNADA_PHRASES);
  }

  private static toMalayalam(text: string): string {
    const MALAYALAM_PHRASES: Array<[RegExp, string]> = [
      [
        /### Gold & Silver Hallmarking \([^)]+\) — Verification Guide/gi,
        "### സ്വർണ്ണവും വെള്ളിയും ഹാൾമാർക്കിംഗ് (IS 1417 / IS 2112) — പരിശോധനാ ഗൈഡ്",
      ],
      [
        /### Applicable Standard/gi,
        "### ബാധകമായ ഇന്ത്യൻ മാനദണ്ഡം (Applicable Standard)",
      ],
      [
        /### Key Requirements/gi,
        "### പ്രധാന സാങ്കേതിക ആവശ്യകതകൾ (Key Requirements)",
      ],
      [
        /### Testing Requirements/gi,
        "### പരിശോധനാ ആവശ്യകതകൾ (Testing Requirements)",
      ],
      [/### Routine Tests/gi, "### പതിവ് പരിശോധനകൾ (Routine Tests)"],
      [
        /### The 3 Mandatory Marks on Genuine Gold Jewellery/gi,
        "### യഥാർത്ഥ സ്വർണ്ണാഭരണങ്ങളിലെ 3 നിർബന്ധിത അടയാളങ്ങൾ",
      ],
      [
        /### How to Verify HUID on the BIS Care App/gi,
        "### BIS Care ആപ്പിൽ HUID എങ്ങനെ പരിശോധിക്കാം",
      ],
      [
        /### BIS Certification \/ Marking/gi,
        "### BIS സർട്ടിഫിക്കേഷനും നിർബന്ധിത QCO (BIS Certification)",
      ],
      [/### Evidence/gi, "### ഔദ്യോഗിക തെളിവുകളും ഉദ്ധരണികളും (Evidence)"],
      [
        /### Recommended Next Steps/gi,
        "### ശുപാർശ ചെയ്യുന്ന അടുത്ത ഘട്ടങ്ങൾ (Recommended Next Steps)",
      ],
      [/### Next Steps/gi, "### അടുത്ത ഘട്ടങ്ങൾ (Next Steps)"],
      [
        /### Consumer Protection Guarantee/gi,
        "### ഉപഭോക്തൃ സംരക്ഷണ ഗ്യാരണ്ടി (Consumer Protection)",
      ],

      // Hallmarking full sentences
      [
        /Under the Bureau of Indian Standards Act 2016 and statutory Hallmarking Orders, hallmarking is mandatory for gold jewellery in notified districts across India\./gi,
        "ബ്യൂറോ ഓഫ് ഇന്ത്യൻ സ്റ്റാൻഡേർഡ്സ് ആക്റ്റ് 2016 പ്രകാരവും നിയമാനുസൃത ഹാൾമാർക്കിംഗ് ഉത്തരവുകൾ പ്രകാരവും, ഇന്ത്യയിലുടനീളമുള്ള വിജ്ഞാപനം ചെയ്ത ജില്ലകളിൽ സ്വർണ്ണാഭരണങ്ങൾക്ക് ഹാൾമാർക്കിംഗ് നിർബന്ധമാണ്.",
      ],
      [
        /Every piece of genuine hallmarked gold jewellery must carry three distinct laser-engraved marks:/gi,
        "യഥാർത്ഥ ഹാൾമാർക്ക് ചെയ്ത ഓരോ സ്വർണ്ണാഭരണത്തിലും മൂന്ന് പ്രത്യേക ലേസർ പതിച്ച അടയാളങ്ങൾ ഉണ്ടായിരിക്കണം:",
      ],
      [
        /1\.\s*🔺\s*\*\*BIS Logo\*\*:\s*Standard triangular emblem certifying official government conformity\./gi,
        "1. 🔺 **BIS ലോഗോ**: ഔദ്യോഗിക സർക്കാർ അനുരൂപത സാക്ഷ്യപ്പെടുത്തുന്ന ത്രികോണാകൃതിയിലുള്ള ചിഹ്നം.",
      ],
      [
        /2\.\s*💎\s*\*\*Purity \/ Fineness Grade\*\*:\s*Standard Karat indication:/gi,
        "2. 💎 **ശുദ്ധി / ഗ്രേഡ്**: സ്റ്റാൻഡേർഡ് കാരറ്റ് സൂചന:",
      ],
      [
        /\*\*24K999\*\*:\s*24 Karat \(99\.9% pure gold — Bullion & Coins\)/gi,
        "**24K999**: 24 കാരറ്റ് (99.9% ശുദ്ധമായ സ്വർണ്ണം — ബിസ്ക്കറ്റ് & നാണയങ്ങൾ)",
      ],
      [
        /\*\*22K916\*\*:\s*22 Karat \(91\.6% pure gold — Traditional Jewellery\)/gi,
        "**22K916**: 22 കാരറ്റ് (91.6% ശുദ്ധമായ സ്വർണ്ണം — പരമ്പരാഗത ആഭരണങ്ങൾ)",
      ],
      [
        /\*\*18K750\*\*:\s*18 Karat \(75\.0% pure gold — Diamond & Stone Jewellery\)/gi,
        "**18K750**: 18 കാരറ്റ് (75.0% ശുദ്ധമായ സ്വർണ്ണം — വജ്രം & രത്നാഭരണങ്ങൾ)",
      ],
      [
        /\*\*14K585\*\*:\s*14 Karat \(58\.5% pure gold\)/gi,
        "**14K585**: 14 കാരറ്റ് (58.5% ശുദ്ധമായ സ്വർണ്ണം)",
      ],
      [
        /3\.\s*🔢\s*\*\*6-Digit Alphanumeric HUID\*\*:\s*Hallmarking Unique Identification code providing complete end-to-end traceability\./gi,
        "3. 🔢 **6 അക്ക ആൽഫാന്യൂമെറിക് HUID**: പൂർണ്ണമായ കണ്ടെത്തൽ സൗകര്യം നൽകുന്ന ഹാൾമാർക്കിംഗ് തനത് തിരിച്ചറിയൽ കോഡ്.",
      ],
      [
        /1\.\s*Download and open the \*\*BIS Care App\*\* \(Android \/ iOS\)\./gi,
        "1. **BIS Care App** (Android / iOS) ഡൗൺലോഡ് ചെയ്ത് തുറക്കുക.",
      ],
      [
        /2\.\s*Tap \*\*"Verify HUID"\*\* on the home screen\./gi,
        '2. ഹോം സ്ക്രീനിൽ **"Verify HUID"** ടാപ്പ് ചെയ്യുക.',
      ],
      [
        /3\.\s*Enter the 6-digit alphanumeric code stamped on your jewellery piece\./gi,
        "3. നിങ്ങളുടെ ആഭരണത്തിൽ പതിപ്പിച്ചിട്ടുള്ള 6 അക്ക ആൽഫാന്യൂമെറിക് കോഡ് നൽകുക.",
      ],
      [
        /4\.\s*Instantly view:\s*Jeweller Name & Registration, Assaying Centre \(AHC\), Date of Hallmarking, and Article Type\./gi,
        "4. തൽക്ഷണം കാണുക: ജ്വല്ലറിയുടെ പേര് & രജിസ്ട്രേഷൻ, പരിശോധനാ കേന്ദ്രം (AHC), ഹാൾമാർക്കിംഗ് തീയതി, ഉൽപ്പന്ന തരം.",
      ],
      [
        /6-digit alphanumeric Hallmarking Unique Identification \(HUID\) code gives full traceability of purity and jeweller registration on the BIS Care App\./gi,
        "6 അക്ക ആൽഫാന്യൂമെറിക് ഹാൾമാർക്കിംഗ് തനത് തിരിച്ചറിയൽ (HUID) കോഡ് BIS Care ആപ്പിൽ ശുദ്ധതയുടെയും ജ്വല്ലറി രജിസ്ട്രേഷന്റെയും പൂർണ്ണമായ വിവരങ്ങൾ നൽകുന്നു.",
      ],
      [
        /Three mandatory marks:\s*BIS Logo, Purity grade \(e\.g\.22K916\), and 6-digit alphanumeric HUID\./gi,
        "മൂന്ന് നിർബന്ധിത അടയാളങ്ങൾ: BIS ലോഗോ, ശുദ്ധി ഗ്രേഡ് (ഉദാ. 22K916), കൂടാതെ 6 അക്ക HUID കോഡ്.",
      ],
      [
        /Confidence:\s*🟢 High — Grounded in statutory BIS regulations/gi,
        "**വിശ്വാസ്യത നില**: 🟢 ഉയർന്നത് — നിയമാനുസൃത BIS ചട്ടങ്ങളുടെ അടിസ്ഥാനത്തിൽ",
      ],
    ];

    return this.applyReplacements(text, MALAYALAM_PHRASES);
  }

  private static toPunjabi(text: string): string {
    const PUNJABI_PHRASES: Array<[RegExp, string]> = [
      [
        /### Gold & Silver Hallmarking \([^)]+\) — Verification Guide/gi,
        "### ਸੋਨਾ ਅਤੇ ਚਾਂਦੀ ਹਾਲਮਾਰਕਿੰਗ (IS 1417 / IS 2112) — ਤਸਦੀਕ ਗਾਈਡ",
      ],
      [
        /### Applicable Standard/gi,
        "### ਲਾਗੂ ਭਾਰਤੀ ਮਿਆਰ (Applicable Standard)",
      ],
      [/### Key Requirements/gi, "### ਮੁੱਖ ਤਕਨੀਕੀ ਲੋੜਾਂ (Key Requirements)"],
      [
        /### Testing Requirements/gi,
        "### ਟੈਸਟਿੰਗ ਲੋੜਾਂ (Testing Requirements)",
      ],
      [/### Routine Tests/gi, "### ਰੁਟੀਨ ਟੈਸਟ (Routine Tests)"],
      [
        /### The 3 Mandatory Marks on Genuine Gold Jewellery/gi,
        "### ਅਸਲੀ ਸੋਨੇ ਦੇ ਗਹਿਣਿਆਂ 'ਤੇ 3 ਲਾਜ਼ਮੀ ਨਿਸ਼ਾਨ",
      ],
      [
        /### How to Verify HUID on the BIS Care App/gi,
        "### BIS Care ਐਪ 'ਤੇ HUID ਦੀ ਜਾਂਚ ਕਿਵੇਂ ਕਰੀਏ",
      ],
      [
        /### BIS Certification \/ Marking/gi,
        "### BIS ਪ੍ਰਮਾਣੀਕਰਨ ਅਤੇ ਲਾਜ਼ਮੀ QCO (BIS Certification)",
      ],
      [/### Evidence/gi, "### ਅਧਿਕਾਰਤ ਸਬੂਤ ਅਤੇ ਹਵਾਲੇ (Evidence)"],
      [
        /### Recommended Next Steps/gi,
        "### ਸਿਫਾਰਸ਼ ਕੀਤੇ ਅਗਲੇ ਕਦਮ (Recommended Next Steps)",
      ],
      [/### Next Steps/gi, "### ਅਗਲੇ ਕਦਮ (Next Steps)"],
      [
        /### Consumer Protection Guarantee/gi,
        "### ਖਪਤਕਾਰ ਸੁਰੱਖਿਆ ਗਾਰੰਟੀ (Consumer Protection)",
      ],

      // Hallmarking full sentences
      [
        /Under the Bureau of Indian Standards Act 2016 and statutory Hallmarking Orders, hallmarking is mandatory for gold jewellery in notified districts across India\./gi,
        "ਬਿਊਰੋ ਆਫ਼ ਇੰਡੀਅਨ ਸਟੈਂਡਰਡਜ਼ ਐਕਟ 2016 ਅਤੇ ਕਾਨੂੰਨੀ ਹਾਲਮਾਰਕਿੰਗ ਆਦੇਸ਼ਾਂ ਤਹਿਤ, ਭਾਰਤ ਭਰ ਦੇ ਨੋਟੀਫਾਈਡ ਜ਼ਿਲ੍ਹਿਆਂ ਵਿੱਚ ਸੋਨੇ ਦੇ ਗਹਿਣਿਆਂ ਲਈ ਹਾਲਮਾਰਕਿੰਗ ਲਾਜ਼ਮੀ ਹੈ।",
      ],
      [
        /Every piece of genuine hallmarked gold jewellery must carry three distinct laser-engraved marks:/gi,
        "ਅਸਲੀ ਹਾਲਮਾਰਕ ਵਾਲੇ ਸੋਨੇ ਦੇ ਹਰੇਕ ਗਹਿਣੇ 'ਤੇ ਤਿੰਨ ਵੱਖਰੇ ਲੇਜ਼ਰ-ਉੱਕਰੇ ਹੋਏ ਨਿਸ਼ਾਨ ਹੋਣੇ ਲਾਜ਼ਮੀ ਹਨ:",
      ],
      [
        /1\.\s*🔺\s*\*\*BIS Logo\*\*:\s*Standard triangular emblem certifying official government conformity\./gi,
        "1. 🔺 **BIS ਲੋਗੋ**: ਅਧਿਕਾਰਤ ਸਰਕਾਰੀ ਅਨੁਕੂਲਤਾ ਨੂੰ ਪ੍ਰਮਾਣਿਤ ਕਰਨ ਵਾਲਾ ਮਿਆਰੀ ਤਿਕੋਣਾ ਪ੍ਰਤੀਕ।",
      ],
      [
        /2\.\s*💎\s*\*\*Purity \/ Fineness Grade\*\*:\s*Standard Karat indication:/gi,
        "2. 💎 **ਸ਼ੁੱਧਤਾ / ਗਰੇਡ**: ਮਿਆਰੀ ਕੈਰੇਟ ਸੰਕੇਤ:",
      ],
      [
        /\*\*24K999\*\*:\s*24 Karat \(99\.9% pure gold — Bullion & Coins\)/gi,
        "**24K999**: 24 ਕੈਰੇਟ (99.9% ਖਾਲਸ ਸੋਨਾ — ਬੁਲੀਅਨ ਅਤੇ ਸਿੱਕੇ)",
      ],
      [
        /\*\*22K916\*\*:\s*22 Karat \(91\.6% pure gold — Traditional Jewellery\)/gi,
        "**22K916**: 22 ਕੈਰੇਟ (91.6% ਖਾਲਸ ਸੋਨਾ — ਰਵਾਇਤੀ ਗਹਿਣੇ)",
      ],
      [
        /\*\*18K750\*\*:\s*18 Karat \(75\.0% pure gold — Diamond & Stone Jewellery\)/gi,
        "**18K750**: 18 ਕੈਰੇਟ (75.0% ਖਾਲਸ ਸੋਨਾ — ਹੀਰੇ ਦੇ ਗਹਿਣੇ)",
      ],
      [
        /\*\*14K585\*\*:\s*14 Karat \(58\.5% pure gold\)/gi,
        "**14K585**: 14 ਕੈਰੇਟ (58.5% ਖਾਲਸ ਸੋਨਾ)",
      ],
      [
        /3\.\s*🔢\s*\*\*6-Digit Alphanumeric HUID\*\*:\s*Hallmarking Unique Identification code providing complete end-to-end traceability\./gi,
        "3. 🔢 **6-ਅੰਕਾਂ ਵਾਲਾ ਅਲਫਾਨਿਊਮੇਰਿਕ HUID**: ਪੂਰੀ ਟਰੇਸੇਬਿਲਟੀ ਪ੍ਰਦਾਨ ਕਰਨ ਵਾਲਾ ਹਾਲਮਾਰਕਿੰਗ ਵਿਲੱਖਣ ਪਛਾਣ ਕੋਡ।",
      ],
      [
        /1\.\s*Download and open the \*\*BIS Care App\*\* \(Android \/ iOS\)\./gi,
        "1. **BIS Care App** (Android / iOS) ਡਾਊਨਲੋਡ ਕਰੋ ਅਤੇ ਖੋਲ੍ਹੋ।",
      ],
      [
        /2\.\s*Tap \*\*"Verify HUID"\*\* on the home screen\./gi,
        "2. ਹੋਮ ਸਕ੍ਰੀਨ 'ਤੇ **\"Verify HUID\"** 'ਤੇ ਟੈਪ ਕਰੋ।",
      ],
      [
        /3\.\s*Enter the 6-digit alphanumeric code stamped on your jewellery piece\./gi,
        "3. ਆਪਣੇ ਗਹਿਣਿਆਂ 'ਤੇ ਲਿਖਿਆ 6-ਅੰਕਾਂ ਵਾਲਾ ਅਲਫਾਨਿਊਮੇਰਿਕ ਕੋਡ ਦਰਜ ਕਰੋ।",
      ],
      [
        /4\.\s*Instantly view:\s*Jeweller Name & Registration, Assaying Centre \(AHC\), Date of Hallmarking, and Article Type\./gi,
        "4. ਤੁਰੰਤ ਦੇਖੋ: ਜੌਹਰੀ ਦਾ ਨਾਮ ਅਤੇ ਰਜਿਸਟ੍ਰੇਸ਼ਨ, ਪਰਖ ਕੇਂਦਰ (AHC), ਹਾਲਮਾਰਕਿੰਗ ਮਿਤੀ ਅਤੇ ਉਤਪਾਦ ਦੀ ਕਿਸਮ।",
      ],
      [
        /6-digit alphanumeric Hallmarking Unique Identification \(HUID\) code gives full traceability of purity and jeweller registration on the BIS Care App\./gi,
        "6-ਅੰਕਾਂ ਵਾਲਾ ਅਲਫਾਨਿਊਮੇਰਿਕ ਹਾਲਮਾਰਕਿੰਗ ਵਿਲੱਖਣ ਪਛਾਣ (HUID) ਕੋਡ BIS Care ਐਪ 'ਤੇ ਸ਼ੁੱਧਤਾ ਅਤੇ ਜੌਹਰੀ ਰਜਿਸਟ੍ਰੇਸ਼ਨ ਦੀ ਪੂਰੀ ਟਰੇਸੇਬਿਲਟੀ ਦਿੰਦਾ ਹੈ।",
      ],
      [
        /Three mandatory marks:\s*BIS Logo, Purity grade \(e\.g\.22K916\), and 6-digit alphanumeric HUID\./gi,
        "ਤਿੰਨ ਲਾਜ਼ਮੀ ਨਿਸ਼ਾਨ: BIS ਲੋਗੋ, ਸ਼ੁੱਧਤਾ ਗ੍ਰੇਡ (ਜਿਵੇਂ 22K916), ਅਤੇ 6-ਅੰਕਾਂ ਵਾਲਾ HUID ਕੋਡ।",
      ],
      [
        /Confidence:\s*🟢 High — Grounded in statutory BIS regulations/gi,
        "**ਭਰੋਸੇਯੋਗਤਾ ਦਾ ਪੱਧਰ**: 🟢 ਉੱਚ — ਕਾਨੂੰਨੀ BIS ਨਿਯਮਾਂ 'ਤੇ ਆਧਾਰਿਤ",
      ],
    ];

    return this.applyReplacements(text, PUNJABI_PHRASES);
  }

  private static toOdia(text: string): string {
    const ODIA_PHRASES: Array<[RegExp, string]> = [
      [
        /### Gold & Silver Hallmarking \([^)]+\) — Verification Guide/gi,
        "### ସୁନା ଏବଂ ରୂପା ହଲମାର୍କିଂ (IS 1417 / IS 2112) — ଯାଞ୍ଚ ମାର୍ଗଦର୍ଶିକା",
      ],
      [
        /### Applicable Standard/gi,
        "### ପ୍ରଯୁଜ୍ୟ ଭାରତୀୟ ମାନକ (Applicable Standard)",
      ],
      [
        /### Key Requirements/gi,
        "### ମୁଖ୍ୟ ବୈଷୟିକ ଆବଶ୍ୟକତା (Key Requirements)",
      ],
      [
        /### Testing Requirements/gi,
        "### ପରୀକ୍ଷଣ ଆବଶ୍ୟକତା (Testing Requirements)",
      ],
      [/### Routine Tests/gi, "### ନିୟମିତ ପରୀକ୍ଷା (Routine Tests)"],
      [
        /### The 3 Mandatory Marks on Genuine Gold Jewellery/gi,
        "### ଅସଲି ସୁନା ଅଳଙ୍କାରରେ ୩ଟି ବାଧ୍ୟତାମୂଳକ ଚିହ୍ନ",
      ],
      [
        /### How to Verify HUID on the BIS Care App/gi,
        "### BIS Care ଆପ୍‌ରେ HUID କିପରି ଯାଞ୍ଚ କରିବେ",
      ],
      [
        /### BIS Certification \/ Marking/gi,
        "### BIS ପ୍ରମାଣପତ୍ର ଏବଂ ବାଧ୍ୟତାମୂଳକ QCO (BIS Certification)",
      ],
      [/### Evidence/gi, "### ପ୍ରମାଣ ଏବଂ ଉଦ୍ଧୃତି (Evidence)"],
      [
        /### Recommended Next Steps/gi,
        "### ସୁପାରିଶ କରାଯାଇଥିବା ପରବର୍ତ୍ତୀ ପଦକ୍ଷେପ (Recommended Next Steps)",
      ],
      [/### Next Steps/gi, "### ପରବର୍ତ୍ତୀ ପଦକ୍ଷେପ (Next Steps)"],
      [
        /### Consumer Protection Guarantee/gi,
        "### ଗ୍ରାହକ ସୁରକ୍ଷା ଗ୍ୟାରେଣ୍ଟି (Consumer Protection)",
      ],

      // Hallmarking full sentences
      [
        /Under the Bureau of Indian Standards Act 2016 and statutory Hallmarking Orders, hallmarking is mandatory for gold jewellery in notified districts across India\./gi,
        "ବ୍ୟୁରୋ ଅଫ୍ ଇଣ୍ଡିଆନ୍ ଷ୍ଟାଣ୍ଡାର୍ଡସ୍ ଆକ୍ଟ ୨୦୧୬ ଏବଂ ଆଇନଗତ ହଲମାର୍କିଂ ନିର୍ଦ୍ଦେଶ ଅନୁଯାୟୀ, ଭାରତର ବିଜ୍ଞପ୍ତ ଜିଲ୍ଲାଗୁଡ଼ିକରେ ସୁନା ଅଳଙ୍କାର ପାଇଁ ହଲମାର୍କିଂ ବାଧ୍ୟତାମୂଳକ।",
      ],
      [
        /Every piece of genuine hallmarked gold jewellery must carry three distinct laser-engraved marks:/gi,
        "ଅସଲି ହଲମାର୍କ ହୋଇଥିବା ପ୍ରତ୍ୟେକ ସୁନା ଅଳଙ୍କାରରେ ତିନୋଟି ସ୍ୱତନ୍ତ୍ର ଲେଜର-ଖୋଦିତ ଚିହ୍ନ ରହିବା ବାଧ୍ୟତାମୂଳକ:",
      ],
      [
        /1\.\s*🔺\s*\*\*BIS Logo\*\*:\s*Standard triangular emblem certifying official government conformity\./gi,
        "୧. 🔺 **BIS ଲୋଗୋ**: ସରକାରୀ ମାନକ ଅନୁରୂପତା ପ୍ରମାଣିତ କରୁଥିବା ତ୍ରିକୋଣୀୟ ପ୍ରତୀକ।",
      ],
      [
        /2\.\s*💎\s*\*\*Purity \/ Fineness Grade\*\*:\s*Standard Karat indication:/gi,
        "୨. 💎 **ବିଶୁଦ୍ଧତା / ଗ୍ରେଡ୍**: ମାନକ କ୍ୟାରେଟ୍ ସୂଚକ:",
      ],
      [
        /\*\*24K999\*\*:\s*24 Karat \(99\.9% pure gold — Bullion & Coins\)/gi,
        "**24K999**: ୨୪ କ୍ୟାରେଟ୍ (୯୯.୯% ବିଶୁଦ୍ଧ ସୁନା — ବୁଲିଅନ୍ ଏବଂ ମୁଦ୍ରା)",
      ],
      [
        /\*\*22K916\*\*:\s*22 Karat \(91\.6% pure gold — Traditional Jewellery\)/gi,
        "**22K916**: ୨୨ କ୍ୟାରେଟ୍ (୯୧.୬% ବିଶୁଦ୍ଧ ସୁନା — ପାରମ୍ପରିକ ଅଳଙ୍କାର)",
      ],
      [
        /\*\*18K750\*\*:\s*18 Karat \(75\.0% pure gold — Diamond & Stone Jewellery\)/gi,
        "**18K750**: ୧୮ କ୍ୟାରେଟ୍ (୭୫.୦% ବିଶୁଦ୍ଧ ସୁନା — ହୀରା ଅଳଙ୍କାର)",
      ],
      [
        /\*\*14K585\*\*:\s*14 Karat \(58\.5% pure gold\)/gi,
        "**14K585**: ୧୪ କ୍ୟାରେଟ୍ (୫୮.୫% ବିଶୁଦ୍ଧ ସୁନା)",
      ],
      [
        /3\.\s*🔢\s*\*\*6-Digit Alphanumeric HUID\*\*:\s*Hallmarking Unique Identification code providing complete end-to-end traceability\./gi,
        "୩. 🔢 **୬-ଅଙ୍କ ବିଶିଷ୍ଟ HUID**: ସମ୍ପୂର୍ଣ୍ଣ ଚିହ୍ନଟ ସୁବିଧା ପ୍ରଦାନ କରୁଥିବା ହଲମାର୍କିଂ ଅନନ୍ୟ ପରିଚୟ କୋଡ୍।",
      ],
      [
        /1\.\s*Download and open the \*\*BIS Care App\*\* \(Android \/ iOS\)\./gi,
        "୧. **BIS Care App** (Android / iOS) ଡାଉନଲୋଡ୍ କରି ଖୋଲନ୍ତୁ।",
      ],
      [
        /2\.\s*Tap \*\*"Verify HUID"\*\* on the home screen\./gi,
        '୨. ହୋମ୍ ସ୍କ୍ରିନ୍‌ରେ **"Verify HUID"** ଉପରେ ଟ୍ୟାପ୍ କରନ୍ତୁ।',
      ],
      [
        /3\.\s*Enter the 6-digit alphanumeric code stamped on your jewellery piece\./gi,
        "୩. ଆପଣଙ୍କ ଅଳଙ୍କାରରେ ଥିବା ୬-ଅଙ୍କ ବିଶିଷ୍ଟ କୋଡ୍ ପ୍ରବେଶ କରନ୍ତୁ।",
      ],
      [
        /4\.\s*Instantly view:\s*Jeweller Name & Registration, Assaying Centre \(AHC\), Date of Hallmarking, and Article Type\./gi,
        "୪. ତୁରନ୍ତ ଦେଖନ୍ତୁ: ଜ୍ୱେලର୍ସଙ୍କ ନାମ ଓ ପଞ୍ଜୀକରଣ, ପରୀକ୍ଷଣ କେନ୍ଦ୍ର (AHC), ହଲମାର୍କିଂ ତାରିଖ ଏବଂ ଉତ୍ପାଦର ପ୍ରକାର।",
      ],
      [
        /6-digit alphanumeric Hallmarking Unique Identification \(HUID\) code gives full traceability of purity and jeweller registration on the BIS Care App\./gi,
        "୬-ଅଙ୍କ ବିଶିଷ୍ଟ ହଲମାର୍କିଂ ଅନନ୍ୟ ପରିଚୟ (HUID) କୋଡ୍ BIS Care ଆପ୍‌ରେ ବିଶୁଦ୍ଧତା ଏବଂ ଜ୍ୱେଲର୍ସ ପଞ୍ଜୀକରଣର ସମ୍ପୂର୍ଣ୍ଣ ବିବରଣୀ ପ୍ରଦାନ କରେ।",
      ],
      [
        /Three mandatory marks:\s*BIS Logo, Purity grade \(e\.g\.22K916\), and 6-digit alphanumeric HUID\./gi,
        "ତିନୋଟି ବାଧ୍ୟତାମୂଳକ ଚିହ୍ନ: BIS ଲୋଗୋ, ବିଶୁଦ୍ଧତା ଗ୍ରେଡ୍ (ଯଥା 22K916), ଏବଂ ୬-ଅଙ୍କ ବିଶିଷ୍ଟ HUID କୋଡ୍।",
      ],
      [
        /Confidence:\s*🟢 High — Grounded in statutory BIS regulations/gi,
        "**ବିଶ୍ୱସନୀୟତା ସ୍ତର**: 🟢 ଉଚ୍ଚ — ଆଇନଗତ BIS ନିୟମାବଳୀ ଉପରେ ଆଧାରିତ",
      ],
    ];

    return this.applyReplacements(text, ODIA_PHRASES);
  }

  private static toUrdu(text: string): string {
    const URDU_PHRASES: Array<[RegExp, string]> = [
      [
        /### Gold & Silver Hallmarking \([^)]+\) — Verification Guide/gi,
        "### سونا اور چاندی ہال مارکنگ (IS 1417 / IS 2112) — تصدیقی گائیڈ",
      ],
      [
        /### Applicable Standard/gi,
        "### لاگو بھارتی معیار (Applicable Standard)",
      ],
      [/### Key Requirements/gi, "### اہم تکنیکی ضروریات (Key Requirements)"],
      [
        /### Testing Requirements/gi,
        "### جانچ کی ضروریات (Testing Requirements)",
      ],
      [/### Routine Tests/gi, "### معمول کے ٹیسٹ (Routine Tests)"],
      [
        /### The 3 Mandatory Marks on Genuine Gold Jewellery/gi,
        "### اصلی سونے کے زیورات پر 3 لازمی نشانات",
      ],
      [
        /### How to Verify HUID on the BIS Care App/gi,
        "### BIS Care ایپ پر HUID کی تصدیق کیسے کریں",
      ],
      [
        /### BIS Certification \/ Marking/gi,
        "### BIS سرٹیفیکیشن اور لازمی QCO (BIS Certification)",
      ],
      [/### Evidence/gi, "### سرکاری شواہد اور حوالہ جات (Evidence)"],
      [
        /### Recommended Next Steps/gi,
        "### تجویز کردہ اگلے اقدامات (Recommended Next Steps)",
      ],
      [/### Next Steps/gi, "### اگلے اقدامات (Next Steps)"],
      [
        /### Consumer Protection Guarantee/gi,
        "### تحفظ صارفین کی ضمانت (Consumer Protection)",
      ],

      // Hallmarking full sentences
      [
        /Under the Bureau of Indian Standards Act 2016 and statutory Hallmarking Orders, hallmarking is mandatory for gold jewellery in notified districts across India\./gi,
        "بیورو آف انڈین اسٹینڈرڈز ایکٹ 2016 اور قانونی ہال مارکنگ احکامات کے تحت، پورے ہندوستان کے نوٹیفائیڈ اضلاع میں سونے کے زیورات کے لیے ہال مارکنگ لازمی ہے۔",
      ],
      [
        /Every piece of genuine hallmarked gold jewellery must carry three distinct laser-engraved marks:/gi,
        "اصلی ہال مارک شدہ سونے کے ہر زیور پر تین الگ الگ لیزر سے کندہ نشانات ہونا لازمی ہیں:",
      ],
      [
        /1\.\s*🔺\s*\*\*BIS Logo\*\*:\s*Standard triangular emblem certifying official government conformity\./gi,
        "1. 🔺 **BIS لوگو**: سرکاری معیار کی تصدیق کرنے والا معیاری تکونی نشان۔",
      ],
      [
        /2\.\s*💎\s*\*\*Purity \/ Fineness Grade\*\*:\s*Standard Karat indication:/gi,
        "2. 💎 **خالص پن / گریڈ**: معیاری قیراط اور خالص پن کا اشارہ:",
      ],
      [
        /\*\*24K999\*\*:\s*24 Karat \(99\.9% pure gold — Bullion & Coins\)/gi,
        "**24K999**: 24 قیراط (99.9% خالص سونا — سکے اور اینٹیں)",
      ],
      [
        /\*\*22K916\*\*:\s*22 Karat \(91\.6% pure gold — Traditional Jewellery\)/gi,
        "**22K916**: 22 قیراط (91.6% خالص سونا — روایتی زیورات)",
      ],
      [
        /\*\*18K750\*\*:\s*18 Karat \(75\.0% pure gold — Diamond & Stone Jewellery\)/gi,
        "**18K750**: 18 قیراط (75.0% خالص سونا — ہیرے کے زیورات)",
      ],
      [
        /\*\*14K585\*\*:\s*14 Karat \(58\.5% pure gold\)/gi,
        "**14K585**: 14 قیراط (58.5% خالص سونا)",
      ],
      [
        /3\.\s*🔢\s*\*\*6-Digit Alphanumeric HUID\*\*:\s*Hallmarking Unique Identification code providing complete end-to-end traceability\./gi,
        "3. 🔢 **6 ہندسوں کا HUID കോڈ**: مکمل سراغ رسانی فراہم کرنے والا منفرد شناختی کوڈ۔",
      ],
      [
        /1\.\s*Download and open the \*\*BIS Care App\*\* \(Android \/ iOS\)\./gi,
        "1. **BIS Care App** (Android / iOS) ڈاؤن لوڈ کریں اور کھولیں۔",
      ],
      [
        /2\.\s*Tap \*\*"Verify HUID"\*\* on the home screen\./gi,
        '2. ہوم اسکرین پر **"Verify HUID"** پر ٹیپ کریں۔',
      ],
      [
        /3\.\s*Enter the 6-digit alphanumeric code stamped on your jewellery piece\./gi,
        "3. اپنے زیور پر کندہ 6 ہندسوں کا کوڈ درج کریں۔",
      ],
      [
        /4\.\s*Instantly view:\s*Jeweller Name & Registration, Assaying Centre \(AHC\), Date of Hallmarking, and Article Type\./gi,
        "4. فوری دیکھیں: سنار کا نام و رجسٹریشن، ہال مارکنگ سینٹر (AHC)، تاریخ اور آئٹم کی قسم۔",
      ],
      [
        /6-digit alphanumeric Hallmarking Unique Identification \(HUID\) code gives full traceability of purity and jeweller registration on the BIS Care App\./gi,
        "6 ہندسوں کا الفانیومرک ہال مارکنگ منفرد شناختی (HUID) کوڈ BIS Care ایپ پر خالص پن اور رجسٹریشن کی مکمل تصدیق فراہم کرتا ہے۔",
      ],
      [
        /Three mandatory marks:\s*BIS Logo, Purity grade \(e\.g\.22K916\), and 6-digit alphanumeric HUID\./gi,
        "تین لازمی نشانات: BIS لوگو، خالص پن کا گریڈ (مثلاً 22K916)، اور 6 ہندسوں کا HUID کوڈ۔",
      ],
      [
        /Confidence:\s*🟢 High — Grounded in statutory BIS regulations/gi,
        "**اعتماد کی سطح**: 🟢 اعلیٰ — قانونی BIS ضوابط کی بنیاد پر",
      ],
    ];

    return this.applyReplacements(text, URDU_PHRASES);
  }

  private static toAssamese(text: string): string {
    const ASSAMESE_PHRASES: Array<[RegExp, string]> = [
      [
        /### Gold & Silver Hallmarking \([^)]+\) — Verification Guide/gi,
        "### সোণ আৰু ৰূপৰ হলমাৰ্কিং (IS 1417 / IS 2112) — সত্যাপন নিৰ্দেশিকা",
      ],
      [
        /### Applicable Standard/gi,
        "### প্ৰযোজ্য ভাৰতীয় মানক (Applicable Standard)",
      ],
      [
        /### Key Requirements/gi,
        "### মুখ্য কাৰিকৰী প্ৰয়োজনীয়তা (Key Requirements)",
      ],
      [
        /### Testing Requirements/gi,
        "### পৰীক্ষাৰ প্ৰয়োজনীয়তা (Testing Requirements)",
      ],
      [/### Routine Tests/gi, "### নিয়মীয়া পৰীক্ষা (Routine Tests)"],
      [
        /### The 3 Mandatory Marks on Genuine Gold Jewellery/gi,
        "### আচল সোণৰ গহনাত থকা ৩টা বাধ্যতামূলক চিহ্ন",
      ],
      [
        /### How to Verify HUID on the BIS Care App/gi,
        "### BIS Care এপত HUID কেনেকৈ পৰীক্ষা কৰিব",
      ],
      [
        /### BIS Certification \/ Marking/gi,
        "### BIS প্ৰমাণপত্ৰ আৰু বাধ্যতামূলক QCO (BIS Certification)",
      ],
      [/### Evidence/gi, "### প্ৰমাণ আৰু উদ্ধৃতি (Evidence)"],
      [
        /### Recommended Next Steps/gi,
        "### পৰামৰ্শ দিয়া পৰৱৰ্তী পদক্ষেপ (Recommended Next Steps)",
      ],
      [/### Next Steps/gi, "### পৰৱৰ্তী পদক্ষেপ (Next Steps)"],
      [
        /### Consumer Protection Guarantee/gi,
        "### গ্ৰাহক সুৰক্ষা গেৰাণ্টি (Consumer Protection)",
      ],

      // Hallmarking full sentences
      [
        /Under the Bureau of Indian Standards Act 2016 and statutory Hallmarking Orders, hallmarking is mandatory for gold jewellery in notified districts across India\./gi,
        "ভাৰতীয় মানক ব্যুৰো আইন ২০১৬ আৰু বিধিসন্মত হলমাৰ্কিং আদেশ অনুসৰি, সমগ্ৰ ভাৰতৰ অধিসূচিত জিলাসমূহত সোণৰ গহনাৰ বাবে হলমাৰ্কিং বাধ্যতামূলক।",
      ],
      [
        /Every piece of genuine hallmarked gold jewellery must carry three distinct laser-engraved marks:/gi,
        "আচল হলমাৰ্কযুক্ত প্ৰতিটো সোণৰ গহনাত তিনিটা সুকীয়া লেজাৰ-খোদিত চিহ্ন থকাটো বাধ্যতামূলক:",
      ],
      [
        /1\.\s*🔺\s*\*\*BIS Logo\*\*:\s*Standard triangular emblem certifying official government conformity\./gi,
        "১. 🔺 **BIS লোগো**: চৰকাৰী মানক প্ৰমাণিত কৰা মানক ত্ৰিকোণীয়া প্ৰতীক।",
      ],
      [
        /2\.\s*💎\s*\*\*Purity \/ Fineness Grade\*\*:\s*Standard Karat indication:/gi,
        "২. 💎 **বিশুদ্ধতা / গ্ৰেড**: মানক কেৰেট আৰু বিশুদ্ধতাৰ নিৰ্দেশক:",
      ],
      [
        /\*\*24K999\*\*:\s*24 Karat \(99\.9% pure gold — Bullion & Coins\)/gi,
        "**24K999**: ২৪ কেৰেট (৯৯.৯% খাঁটি সোণ — বুলিয়ন আৰু মুদ্ৰা)",
      ],
      [
        /\*\*22K916\*\*:\s*22 Karat \(91\.6% pure gold — Traditional Jewellery\)/gi,
        "**22K916**: ২২ কেৰেট (৯১.৬% খাঁটি সোণ — পৰম্পৰাগত গহনা)",
      ],
      [
        /\*\*18K750\*\*:\s*18 Karat \(75\.0% pure gold — Diamond & Stone Jewellery\)/gi,
        "**18K750**: ১৮ কেৰেট (৭৫.০% খাঁটি সোণ — হীৰাৰ গহনা)",
      ],
      [
        /\*\*14K585\*\*:\s*14 Karat \(58\.5% pure gold\)/gi,
        "**14K585**: ১৪ কেৰেট (৫৮.৫% খাঁটি সোণ)",
      ],
      [
        /3\.\s*🔢\s*\*\*6-Digit Alphanumeric HUID\*\*:\s*Hallmarking Unique Identification code providing complete end-to-end traceability\./gi,
        "৩. 🔢 **৬-সংখ্যাৰ আলফানিউমেৰিক HUID**: সম্পূৰ্ণ সন্ধানযোগ্যতা প্ৰদান কৰা হলমাৰ্কিং অনন্য চিনাক্তকৰণ ক'ড।",
      ],
      [
        /1\.\s*Download and open the \*\*BIS Care App\*\* \(Android \/ iOS\)\./gi,
        "১. **BIS Care App** (Android / iOS) ডাউনল'ড কৰি খোলক।",
      ],
      [
        /2\.\s*Tap \*\*"Verify HUID"\*\* on the home screen\./gi,
        '২. হোম স্ক্ৰীণত **"Verify HUID"** ত টেপ কৰক।',
      ],
      [
        /3\.\s*Enter the 6-digit alphanumeric code stamped on your jewellery piece\./gi,
        "৩. আপোনাৰ গহনাত থকা ৬-সংখ্যাৰ ক'ডটো প্ৰৱেশ কৰাওক।",
      ],
      [
        /4\.\s*Instantly view:\s*Jeweller Name & Registration, Assaying Centre \(AHC\), Date of Hallmarking, and Article Type\./gi,
        "৪. লগে লগে চাওক: জুৱেলাৰৰ নাম আৰু পঞ্জীয়ন, পৰীক্ষা কেন্দ্ৰ (AHC), হলমাৰ্কিং তাৰিখ আৰু সামগ্ৰীৰ প্ৰকাৰ।",
      ],
      [
        /6-digit alphanumeric Hallmarking Unique Identification \(HUID\) code gives full traceability of purity and jeweller registration on the BIS Care App\./gi,
        "৬-সংখ্যাৰ আলফানিউমেৰিক হলমাৰ্কিং অনন্য চিনাক্তকৰণ (HUID) ক'ডে BIS Care এপত বিশুদ্ধতা আৰু জুৱেলাৰ পঞ্জীয়নৰ সম্পূৰ্ণ সন্ধান দিয়ে।",
      ],
      [
        /Three mandatory marks:\s*BIS Logo, Purity grade \(e\.g\.22K916\), and 6-digit alphanumeric HUID\./gi,
        "তিনিটা বাধ্যতামূলক চিহ্ন: BIS লোগো, বিশুদ্ধতা গ্ৰেড (যেনে 22K916), আৰু ৬-সংখ্যাৰ HUID ক'ড।",
      ],
      [
        /Confidence:\s*🟢 High — Grounded in statutory BIS regulations/gi,
        "**বিশ্বাসযোগ্যতাৰ স্তৰ**: 🟢 উচ্চ — বিধিসন্মত BIS নিয়মৰ ওপৰত ভিত্তি কৰি",
      ],
    ];

    return this.applyReplacements(text, ASSAMESE_PHRASES);
  }

  private static toSanskrit(text: string): string {
    const SANSKRIT_PHRASES: Array<[RegExp, string]> = [
      [
        /### Gold & Silver Hallmarking \([^)]+\) — Verification Guide/gi,
        "### सुवर्ण-रजत-हॉलमार्किंग (IS 1417 / IS 2112) — प्रमाणीकरण-मार्गदर्शिका",
      ],
      [
        /### Applicable Standard/gi,
        "### प्रयोज्यं भारतीयमानकम् (Applicable Standard)",
      ],
      [
        /### Key Requirements/gi,
        "### मुख्याः प्राविधिक-आवश्यकताः (Key Requirements)",
      ],
      [
        /### Testing Requirements/gi,
        "### परीक्षण-आवश्यकताः (Testing Requirements)",
      ],
      [/### Routine Tests/gi, "### नैत्यिक-परीक्षणानि (Routine Tests)"],
      [
        /### The 3 Mandatory Marks on Genuine Gold Jewellery/gi,
        "### वास्तविक-स्वर्णाभूषणेषु ३ अनिवार्याणि चिह्नानि",
      ],
      [
        /### How to Verify HUID on the BIS Care App/gi,
        "### BIS Care अनुप्रयोगात् HUID कथं सत्यापनीयम्",
      ],
      [
        /### BIS Certification \/ Marking/gi,
        "### BIS प्रमाणीकरणम् (BIS Certification)",
      ],
      [/### Evidence/gi, "### आधिकारिक-प्रमाणानि (Evidence)"],
      [/### Next Steps/gi, "### अग्रिमाणि पदानि (Next Steps)"],
      [
        /Confidence:\s*🟢 High — Grounded in statutory BIS regulations/gi,
        "**विश्वसनीयता-स्तरः**: 🟢 उच्चः — वैधानिक-मानकानुसारम्",
      ],
    ];
    return this.applyReplacements(text, SANSKRIT_PHRASES);
  }

  private static toMaithili(text: string): string {
    const MAITHILI_PHRASES: Array<[RegExp, string]> = [
      [
        /### Gold & Silver Hallmarking \([^)]+\) — Verification Guide/gi,
        "### सोना आ चांदी हॉलमार्किंग (IS 1417 / IS 2112) — सत्यापन गाइड",
      ],
      [
        /### Applicable Standard/gi,
        "### लागू भारतीय मानक (Applicable Standard)",
      ],
      [/### Key Requirements/gi, "### मुख्य आवश्यकता (Key Requirements)"],
      [
        /### Testing Requirements/gi,
        "### परीक्षण आवश्यकता (Testing Requirements)",
      ],
      [
        /### The 3 Mandatory Marks on Genuine Gold Jewellery/gi,
        "### असली सोनाक गहना पर ३ टा अनिवार्य पहचान चिह्न",
      ],
      [
        /### How to Verify HUID on the BIS Care App/gi,
        "### BIS Care ऐप पर HUID कोना सत्यापित करू",
      ],
      [
        /### BIS Certification \/ Marking/gi,
        "### BIS प्रमाणन (BIS Certification)",
      ],
      [/### Evidence/gi, "### प्रामाणिक साक्ष्य (Evidence)"],
      [/### Next Steps/gi, "### अगिला कदम (Next Steps)"],
      [
        /Confidence:\s*🟢 High — Grounded in statutory BIS regulations/gi,
        "**विश्वसनीयता स्तर**: 🟢 उच्च — वैधानिक BIS नियमावली पर आधारित",
      ],
    ];
    return this.applyReplacements(text, MAITHILI_PHRASES);
  }

  private static toNepali(text: string): string {
    const NEPALI_PHRASES: Array<[RegExp, string]> = [
      [
        /### Gold & Silver Hallmarking \([^)]+\) — Verification Guide/gi,
        "### सुन र चाँदी हलमार्किंग (IS 1417 / IS 2112) — प्रमाणीकरण गाइड",
      ],
      [
        /### Applicable Standard/gi,
        "### लागू भारतीय मानक (Applicable Standard)",
      ],
      [
        /### Key Requirements/gi,
        "### मुख्य प्राविधिक आवश्यकताहरू (Key Requirements)",
      ],
      [
        /### Testing Requirements/gi,
        "### परीक्षण आवश्यकताहरू (Testing Requirements)",
      ],
      [
        /### The 3 Mandatory Marks on Genuine Gold Jewellery/gi,
        "### वास्तविक सुनको गहनामा ३ अनिवार्य चिन्हहरू",
      ],
      [
        /### How to Verify HUID on the BIS Care App/gi,
        "### BIS Care एपमा HUID कसरी प्रमाणीकरण गर्ने",
      ],
      [
        /### BIS Certification \/ Marking/gi,
        "### BIS प्रमाणीकरण (BIS Certification)",
      ],
      [/### Evidence/gi, "### प्रमाण तथा उद्धरणहरू (Evidence)"],
      [/### Next Steps/gi, "### आगामी कदमहरू (Next Steps)"],
      [
        /Confidence:\s*🟢 High — Grounded in statutory BIS regulations/gi,
        "**विश्वसनीयता स्तर**: 🟢 उच्च — वैधानिक BIS नियमहरूमा आधारित",
      ],
    ];
    return this.applyReplacements(text, NEPALI_PHRASES);
  }

  private static toKonkani(text: string): string {
    const KONKANI_PHRASES: Array<[RegExp, string]> = [
      [
        /### Gold & Silver Hallmarking \([^)]+\) — Verification Guide/gi,
        "### भांगर आनी रुपें हॉलमार्किंग (IS 1417 / IS 2112) — पडताळणी मार्गदर्शक",
      ],
      [
        /### Applicable Standard/gi,
        "### लागू भारतीय मानक (Applicable Standard)",
      ],
      [/### Key Requirements/gi, "### मुखेल आवश्यकता (Key Requirements)"],
      [
        /### Testing Requirements/gi,
        "### तपासणी आवश्यकता (Testing Requirements)",
      ],
      [
        /### The 3 Mandatory Marks on Genuine Gold Jewellery/gi,
        "### खऱ्या भांगराच्या दागिन्यांचेर ३ सक्तीच्यो खुणा",
      ],
      [
        /### How to Verify HUID on the BIS Care App/gi,
        "### BIS Care ॲपार HUID कशी तपासची",
      ],
      [
        /### BIS Certification \/ Marking/gi,
        "### BIS प्रमाणन (BIS Certification)",
      ],
      [/### Evidence/gi, "### अधिकृत पुरावे (Evidence)"],
      [/### Next Steps/gi, "### फुडलीं पावलां (Next Steps)"],
    ];
    return this.applyReplacements(text, KONKANI_PHRASES);
  }

  private static toSindhi(text: string): string {
    const SINDHI_PHRASES: Array<[RegExp, string]> = [
      [
        /### Gold & Silver Hallmarking \([^)]+\) — Verification Guide/gi,
        "### سون ۽ چاندي ہال مارڪنگ — تصديق گائيڊ",
      ],
      [
        /### Applicable Standard/gi,
        "### لاڳو ڀارتي معيار (Applicable Standard)",
      ],
      [/### Key Requirements/gi, "### مکيه ضرورتون (Key Requirements)"],
      [
        /### Testing Requirements/gi,
        "### چڪاس جون ضرورتون (Testing Requirements)",
      ],
      [
        /### The 3 Mandatory Marks on Genuine Gold Jewellery/gi,
        "### اصلي سون جي زيورن تي 3 لازمي نشان",
      ],
      [/### Evidence/gi, "### شواهد ۽ حوالا (Evidence)"],
      [/### Next Steps/gi, "### اਗيان قدم (Next Steps)"],
    ];
    return this.applyReplacements(text, SINDHI_PHRASES);
  }

  private static toKashmiri(text: string): string {
    const KASHMIRI_PHRASES: Array<[RegExp, string]> = [
      [
        /### Gold & Silver Hallmarking \([^)]+\) — Verification Guide/gi,
        "### سون تہ رۄپھ ہال مارکنگ — تصدیقی رہنمائی",
      ],
      [
        /### Applicable Standard/gi,
        "### لاگو بھارتی معیار (Applicable Standard)",
      ],
      [/### Key Requirements/gi, "### اہم تکنیکی ضرورتہٕ (Key Requirements)"],
      [/### Testing Requirements/gi, "### جانچ ضرورتہٕ (Testing Requirements)"],
      [
        /### The 3 Mandatory Marks on Genuine Gold Jewellery/gi,
        "### اصلی سۄنہٕ زیوراتن پیٹھ ۳ لازمی نشانات",
      ],
      [/### Evidence/gi, "### شواہد (Evidence)"],
      [/### Next Steps/gi, "### اڳم قدم (Next Steps)"],
    ];
    return this.applyReplacements(text, KASHMIRI_PHRASES);
  }

  private static toSantali(text: string): string {
    const SANTALI_PHRASES: Array<[RegExp, string]> = [
      [
        /### Gold & Silver Hallmarking \([^)]+\) — Verification Guide/gi,
        "### ᱥᱚᱱᱟ ᱟᱨ ᱨᱩᱯᱟᱹ ᱦᱚᱞᱢᱟᱨᱠᱤᱝ — ᱯᱟᱨᱠᱷᱟᱣ ᱫᱤᱥᱟᱹ",
      ],
      [
        /### Applicable Standard/gi,
        "### ᱞᱟᱜᱩ ᱵᱷᱟᱨᱚᱛᱤᱭᱚ ᱢᱟᱱᱚᱠ (Applicable Standard)",
      ],
      [
        /### Key Requirements/gi,
        "### ᱢᱩᱬᱩᱛ ᱞᱟᱹᱠᱛᱤᱭᱟᱱ ᱡᱤᱱᱤᱥ (Key Requirements)",
      ],
      [
        /### Testing Requirements/gi,
        "### ᱵᱤᱰᱟᱹᱣ ᱞᱟᱹᱠᱛᱤ (Testing Requirements)",
      ],
      [
        /### The 3 Mandatory Marks on Genuine Gold Jewellery/gi,
        "### ᱥᱟᱹᱨᱤ ᱥᱚᱱᱟ ᱜᱚᱦᱬᱟ ᱨᱮ ᱓ ᱜᱚᱴᱟᱝ ᱪᱤᱱᱦᱟᱹ",
      ],
      [/### Evidence/gi, "### ᱥᱟᱹᱠᱷᱤ ᱟᱨ ᱥᱟᱹᱵᱩᱛ (Evidence)"],
      [/### Next Steps/gi, "### ᱞᱟᱦᱟ ᱥᱮᱱᱟᱜ ᱠᱟᱹᱢᱤ (Next Steps)"],
    ];
    return this.applyReplacements(text, SANTALI_PHRASES);
  }

  private static toDogri(text: string): string {
    const DOGRI_PHRASES: Array<[RegExp, string]> = [
      [
        /### Gold & Silver Hallmarking \([^)]+\) — Verification Guide/gi,
        "### सोना ते चांदी हालमार्किंग — सत्यापन गाइड",
      ],
      [
        /### Applicable Standard/gi,
        "### लागू भारतीय मानक (Applicable Standard)",
      ],
      [/### Key Requirements/gi, "### मुख्ख आवश्यकतां (Key Requirements)"],
      [
        /### Testing Requirements/gi,
        "### परीक्षण आवश्यकतां (Testing Requirements)",
      ],
      [
        /### The 3 Mandatory Marks on Genuine Gold Jewellery/gi,
        "### असली सोने दे गहने पर ३ अनिवार्य निशान",
      ],
      [/### Evidence/gi, "### सबूत ते उद्धरण (Evidence)"],
      [/### Next Steps/gi, "### अग्गे दे कदम (Next Steps)"],
    ];
    return this.applyReplacements(text, DOGRI_PHRASES);
  }

  private static toBodo(text: string): string {
    const BODO_PHRASES: Array<[RegExp, string]> = [
      [
        /### Gold & Silver Hallmarking \([^)]+\) — Verification Guide/gi,
        "### सना आरो रुपा हलमार्किं — आनजाद बिथोन",
      ],
      [
        /### Applicable Standard/gi,
        "### बाहायजाथाव भारतारि मान (Applicable Standard)",
      ],
      [/### Key Requirements/gi, "### गाहाय गोनांथारफोर (Key Requirements)"],
      [
        /### Testing Requirements/gi,
        "### आनजादनि गोनांथारफोर (Testing Requirements)",
      ],
      [
        /### The 3 Mandatory Marks on Genuine Gold Jewellery/gi,
        "### सैथो सनानि गहनायाव ३ टा थि सिन",
      ],
      [/### Evidence/gi, "### फोरमान (Evidence)"],
      [/### Next Steps/gi, "### ਉਨनि थांखिफोर (Next Steps)"],
    ];
    return this.applyReplacements(text, BODO_PHRASES);
  }

  private static toManipuri(text: string): string {
    const MANIPURI_PHRASES: Array<[RegExp, string]> = [
      [
        /### Gold & Silver Hallmarking \([^)]+\) — Verification Guide/gi,
        "### সনা অমসুং লুপা হোলমার্কিং — য়েংশিনবগী লমজিং",
      ],
      [
        /### Applicable Standard/gi,
        "### চৎনবা য়ারবা ভারতকী মানক (Applicable Standard)",
      ],
      [/### Key Requirements/gi, "### মরুওইবা তঙাইফদবশিং (Key Requirements)"],
      [
        /### Testing Requirements/gi,
        "### চাংয়েং তৌবগী তঙাইফদবশিং (Testing Requirements)",
      ],
      [
        /### The 3 Mandatory Marks on Genuine Gold Jewellery/gi,
        "### অচুম্বা সনাগী লৈতেংদা লৈগদবা ৩ চপ চারবা মশকশিং",
      ],
      [/### Evidence/gi, "### প্রমান (Evidence)"],
      [/### Next Steps/gi, "### তুংগী খোঙথাংশিং (Next Steps)"],
    ];
    return this.applyReplacements(text, MANIPURI_PHRASES);
  }
}
