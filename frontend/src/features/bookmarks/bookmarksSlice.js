import { createSlice } from "@reduxjs/toolkit";

// A bookmark is identified by its command text, e.g. "git stash".
const bookmarksSlice = createSlice({
  name: "bookmarks",
  initialState: { items: [] }, // [{ command, title, example }]
  reducers: {
    addBookmark(state, action) {
      const exists = state.items.some((b) => b.command === action.payload.command);
      if (!exists) state.items.push(action.payload); // prevents duplicates
    },
    removeBookmark(state, action) {
      state.items = state.items.filter((b) => b.command !== action.payload);
    },
    clearBookmarks(state) {
      state.items = [];
    },
  },
});

export const { addBookmark, removeBookmark, clearBookmarks } = bookmarksSlice.actions;
export const selectBookmarks = (state) => state.bookmarks.items;
export const selectIsBookmarked = (command) => (state) =>
  state.bookmarks.items.some((b) => b.command === command);
export default bookmarksSlice.reducer;
