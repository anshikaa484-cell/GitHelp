import { useCallback } from "react";

// Rule-based Git error diagnoser. Scores each known error against the pasted text.
export function useErrorMatch(errors) {
  const diagnose = useCallback(
    (rawText) => {
      const text = (rawText || "").toLowerCase().trim();
      if (!text) return [];

      const words = text.split(/[^a-z0-9]+/).filter((w) => w.length > 2);

      const scored = errors.map((err) => {
        let score = 0;
        for (const kw of err.keywords) {
          const k = kw.toLowerCase();
          if (text.includes(k)) score += 5; // strong: full phrase present
          else {
            const kwWords = k.split(/[^a-z0-9]+/).filter(Boolean);
            const hits = kwWords.filter((kw2) => words.includes(kw2)).length;
            if (kwWords.length && hits === kwWords.length) score += 3;
            else score += hits;
          }
        }
        return { err, score };
      });

      return scored
        .filter((s) => s.score > 0)
        .sort((a, b) => b.score - a.score)
        .slice(0, 3)
        .map((s) => s.err);
    },
    [errors]
  );

  return diagnose;
}

export default useErrorMatch;
