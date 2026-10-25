import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { LESSONS } from "@/data/lessons";
import { usePreferences } from "@/context/PreferencesContext";
import { selectLevel, selectCompleted, selectProgress, toggleLesson } from "@/features/learning/learningSlice";
import { selectBookmarks } from "@/features/bookmarks/bookmarksSlice";
import { selectQuiz } from "@/features/quiz/quizSlice";

export default function Dashboard() {
  const dispatch = useDispatch();
  const { displayName } = usePreferences(); // Context
  const level = useSelector(selectLevel); // Redux below
  const completed = useSelector(selectCompleted);
  const progress = useSelector(selectProgress);
  const saved = useSelector(selectBookmarks);
  const { results } = useSelector(selectQuiz);
  const next = LESSONS.find((l) => !completed.includes(l.id));
  const attempts = Object.entries(results);

  return (
    <div className="page container" data-testid="dashboard-page">
      <div className="page-head"><span className="eyebrow">Dashboard</span><h1 style={{ marginTop: 16 }}>Welcome{displayName ? `, ${displayName}` : ""}</h1><p>Your progress is stored in this browser. Current level: <strong style={{ textTransform: "capitalize" }}>{level}</strong>.</p></div>

      <div className="grid-3">
        <div className="panel"><h3>Learning progress</h3><div className="bar" role="progressbar" aria-valuenow={progress.percent} aria-valuemax={100} aria-label="Learning progress"><div style={{ width: `${progress.percent}%` }} /></div><p className="muted-note" data-testid="progress-text">{progress.done} of {progress.total} lessons complete ({progress.percent}%)</p></div>
        <div className="panel"><h3>Quiz results</h3>{attempts.length === 0 ? <p className="muted-note">No quiz taken yet.</p> : attempts.map(([lv, r]) => <p key={lv} style={{ textTransform: "capitalize", margin: "4px 0" }}>{lv}: {r.score} / {r.total}</p>)}<Link to="/quiz" className="btn btn-ghost btn-sm">Go to quiz</Link></div>
        <div className="panel"><h3>Saved commands</h3><p style={{ fontSize: "2rem", margin: "4px 0" }} data-testid="saved-count">{saved.length}</p><Link to="/bookmarks" className="btn btn-ghost btn-sm">View saved</Link></div>
      </div>

      <div className="hero-cta" style={{ margin: "24px 0" }}>
        {next ? <Link to="/commands" className="btn btn-primary" data-testid="continue">Continue learning: {next.title}</Link> : <span className="feedback ok">All lessons complete.</span>}
        <Link to="/playground" className="btn btn-ghost">Open playground</Link>
        <Link to="/troubleshooter" className="btn btn-ghost">Troubleshooter</Link>
      </div>

      <h2>Lessons</h2>
      <div className="guide-list">
        {LESSONS.map((l) => (
          <label key={l.id} className="panel row lesson">
            <span><strong>{l.title}</strong> <span className="cmd-cat">{l.level}</span><br /><span className="muted-note">{l.summary}</span></span>
            <input type="checkbox" checked={completed.includes(l.id)} onChange={() => dispatch(toggleLesson(l.id))} aria-label={`Mark "${l.title}" complete`} />
          </label>
        ))}
      </div>
    </div>
  );
}
