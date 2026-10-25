import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { COMMANDS } from "@/data/gitData";
import { GIT_ERRORS } from "@/data/gitErrors";
import {
  ArrowRight,
  BookOpen,
  MessageCircleQuestion,
  AlertOctagon,
  Sparkles,
  Zap,
  Terminal,
  Mic,
} from "lucide-react";

const modules = [
  {
    icon: <BookOpen size={24} />,
    iconClass: "icon-blue",
    title: "Git Command Explorer",
    desc: "A searchable, categorized reference of Git commands explained in plain English — with common-mistake callouts and voice search.",
    to: "/commands",
    cta: "Explore commands",
  },
  {
    icon: <AlertOctagon size={24} />,
    iconClass: "icon-red",
    title: "Git Error Finder",
    desc: "Paste any scary red Git error message and instantly get what it means and the exact commands to fix it.",
    to: "/errors",
    cta: "Diagnose an error",
  },
  {
    icon: <MessageCircleQuestion size={24} />,
    iconClass: "icon-orange",
    title: "Git Chatbot Assistant",
    desc: "Type or speak common Git questions and get instant, relevant answers from a simple rule-based assistant.",
    to: "/chatbot",
    cta: "Ask a question",
  },
];

const steps = [
  { n: "01", t: "Search", d: "Look up any Git command by keyword, category, or voice." },
  { n: "02", t: "Understand", d: "Read a plain-English explanation and example." },
  { n: "03", t: "Act", d: "Copy the ready-to-use command straight to your terminal." },
  { n: "04", t: "Ask", d: "Stuck on an error? Diagnose it or ask the chatbot." },
];

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  show: (i = 0) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.09, duration: 0.5, ease: [0.2, 0.8, 0.2, 1] },
  }),
};

export const Home = () => {
  return (
    <div data-testid="home-page">
      {/* Hero */}
      <section className="hero">
        <div className="hero-bg" aria-hidden="true">
          <span className="orb orb-1" />
          <span className="orb orb-2" />
          <span className="orb orb-3" />
          <span className="grid-lines" />
        </div>
        <div className="container hero-grid">
          <div>
            <motion.span
              className="eyebrow"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <Sparkles size={14} /> Learn Git the friendly way
            </motion.span>
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.08, duration: 0.6 }}
            >
              Git made simple. <span className="accent">Confidence built step by step.</span>
            </motion.h1>
            <motion.p
              className="hero-sub"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.18, duration: 0.6 }}
            >
              Learn Git commands, decode confusing errors, and get answers to
              common Git questions — all in one place, with voice input built in.
            </motion.p>
            <motion.div
              className="hero-cta"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.28, duration: 0.6 }}
            >
              <Link to="/dashboard" className="btn btn-primary" data-testid="hero-cta-start">
                Start Learning <ArrowRight size={18} />
              </Link>
              <Link to="/commands" className="btn btn-ghost" data-testid="hero-cta-commands">
                Explore Commands <ArrowRight size={18} />
              </Link>
            </motion.div>
            <motion.div
              className="hero-stats"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4, duration: 0.6 }}
            >
              <div className="hero-stat">
                <div className="num">{COMMANDS.length}</div>
                <div className="lbl">Commands explained</div>
              </div>
              <div className="hero-stat">
                <div className="num">{GIT_ERRORS.length}</div>
                <div className="lbl">Errors decoded</div>
              </div>
              <div className="hero-stat">
                <div className="num">
                  <Mic size={20} style={{ verticalAlign: "-3px" }} /> Voice
                </div>
                <div className="lbl">Search &amp; ask hands-free</div>
              </div>
            </motion.div>
          </div>

          {/* Floating animated 3D terminal */}
          <motion.div
            className="scene"
            initial={{ opacity: 0, scale: 0.9, rotateY: -20 }}
            animate={{ opacity: 1, scale: 1, rotateY: 0 }}
            transition={{ delay: 0.2, duration: 0.8, ease: [0.2, 0.8, 0.2, 1] }}
          >
            <div className="terminal" data-testid="hero-terminal">
              <div className="terminal-bar">
                <span className="dot r" />
                <span className="dot y" />
                <span className="dot g" />
                <span className="terminal-title">~/my-project — git</span>
              </div>
              <div className="terminal-body">
                <TypingLines />
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Modules */}
      <section className="section" style={{ paddingTop: 40 }}>
        <div className="container">
          <span className="eyebrow">
            <Zap size={14} /> What's inside
          </span>
          <h2 className="section-title">Everything a beginner needs</h2>
          <p className="section-sub" style={{ marginBottom: 40 }}>
            Three focused tools that replace a dozen open browser tabs.
          </p>
          <div className="module-grid">
            {modules.map((m, i) => (
              <motion.div
                className="module-card"
                key={m.title}
                data-testid={`module-${m.to.slice(1)}`}
                variants={fadeUp}
                initial="hidden"
                whileInView="show"
                viewport={{ once: true, amount: 0.3 }}
                custom={i}
              >
                <div className={`module-icon ${m.iconClass}`}>{m.icon}</div>
                <h3>{m.title}</h3>
                <p>{m.desc}</p>
                <Link to={m.to} className="module-link">
                  {m.cta} <ArrowRight size={16} />
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="section" style={{ paddingTop: 0 }}>
        <div className="container">
          <span className="eyebrow">
            <Terminal size={14} /> How it works
          </span>
          <h2 className="section-title">Search → Understand → Act → Ask</h2>
          <div className="steps" style={{ marginTop: 32 }}>
            {steps.map((s, i) => (
              <motion.div
                className="step"
                key={s.n}
                variants={fadeUp}
                initial="hidden"
                whileInView="show"
                viewport={{ once: true, amount: 0.4 }}
                custom={i}
              >
                <span className="step-num">{s.n}</span>
                <h4>{s.t}</h4>
                <p>{s.d}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

// Animated typing terminal (video-like looping animation, CSS + framer).
const LINES = [
  { p: "$", c: "git clone", a: " github.com/you/app" },
  { p: "", o: "Cloning into 'app'... done." },
  { p: "$", c: "git checkout -b feature" },
  { p: "", o: "Switched to a new branch 'feature'" },
  { p: "$", c: "git commit -m", a: ' "ship it"' },
];

function TypingLines() {
  return (
    <>
      {LINES.map((l, i) => (
        <motion.div
          key={`${l.p || ""}-${l.c || ""}-${l.o || ""}-${i}`}
          className="term-line"
          initial={{ opacity: 0, x: -8 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.5 + i * 0.55, duration: 0.4 }}
        >
          {l.p && <span className="term-prompt">{l.p} </span>}
          {l.c && <span className="term-cmd">{l.c}</span>}
          {l.a && <span className="term-accent">{l.a}</span>}
          {l.o && <span className="term-out">{l.o}</span>}
        </motion.div>
      ))}
      <motion.div
        className="term-line"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 + LINES.length * 0.55 }}
      >
        <span className="term-prompt">$ </span>
        <span className="cursor-blink" />
      </motion.div>
    </>
  );
}

export default Home;
