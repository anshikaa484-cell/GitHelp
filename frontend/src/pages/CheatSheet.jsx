import React, { useMemo } from "react";
import { motion } from "framer-motion";
import { Printer, GitBranch, ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";
import { COMMANDS } from "@/data/gitData";

/**
 * A printable, one-page Git cheat sheet.
 * The `.cheat-*` classes are print-optimised via App.css @media print rules.
 */
export const CheatSheet = () => {
  const groups = useMemo(() => {
    const map = new Map();
    for (const c of COMMANDS) {
      if (!map.has(c.category)) map.set(c.category, []);
      map.get(c.category).push(c);
    }
    return Array.from(map.entries());
  }, []);

  return (
    <div className="page container" data-testid="cheatsheet-page">
      <div className="page-head cheat-head no-print">
        <span className="eyebrow">
          <GitBranch size={14} /> One-page reference
        </span>
        <h1 style={{ marginTop: 16 }}>Git Cheat Sheet</h1>
        <p>
          The essential Git commands, grouped by task. Optimised for print or
          save-as-PDF — great as a printed desk companion.
        </p>
        <div className="cheat-actions">
          <button
            className="btn btn-accent"
            onClick={() => window.print()}
            data-testid="print-cheatsheet"
          >
            <Printer size={17} /> Print / Save as PDF
          </button>
          <Link to="/commands" className="btn btn-ghost" data-testid="back-to-commands">
            <ArrowLeft size={16} /> Full explorer
          </Link>
        </div>
      </div>

      <motion.article
        className="cheat-sheet"
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35 }}
        data-testid="cheatsheet-doc"
      >
        <header className="cheat-doc-head">
          <div>
            <h2 className="cheat-title">
              Git<span>Help</span> · Cheat Sheet
            </h2>
            <p className="cheat-sub">
              Everyday Git commands, plain-English descriptions.
            </p>
          </div>
          <div className="cheat-brandmark">
            <GitBranch size={22} />
          </div>
        </header>

        <div className="cheat-grid">
          {groups.map(([cat, cmds]) => (
            <section key={cat} className="cheat-group" data-testid={`cheat-group-${cat.toLowerCase().replace(/\s+|&/g, "-")}`}>
              <h3 className="cheat-cat">{cat}</h3>
              <ul className="cheat-list">
                {cmds.map((c) => (
                  <li key={c.id} className="cheat-row">
                    <code className="cheat-cmd">{c.command}</code>
                    <span className="cheat-desc">{c.description}</span>
                  </li>
                ))}
              </ul>
            </section>
          ))}
        </div>

        <footer className="cheat-doc-foot">
          <span>GitHelp — Git, made simpler.</span>
          <span>{new Date().toLocaleDateString()}</span>
        </footer>
      </motion.article>
    </div>
  );
};

export default CheatSheet;
