import { createSlice, createSelector } from "@reduxjs/toolkit";
import { LESSONS } from "@/data/lessons";

const LEVELS = ["beginner", "intermediate", "advanced"];

const learningSlice = createSlice({
  name: "learning",
  initialState: { level: "beginner", completedLessons: [] },
  reducers: {
    setLevel(state, action) {
      if (LEVELS.includes(action.payload)) state.level = action.payload;
    },
    toggleLesson(state, action) {
      const id = action.payload;
      state.completedLessons = state.completedLessons.includes(id)
        ? state.completedLessons.filter((l) => l !== id)
        : [...state.completedLessons, id];
    },
    resetProgress(state) {
      state.completedLessons = [];
    },
  },
});

export const { setLevel, toggleLesson, resetProgress } = learningSlice.actions;
export const selectLevel = (s) => s.learning.level;
export const selectCompleted = (s) => s.learning.completedLessons;
// Progress = completed lessons / all lessons (a real number, never made up).
// createSelector remembers its last result, so the same state gives the same object back.
export const selectProgress = createSelector([selectCompleted], (completed) => {
  const done = completed.filter((id) => LESSONS.some((l) => l.id === id)).length;
  return { done, total: LESSONS.length, percent: Math.round((done / LESSONS.length) * 100) };
});
export default learningSlice.reducer;
