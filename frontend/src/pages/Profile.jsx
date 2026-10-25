import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { toast } from "sonner";
import { useTheme } from "@/context/ThemeContext";
import { usePreferences } from "@/context/PreferencesContext";
import { selectLevel, selectProgress, setLevel, resetProgress } from "@/features/learning/learningSlice";
import { selectBookmarks } from "@/features/bookmarks/bookmarksSlice";
import { LEVEL_LIST } from "@/data/quizQuestions";

export default function Profile() {
  const dispatch = useDispatch();
  const { theme, toggleTheme } = useTheme();
  const { displayName, setDisplayName } = usePreferences();
  const level = useSelector(selectLevel);
  const progress = useSelector(selectProgress);
  const saved = useSelector(selectBookmarks);

  return (
    <div className="page container" data-testid="profile-page">
      <div className="page-head"><span className="eyebrow">Profile</span><h1 style={{ marginTop: 16 }}>Preferences</h1>
        <p>This is a local demo profile. There is no account or sign-in, and nothing leaves your browser.</p></div>
      <div className="panel form-grid">
        <div><label htmlFor="name" className="field-label">Display name</label>
          <input id="name" className="field-input" maxLength={30} value={displayName} onChange={(e) => setDisplayName(e.target.value)} placeholder="e.g. Anshika" /></div>
        <div><label htmlFor="level" className="field-label">Learning level</label>
          <select id="level" className="field-input" value={level} onChange={(e) => dispatch(setLevel(e.target.value))}>
            {LEVEL_LIST.map((l) => <option key={l} value={l}>{l}</option>)}</select></div>
        <div><span className="field-label">Theme</span><button className="btn btn-ghost btn-sm" onClick={toggleTheme}>Currently {theme}. Switch</button></div>
        <div><span className="field-label">Progress</span><p style={{ margin: 0 }}>{progress.done} of {progress.total} lessons. {saved.length} saved commands.</p>
          <Link to="/dashboard" className="btn btn-ghost btn-sm">Dashboard</Link> <Link to="/bookmarks" className="btn btn-ghost btn-sm">Saved</Link>
          <button className="btn btn-ghost btn-sm" onClick={() => { dispatch(resetProgress()); toast("Lesson progress reset"); }}>Reset lessons</button></div>
      </div>
    </div>
  );
}
