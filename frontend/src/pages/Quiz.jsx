import { useDispatch, useSelector } from "react-redux";
import { toast } from "sonner";
import { QUESTIONS, LEVEL_LIST } from "@/data/quizQuestions";
import { selectQuiz, selectScore, startQuiz, answerQuestion, goToQuestion, finishQuiz, resetQuiz } from "@/features/quiz/quizSlice";
import { setLevel } from "@/features/learning/learningSlice";

export default function Quiz() {
  const dispatch = useDispatch();
  const quiz = useSelector(selectQuiz);
  const score = useSelector(selectScore);
  const questions = QUESTIONS.filter((q) => q.level === quiz.level);

  // 1) Level picker
  if (!quiz.level) {
    return (
      <div className="page container" data-testid="quiz-page">
        <div className="page-head"><span className="eyebrow">Quiz</span><h1 style={{ marginTop: 16 }}>Test what you know</h1><p>Pick a level. Each quiz has {QUESTIONS.filter((q) => q.level === "beginner").length} multiple-choice questions with an explanation after every answer.</p></div>
        <div className="grid-3">
          {LEVEL_LIST.map((lv) => {
            const r = quiz.results[lv];
            return (
              <div key={lv} className="panel">
                <h3 style={{ textTransform: "capitalize" }}>{lv}</h3>
                <p className="muted-note">{r ? `Last score: ${r.score} / ${r.total}` : "Not attempted yet"}</p>
                <button className="btn btn-primary btn-sm" data-testid={`start-${lv}`} onClick={() => { dispatch(startQuiz(lv)); dispatch(setLevel(lv)); }}>Start {lv} quiz</button>
              </div>
            );
          })}
        </div>
      </div>
    );
  }

  // 3) Results
  if (quiz.finished) {
    return (
      <div className="page container" data-testid="quiz-results">
        <div className="page-head"><span className="eyebrow">Results</span>
          <h1 style={{ marginTop: 16 }}>You scored {score} out of {questions.length}</h1>
          <p>{score === questions.length ? "Perfect score." : score >= questions.length / 2 ? "Good work. Review the explanations below to close the gaps." : "Keep going. Read each explanation, then retake the quiz."}</p></div>
        <div className="guide-list">
          {questions.map((q) => {
            const a = quiz.answers[q.id];
            return (
              <div key={q.id} className="panel">
                <strong>{q.question}</strong>
                <p>Your answer: {a ? q.options[a.choice] : "Not answered"} {a?.correct ? "(correct)" : `(correct answer: ${q.options[q.answer]})`}</p>
                <p className="muted-note">{q.explanation}</p>
              </div>
            );
          })}
        </div>
        <div className="hero-cta" style={{ marginTop: 24 }}>
          <button className="btn btn-primary" data-testid="retake" onClick={() => dispatch(startQuiz(quiz.level))}>Retake quiz</button>
          <button className="btn btn-ghost" onClick={() => dispatch(resetQuiz())}>Choose another level</button>
        </div>
      </div>
    );
  }

  // 2) Question screen (one at a time)
  const q = questions[quiz.index];
  const answered = quiz.answers[q.id];
  const last = quiz.index === questions.length - 1;
  const choose = (i) => {
    if (answered) return;
    dispatch(answerQuestion({ id: q.id, choice: i, correct: i === q.answer }));
  };
  const done = Object.keys(quiz.answers).length;

  return (
    <div className="page container" data-testid="quiz-page">
      <div className="page-head">
        <span className="eyebrow">{quiz.level} quiz</span>
        <div className="bar" role="progressbar" aria-valuenow={done} aria-valuemax={questions.length} aria-label="Quiz progress"><div style={{ width: `${(done / questions.length) * 100}%` }} /></div>
        <p className="muted-note">Question {quiz.index + 1} of {questions.length}. {done} answered.</p>
        <h2>{q.question}</h2>
      </div>
      <div className="opts" role="radiogroup" aria-label="Answer choices">
        {q.options.map((o, i) => {
          const state = !answered ? "" : i === q.answer ? "right" : i === answered.choice ? "wrong" : "";
          return <button key={i} role="radio" aria-checked={answered?.choice === i} className={`opt ${state}`} onClick={() => choose(i)} disabled={!!answered && !state} data-testid={`option-${i}`}>{o}</button>;
        })}
      </div>
      {answered && <p className={`feedback ${answered.correct ? "ok" : "bad"}`} data-testid="feedback"><strong>{answered.correct ? "Correct." : "Not quite."}</strong> {q.explanation}</p>}
      <div className="hero-cta" style={{ marginTop: 20 }}>
        <button className="btn btn-ghost btn-sm" disabled={quiz.index === 0} onClick={() => dispatch(goToQuestion(quiz.index - 1))}>Previous</button>
        {!last
          ? <button className="btn btn-primary btn-sm" disabled={!answered} onClick={() => dispatch(goToQuestion(quiz.index + 1))} data-testid="next">Next</button>
          : <button className="btn btn-primary btn-sm" disabled={done < questions.length} data-testid="finish" onClick={() => { dispatch(finishQuiz()); toast.success("Quiz complete"); }}>See results</button>}
        <button className="btn btn-ghost btn-sm" onClick={() => dispatch(resetQuiz())}>Quit</button>
      </div>
    </div>
  );
}
