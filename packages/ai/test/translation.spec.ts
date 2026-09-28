import { IndicLanguageEngine } from '../src/providers/translation.provider';
import { IndianLanguage } from '@bis/shared-types';

describe('IndicLanguageEngine', () => {
  const engine = new IndicLanguageEngine();

  it('should detect Hindi script correctly', async () => {
    const lang = await engine.detectLanguage('मुझे अपने product के लिए BIS certification चाहिए।');
    expect(lang).toBe(IndianLanguage.HI);
  });

  it('should detect Hinglish correctly', async () => {
    const lang = await engine.detectLanguage('ISI mark kaise verify karein?');
    expect(lang).toBe(IndianLanguage.HINGLISH);
  });

  it('should detect English correctly', async () => {
    const lang = await engine.detectLanguage('What is the applicable standard for stainless steel water bottles?');
    expect(lang).toBe(IndianLanguage.EN);
  });

  it('should detect Bengali script correctly', async () => {
    const lang = await engine.detectLanguage('স্টেইনলেস স্টিল বোতলের জন্য প্রযোজ্য মানক কোনটি?');
    expect(lang).toBe(IndianLanguage.BN);
  });

  it('should detect Tamil script correctly', async () => {
    const lang = await engine.detectLanguage('தங்க நகைகளின் ஹால்மார்க் விவரங்களை எப்படி சரிபார்ப்பது?');
    expect(lang).toBe(IndianLanguage.TA);
  });

  it('should preserve technical IS numbers and clause references during query processing', async () => {
    const query = 'IS 10500 Clause 4.2 me total dissolved solids ka limit kya hai?';
    const { translatedText, preservedEntities } = await engine.translateToEnglish(query, IndianLanguage.HINGLISH);

    expect(preservedEntities).toContain('IS 10500');
    expect(preservedEntities).toContain('Clause 4.2');
    expect(translatedText).toContain('IS 10500');
    expect(translatedText).toContain('Clause 4.2');
  });

  it('should normalize Hindi query to canonical English search query', async () => {
    const query = 'स्टेनलेस स्टील पानी की बोतल के लिए मानक';
    const { translatedText } = await engine.translateToEnglish(query, IndianLanguage.HI);

    expect(translatedText.toLowerCase()).toContain('stainless steel');
    expect(translatedText.toLowerCase()).toContain('standard');
  });

  it('should translate English answer to Hindi while preserving citations and standard codes', async () => {
    const englishAnswer = 'Applicable Standard: IS 17526:2021 for stainless steel bottles [1]. Testing Requirements include Clause 4.1.';
    const translated = await engine.translateFromEnglish(englishAnswer, IndianLanguage.HI);

    expect(translated).toContain('IS 17526:2021');
    expect(translated).toContain('Clause 4.1');
    expect(translated).toContain('[1]');
    expect(translated).toMatch(/मानक|आवश्यकताएं|लागू/);
  });

  it('should translate Gold Hallmarking answer to Telugu with full body and preserved citations', async () => {
    const goldAnswer = `### Gold & Silver Hallmarking (IS 1417 / IS 2112) — Verification Guide\n\nUnder the Bureau of Indian Standards Act 2016 and statutory Hallmarking Orders, hallmarking is mandatory for gold jewellery in notified districts across India.\n\n### Applicable Standard\n\n**IS 1417:2016 — Gold and Gold Alloys, Jewellery/Artefacts — Fineness and Marking** [1]\n\n### The 3 Mandatory Marks on Genuine Gold Jewellery\n\nEvery piece of genuine hallmarked gold jewellery must carry three distinct laser-engraved marks:`;
    const translated = await engine.translateFromEnglish(goldAnswer, IndianLanguage.TE);

    expect(translated).toContain('బంగారం మరియు వెండి హాల్‌మార్కింగ్');
    expect(translated).toContain('వర్తించే భారతీయ ప్రమాణం');
    expect(translated).toContain('భారతీయ ప్రమాణాల బ్యూరో చట్టం 2016');
    expect(translated).toContain('IS 1417:2016');
    expect(translated).toContain('[1]');
    expect(translated).toContain('అసలైన బంగారు ఆభరణాలపై 3 తప్పనిసరి గుర్తులు');
    // Ensure headings and citations are NOT glued together
    expect(translated).not.toContain('[1]###');
  });

  it('should translate Gold Hallmarking answer to Tamil with full body and preserved citations', async () => {
    const goldAnswer = `### Gold & Silver Hallmarking (IS 1417 / IS 2112) — Verification Guide\n\nUnder the Bureau of Indian Standards Act 2016 and statutory Hallmarking Orders, hallmarking is mandatory for gold jewellery in notified districts across India.\n\n### Applicable Standard\n\n**IS 1417:2016 — Gold and Gold Alloys, Jewellery/Artefacts — Fineness and Marking** [1]`;
    const translated = await engine.translateFromEnglish(goldAnswer, IndianLanguage.TA);

    expect(translated).toContain('தங்கம் மற்றும் வெள்ளி ஹால்மார்க்கிங்');
    expect(translated).toContain('பொருந்தக்கூடிய இந்திய தரநிலை');
    expect(translated).toContain('இந்திய தரநிலைகள் பணியக சட்டம் 2016');
    expect(translated).toContain('IS 1417:2016');
    expect(translated).toContain('[1]');
  });
});
