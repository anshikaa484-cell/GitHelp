import { useMemo, useState } from "react";
import { AlertTriangle, SearchX, Search } from "lucide-react";
import { GUIDES, GUIDE_CATEGORIES } from "@/data/troubleshootingGuides";
import CopyButton from "@/components/CopyButton";

export default function Troubleshooter() {
  const [q, setQ] = useState("");
  const [cat, setCat] = useState("All");

  const shown = useMemo(() => {
    const s = q.toLowerCase().trim();
    return GUIDES.filter((g) => (cat === "All" || g.category === cat) &&
      (!s || `${g.title} ${g.problem} ${g.cause}`.toLowerCase().includes(s)));
  }, [q, cat]);

  return (
    <div className="page container" data-testid="troubleshooter-page">
      <div className="page-head">
        <span className="eyebrow">Troubleshooter</span>
        <h1 style={{ marginTop: 16 }}>Fix common Git problems</h1>
        <p>Find your problem, understand the cause, then follow the steps. Pasting an exact error message? Try the <a href="/errors" style={{ textDecoration: "underline" }}>Error Finder</a>.</p>
      </div>

      <div className="search-wrap">
        <Search size={18} />
        <input className="field-input" value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search, e.g. rejected, conflict, detached" aria-label="Search guides" />
      </div>
      <div className="chips">
        {GUIDE_CATEGORIES.map((c) => <button key={c} className={`chip ${cat === c ? "active" : ""}`} onClick={() => setCat(c)}>{c}</button>)}
      </div>
      {(q || cat !== "All") && <button className="btn btn-ghost btn-sm" onClick={() => { setQ(""); setCat("All"); }}>Clear filters</button>}

      {shown.length === 0 ? (
        <div className="state"><div className="state-icon"><SearchX size={28} /></div><h3>No guides match</h3><p>Try a shorter keyword or clear the filters.</p></div>
      ) : (
        <div className="guide-list">
          {shown.map((g) => (
            <article key={g.id} className="panel" data-testid={`guide-${g.id}`}>
              <span className="cmd-cat">{g.category}</span>
              <h3>{g.title}</h3>
              <p><strong>Problem:</strong> {g.problem}</p>
              <p><strong>Common cause:</strong> {g.cause}</p>
              <ol className="steps">
                {g.steps.map((s, i) => (
                  <li key={i} className={s.danger ? "danger" : ""}>
                    {s.danger && <div className="warn"><AlertTriangle size={14} /> Destructive command. Read this before you run it.</div>}
                    <span>{s.text}</span>
                    {s.cmd && <div className="cmd-code"><code style={{ whiteSpace: "pre-wrap" }}>{s.cmd}</code><CopyButton text={s.cmd} /></div>}
                  </li>
                ))}
              </ol>
              <p className="muted-note"><strong>Prevention:</strong> {g.prevention}</p>
            </article>
          ))}
        </div>
      )}
    </div>
  );
}
