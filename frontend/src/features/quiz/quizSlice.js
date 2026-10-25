import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  level: null, // which quiz is running
  index: 0, // current question number
  answers: {}, // { [questionId]: { choice, correct } }
  finished: false,
  results: {}, // last finished result per level: { beginner: { score, total } }
};

const quizSlice = createSlice({
  name: "quiz",
  initialState,
  reducers: {
    startQuiz(state, action) {
      state.level = action.payload;
      state.index = 0;
      state.answers = {};
      state.finished = false;
    },
    answerQuestion(state, action) {
      const { id, choice, correct } = action.payload;
      if (!state.answers[id]) state.answers[id] = { choice, correct }; // one answer per question
    },
    goToQuestion(state, action) {
      state.index = action.payload;
    },
    finishQuiz(state) {
      const list = Object.values(state.answers);
      state.finished = true;
      state.results[state.level] = {
        score: list.filter((a) => a.correct).length,
        total: list.length,
      };
    },
    resetQuiz(state) {
      state.level = null;
      state.index = 0;
      state.answers = {};
      state.finished = false;
    },
  },
});

export const { startQuiz, answerQuestion, goToQuestion, finishQuiz, resetQuiz } = quizSlice.actions;
export const selectQuiz = (s) => s.quiz;
export const selectScore = (s) => Object.values(s.quiz.answers).filter((a) => a.correct).length;
export default quizSlice.reducer;
