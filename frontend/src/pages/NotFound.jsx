import React from "react";
import { Link } from "react-router-dom";
import { Home as HomeIcon, GitBranch } from "lucide-react";

export const NotFound = () => {
  return (
    <div className="container notfound" data-testid="notfound-page">
      <div className="big">404</div>
      <h2 style={{ marginBottom: 12 }}>This branch doesn't exist</h2>
      <p style={{ color: "var(--muted)", marginBottom: 28 }}>
        Looks like you took a wrong turn. Let's get you back on <code>main</code>.
      </p>
      <Link to="/" className="btn btn-primary" data-testid="notfound-home-btn">
        <HomeIcon size={18} /> Back to Home
      </Link>
    </div>
  );
};

export default NotFound;
