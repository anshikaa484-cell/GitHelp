import bookmarks, { addBookmark, removeBookmark } from "../features/bookmarks/bookmarksSlice";
import quiz, { startQuiz, answerQuestion, finishQuiz, resetQuiz } from "../features/quiz/quizSlice";
import learning, { toggleLesson, setLevel } from "../features/learning/learningSlice";
import { createRepo, runCommand } from "../utils/gitSimulator";

describe("bookmarksSlice", () => {
  test("adds once and removes", () => {
    const b = { command: "git stash", title: "Stash", example: "git stash" };
    let s = bookmarks(undefined, addBookmark(b));
    s = bookmarks(s, addBookmark(b)); // duplicate ignored
    expect(s.items).toHaveLength(1);
    expect(bookmarks(s, removeBookmark("git stash")).items).toHaveLength(0);
  });
});

describe("quizSlice", () => {
  test("scores, finishes and resets", () => {
    let s = quiz(undefined, startQuiz("beginner"));
    s = quiz(s, answerQuestion({ id: "b1", choice: 1, correct: true }));
    s = quiz(s, answerQuestion({ id: "b2", choice: 0, correct: false }));
    s = quiz(s, answerQuestion({ id: "b1", choice: 0, correct: false })); // second answer ignored
    s = quiz(s, finishQuiz());
    expect(s.results.beginner).toEqual({ score: 1, total: 2 });
    expect(quiz(s, resetQuiz()).answers).toEqual({});
  });
});

describe("learningSlice", () => {
  test("toggles lessons and ignores invalid levels", () => {
    let s = learning(undefined, toggleLesson("setup"));
    expect(s.completedLessons).toEqual(["setup"]);
    expect(learning(s, toggleLesson("setup")).completedLessons).toEqual([]);
    expect(learning(s, setLevel("expert")).level).toBe("beginner");
  });
});

describe("git simulator", () => {
  const run = (cmds) => cmds.reduce((a, c) => { const r = runCommand(a.repo, c); return { repo: r.repo, out: r.output }; }, { repo: createRepo(), out: "" });
  test("needs init first", () => expect(run(["git status"]).out).toMatch(/not a git repository/));
  test("init, add, commit, log", () => {
    const r = run(["git init", "git add .", 'git commit -m "First"', "git log --oneline"]);
    expect(r.out).toMatch(/First/);
    expect(runCommand(r.repo, "git status").output).toMatch(/working tree clean/);
  });
  test("branches", () => {
    const r = run(["git init", "git add .", 'git commit -m "x"', "git switch -c dev"]);
    expect(r.repo.branch).toBe("dev");
  });
  test("refuses non-git commands", () => expect(run(["rm -rf /"]).out).toMatch(/only git commands/));
});
