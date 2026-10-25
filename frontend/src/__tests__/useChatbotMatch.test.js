import { renderHook } from "@testing-library/react";
import useChatbotMatch from "../hooks/useChatbotMatch";

const FAQS = [
  {
    id: "faq-1",
    question: "How do I clone a repository?",
    answer: "Use git clone <url>.",
    keywords: ["clone", "copy", "download", "repository", "repo"],
  },
  {
    id: "faq-2",
    question: "How do I undo my last commit?",
    answer: "Use git reset --soft HEAD~1.",
    keywords: ["undo", "reset", "last commit", "revert"],
  },
];

describe("useChatbotMatch (rule-based keyword matching)", () => {
  test("matches a clone question to the clone FAQ", () => {
    const { result } = renderHook(() => useChatbotMatch(FAQS));
    const res = result.current("How do I clone a repo?");
    expect(res.matched).toBe(true);
    expect(res.answer).toContain("git clone");
  });

  test("matches an undo question to the reset FAQ", () => {
    const { result } = renderHook(() => useChatbotMatch(FAQS));
    const res = result.current("undo my last commit please");
    expect(res.matched).toBe(true);
    expect(res.answer).toContain("git reset --soft");
  });

  test("returns a fallback for an unrelated question", () => {
    const { result } = renderHook(() => useChatbotMatch(FAQS));
    const res = result.current("banana pancakes recipe");
    expect(res.matched).toBe(false);
    expect(res.answer).toMatch(/not sure/i);
  });

  test("handles empty input gracefully", () => {
    const { result } = renderHook(() => useChatbotMatch(FAQS));
    const res = result.current("");
    expect(res.matched).toBe(false);
  });

  test("handles an empty FAQ dataset", () => {
    const { result } = renderHook(() => useChatbotMatch([]));
    const res = result.current("clone a repo");
    expect(res.matched).toBe(false);
  });
});
