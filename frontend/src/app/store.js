import { configureStore } from "@reduxjs/toolkit";
import bookmarksReducer from "@/features/bookmarks/bookmarksSlice";
import learningReducer from "@/features/learning/learningSlice";
import quizReducer from "@/features/quiz/quizSlice";
import { loadJSON, saveJSON } from "@/utils/storage";

const KEY = "githelp-redux";

// Restore saved state, but only keep the parts we expect (safe against bad data).
function preload() {
  const saved = loadJSON(KEY, {});
  const out = {};
  if (Array.isArray(saved?.bookmarks?.items)) out.bookmarks = { items: saved.bookmarks.items };
  if (saved?.learning && Array.isArray(saved.learning.completedLessons)) out.learning = saved.learning;
  if (saved?.quiz && typeof saved.quiz === "object" && saved.quiz.answers) out.quiz = saved.quiz;
  return out;
}

export const store = configureStore({
  reducer: { bookmarks: bookmarksReducer, learning: learningReducer, quiz: quizReducer },
  preloadedState: preload(),
});

store.subscribe(() => saveJSON(KEY, store.getState()));
