import React, { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { AlertOctagon, Wand2, Copy, Check, Lightbulb, ShieldQuestion } from "lucide-react";
import { toast } from "sonner";
import VoiceButton from "@/components/VoiceButton";
import useErrorMatch from "@/hooks/useErrorMatch";
import { GIT_ERRORS } from "@/data/gitErrors";

const EXAMPLES = [
  "fatal: not a git repository",
  "Updates were rejected because the tip of your current branch is behind",
  "error: Your local changes would be overwritten by checkout",
  "Please tell me who you are",
];

function FixBlock({ fix }) {
  const [copied, setCopied] = useState(false);
  const text = fix.filter((l) => !l.trim().startsWith("#")).join("\n");
  const copy = async () => {
    try {
      await navigator.clipboard.writeText(text);
    } catch (err) {
      console.error("Clipboard write failed:", err);
    }
    setCopied(true);
    toast.success("Fix copied", {
      description: text.split("\n")[0].slice(0, 80),
    });
    setTimeout(() => setCopied(false), 1500);
  };
  return (
    <div className="fix-block">
      <div className="fix-head">
        <span className="fix-label">
          <Lightbulb size={15} /> The fix
        </span>
        <button className="copy-btn light" onClick={copy} data-testid="copy-fix" aria-label="Copy fix">
          {copied ? <Check size={15} /> : <Copy size={15} />}
        </button>
      </div>
      <pre className="fix-code">
        {fix.map((line, i) => (
          <div key={`${line}-${i}`} className={line.trim().startsWith("#") ? "fix-comment" : "fix-cmd"}>
            {line}
          </div>
        ))}
      </pre>
    </div>
  );
}

export const ErrorFinder = () => {
  const diagnose = useErrorMatch(GIT_ERRORS);
  const [input, setInput] = useState("");
  const [results, setResults] = useState(null);
  const areaRef = useRef(null);

  const runDiagnose = (text) => {
    const value = (text ?? input).trim();
    if (!value) return;
    setResults(diagnose(value));
  };

  return (
    <div className="page container" data-testid="error-finder-page">
      <div className="page-head">
        <span className="eyebrow">
          <AlertOctagon size={14} /> Git Error Finder
        </span>
        <h1 style={{ marginTop: 16 }}>Paste a Git error, get the fix</h1>
        <p>
          Stuck on a scary red error message? Paste it below and GitHelp will
          explain what it means and how to fix it — all offline, no AI.
        </p>
      </div>

      <div className="error-input-card">
        <textarea
          ref={areaRef}
          className="error-textarea"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="e.g. fatal: not a git repository (or any Git terminal error)…"
          rows={4}
          data-testid="error-input"
        />
        <div className="error-actions">
          <VoiceButton
            onTranscript={(t) => setInput((prev) => (prev ? prev + " " + t : t))}
            title="Dictate the error"
          />
          <button
            className="btn btn-accent"
            onClick={() => runDiagnose()}
            data-testid="diagnose-btn"
          >
            <Wand2 size={17} /> Diagnose error
          </button>
        </div>
        <div className="chips" style={{ marginTop: 16 }}>
          {EXAMPLES.map((ex) => (
            <button
              key={ex}
              className="chip"
              onClick={() => {
                setInput(ex);
                runDiagnose(ex);
              }}
              data-testid={`error-example-${ex.slice(0, 8).replace(/\s+/g, "-")}`}
            >
              {ex.length > 42 ? ex.slice(0, 42) + "…" : ex}
            </button>
          ))}
        </div>
      </div>

      <AnimatePresence mode="wait">
        {results !== null && (
          <motion.div
            key={results.length}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.35 }}
            style={{ marginTop: 30 }}
            data-testid="error-results"
          >
            {results.length === 0 ? (
              <div className="state" data-testid="error-no-match">
                <div className="state-icon">
                  <ShieldQuestion size={28} />
                </div>
                <h3>No known match</h3>
                <p>
                  I couldn't match that to a common error. Try pasting the exact
                  line that starts with <code>fatal:</code> or <code>error:</code>.
                </p>
              </div>
            ) : (
              <div className="error-results-list">
                <h3 style={{ marginBottom: 18 }}>
                  {results.length} likely match{results.length !== 1 ? "es" : ""}
                </h3>
                {results.map((err, i) => (
                  <motion.article
                    key={err.id}
                    className="error-card"
                    initial={{ opacity: 0, y: 14 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.08 }}
                    data-testid={`error-card-${err.id}`}
                  >
                    <div className="error-card-top">
                      <span className="error-badge">{err.severity}</span>
                      {i === 0 && <span className="best-match">Best match</span>}
                    </div>
                    <h4 className="error-title">
                      <code>{err.title}</code>
                    </h4>
                    <p className="error-cause">
                      <strong>Why it happens: </strong>
                      {err.cause}
                    </p>
                    <FixBlock fix={err.fix} />
                  </motion.article>
                ))}
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ErrorFinder;
