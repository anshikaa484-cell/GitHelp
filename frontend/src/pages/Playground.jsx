import { useState, useRef } from "react";
import { RotateCcw, Eraser, Play } from "lucide-react";
import { createRepo, runCommand, EXAMPLES } from "@/utils/gitSimulator";

// LOCAL STATE: the terminal belongs to this page only, so useState is enough.
export default function Playground() {
  const [repo, setRepo] = useState(createRepo);
  const [lines, setLines] = useState([]); // [{ cmd, out }]
  const [input, setInput] = useState("");
  const [recall, setRecall] = useState(-1);
  const termRef = useRef(null);
  const inputRef = useRef(null);

  const run = (text) => {
    const cmd = text.trim();
    if (!cmd) return;
    setInput("");
    setRecall(-1);
    if (cmd === "clear") { setLines([]); return; }
    const result = runCommand(repo, cmd);
    const prompt = `~/project${repo.initialized ? ` (${repo.branch})` : ""} $`; // prompt as it was BEFORE the command
    setRepo(result.repo);
    setLines((l) => [...l, { cmd, prompt, out: result.output || "(done. No output means the command succeeded.)" }]);
    // keep the newest line visible inside the terminal box only (does not scroll the page)
    setTimeout(() => { if (termRef.current) termRef.current.scrollTop = termRef.current.scrollHeight; inputRef.current?.focus(); }, 0);
  };

  const onKeyDown = (e) => {
    const past = lines.map((l) => l.cmd);
    if (e.key === "ArrowUp" && past.length) {
      e.preventDefault();
      const i = recall === -1 ? past.length - 1 : Math.max(0, recall - 1);
      setRecall(i); setInput(past[i]);
    }
    if (e.key === "ArrowDown" && recall !== -1) {
      e.preventDefault();
      const i = recall + 1;
      if (i >= past.length) { setRecall(-1); setInput(""); } else { setRecall(i); setInput(past[i]); }
    }
  };

  return (
    <div className="page container" data-testid="playground-page">
      <div className="page-head">
        <span className="eyebrow">Playground</span>
        <h1 style={{ marginTop: 16 }}>Practise Git safely</h1>
        <p>This is a simulator. It does not run real Git, touch your files, or connect to GitHub. It only imitates a few commands so you can see what they do.</p>
      </div>

      <div className="chips" aria-label="Example commands">
        {EXAMPLES.map((ex) => <button key={ex} className="chip" onClick={() => run(ex)}>{ex}</button>)}
      </div>

      <div className="term" role="log" aria-live="polite" data-testid="terminal" ref={termRef}>
        {lines.length === 0 && <div className="term-hint">Type a command below, or press an example. Start with <code>git init</code>.</div>}
        {lines.map((l, i) => (
          <div key={i}>
            <div><span className="term-prompt">{l.prompt}</span> {l.cmd}</div>
            {l.out && <pre className="term-out">{l.out}</pre>}
          </div>
        ))}
      </div>

      <form className="term-form" onSubmit={(e) => { e.preventDefault(); run(input); }}>
        <label htmlFor="term-input" className="sr-only">Git command</label>
        <input id="term-input" ref={inputRef} className="field-input mono" value={input} onChange={(e) => setInput(e.target.value)} onKeyDown={onKeyDown}
          placeholder='git status' autoComplete="off" spellCheck="false" data-testid="terminal-input" />
        <button className="btn btn-primary btn-sm" type="submit"><Play size={14} /> Run</button>
        <button className="btn btn-ghost btn-sm" type="button" onClick={() => setLines([])}><Eraser size={14} /> Clear</button>
        <button className="btn btn-ghost btn-sm" type="button" onClick={() => { setRepo(createRepo()); setLines([]); }} data-testid="reset-sim"><RotateCcw size={14} /> Reset</button>
      </form>
      <p className="muted-note">Supported: init, status, add, commit -m, log, branch, switch, checkout. Use the up arrow to repeat earlier commands.</p>
    </div>
  );
}
