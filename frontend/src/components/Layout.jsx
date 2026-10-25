import { Outlet, Link, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import { GitBranch } from "lucide-react";
import Navbar from "@/components/Navbar";

// Shared layout: every page route is nested inside this one (navbar + footer once).
export default function Layout() {
  const { pathname } = useLocation();
  return (
    <>
      <Navbar />
      <motion.main key={pathname} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.2 }}>
        <Outlet />
      </motion.main>
      <footer className="footer container no-print" data-testid="footer">
        <span style={{ display: "flex", alignItems: "center", gap: 8 }}><GitBranch size={16} /> GitHelp: Git, made simpler.</span>
        <span className="footer-links">
          <Link to="/errors">Error Finder</Link>
          <Link to="/chatbot">Chatbot</Link>
          <Link to="/cheatsheet">Cheat Sheet</Link>
          <Link to="/bookmarks">Saved</Link>
          <Link to="/feedback">Feedback</Link>
        </span>
      </footer>
    </>
  );
}
