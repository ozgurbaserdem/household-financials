export interface TipData {
  key: string;
  translationKey: string;
}

export interface FAQData {
  questionKey: string;
  answerKey: string;
}

export const TIPS_DATA: TipData[] = [
  { key: "tip1", translationKey: "tips_section.tip1" },
  { key: "tip2", translationKey: "tips_section.tip2" },
  { key: "tip3", translationKey: "tips_section.tip3" },
  { key: "tip4", translationKey: "tips_section.tip4" },
  { key: "tip5", translationKey: "tips_section.tip5" },
  { key: "tip6", translationKey: "tips_section.tip6" },
];

export const FAQ_DATA: FAQData[] = [
  {
    questionKey: "faq_section.q1.question",
    answerKey: "faq_section.q1.answer",
  },
  {
    questionKey: "faq_section.q2.question",
    answerKey: "faq_section.q2.answer",
  },
  {
    questionKey: "faq_section.q3.question",
    answerKey: "faq_section.q3.answer",
  },
];
