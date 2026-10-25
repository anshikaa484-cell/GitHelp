import { useCallback } from "react";

// Rule-based keyword matcher. Takes the FAQ dataset and returns a matcher function.
// NO AI / LLM — pure keyword scoring.
export function useChatbotMatch(faqs) {
  const match = useCallback(
    (rawQuestion) => {
      if (!faqs || faqs.length === 0) {
        return {
          answer:
            "I'm still loading my knowledge base. Please try again in a moment.",
          matched: false,
        };
      }

      const q = rawQuestion.toLowerCase().trim();
      if (!q) {
        return { answer: "Please type a Git question.", matched: false };
      }

      const words = q.split(/[^a-z0-9]+/).filter(Boolean);

      let best = null;
      let bestScore = 0;

      for (const faq of faqs) {
        let score = 0;
        for (const kw of faq.keywords || []) {
          const k = kw.toLowerCase();
          if (q.includes(k)) score += 3; // full keyword phrase present
          for (const w of words) {
            if (w === k) score += 2;
            else if (k.includes(w) && w.length > 3) score += 1;
          }
        }
        // also match against the question text
        const qWords = faq.question.toLowerCase().split(/[^a-z0-9]+/);
        for (const w of words) {
          if (w.length > 3 && qWords.includes(w)) score += 1;
        }
        if (score > bestScore) {
          bestScore = score;
          best = faq;
        }
      }

      if (best && bestScore >= 2) {
        return { answer: best.answer, matched: true, faq: best };
      }

      return {
        answer:
          "I'm not sure about that one yet. Try asking about cloning a repo, creating a branch, undoing a commit, pushing to GitHub, or resolving a merge conflict.",
        matched: false,
      };
    },
    [faqs]
  );

  return match;
}

export default useChatbotMatch;
