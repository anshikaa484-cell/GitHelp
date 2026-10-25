import { useState } from "react";
import { NavLink } from "react-router-dom";
import { GitBranch, Menu, X, UserRound } from "lucide-react";
import ThemeToggle from "@/components/ThemeToggle";

const links = [
  { to: "/", label: "Home", end: true },
  { to: "/commands", label: "Commands" },
  { to: "/playground", label: "Playground" },
  { to: "/troubleshooter", label: "Troubleshooter" },
  { to: "/quiz", label: "Quiz" },
  { to: "/dashboard", label: "Dashboard" },
];

export const Navbar = () => {
  const [open, setOpen] = useState(false);
  const close = () => setOpen(false);

  return (
    <nav className="nav no-print" data-testid="navbar" aria-label="Main">
      <div className="container nav-inner">
        <NavLink to="/" className="brand" data-testid="brand-logo" onClick={close}>
          <span className="brand-mark"><GitBranch size={20} /></span>
          Git<span>Help</span>
        </NavLink>

        <button className="nav-toggle" aria-label="Toggle navigation" aria-expanded={open} data-testid="nav-toggle" onClick={() => setOpen((o) => !o)}>
          {open ? <X size={20} /> : <Menu size={20} />}
        </button>

        <div className={`nav-links ${open ? "open" : ""}`} data-testid="nav-links">
          {links.map((l) => (
            <NavLink key={l.to} to={l.to} end={l.end} onClick={close}
              className={({ isActive }) => `nav-link ${isActive ? "active" : ""}`}
              data-testid={`nav-link-${l.label.toLowerCase()}`}>
              {l.label}
            </NavLink>
          ))}
          <div className="nav-tools">
            <ThemeToggle />
            <NavLink to="/profile" className="icon-round" aria-label="Profile and preferences" onClick={close}><UserRound size={18} /></NavLink>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
