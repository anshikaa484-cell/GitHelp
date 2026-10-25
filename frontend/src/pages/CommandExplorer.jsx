import React, { useState, useMemo } from "react";
import SearchBar from "@/components/SearchBar";
import CommandCard from "@/components/CommandCard";
import useDebounce from "@/hooks/useDebounce";
import { COMMANDS, CATEGORIES } from "@/data/gitData";
import { SearchX } from "lucide-react";

export const CommandExplorer = () => {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");
  const debouncedSearch = useDebounce(search, 250);

  // Static command list with search + category filter (useMemo for performance).
  const filtered = useMemo(() => {
    const q = debouncedSearch.toLowerCase().trim();
    return COMMANDS.filter((cmd) => {
      const inCategory = category === "All" || cmd.category === category;
      if (!inCategory) return false;
      if (!q) return true;
      return (
        cmd.command.toLowerCase().includes(q) ||
        cmd.title.toLowerCase().includes(q) ||
        cmd.description.toLowerCase().includes(q) ||
        cmd.tags.some((t) => t.toLowerCase().includes(q))
      );
    });
  }, [debouncedSearch, category]);

  return (
    <div className="page container" data-testid="command-explorer-page">
      <div className="page-head">
        <span className="eyebrow">Command Explorer</span>
        <h1 style={{ marginTop: 16 }}>Find the right Git command</h1>
        <p>
          Search by keyword or browse by category. Every command comes with a
          plain-English explanation and a common-mistake warning.
        </p>
      </div>

      <SearchBar
        value={search}
        onChange={setSearch}
        placeholder="Search commands, e.g. 'undo', 'branch', 'clone'…"
        voice
      />

      <div className="chips" data-testid="category-chips">
        {CATEGORIES.map((cat) => (
          <button
            key={cat}
            className={`chip ${category === cat ? "active" : ""}`}
            onClick={() => setCategory(cat)}
            data-testid={`category-${cat.toLowerCase().replace(/\s+|&/g, "-")}`}
          >
            {cat}
          </button>
        ))}
      </div>

      {(search || category !== "All") && (
        <button className="btn btn-ghost btn-sm" style={{ marginTop: 12 }} onClick={() => { setSearch(""); setCategory("All"); }} data-testid="clear-filters">
          Clear filters
        </button>
      )}

      <div style={{ marginTop: 18, color: "var(--muted)", fontSize: "0.9rem" }} data-testid="result-count">
        {filtered.length} command{filtered.length !== 1 ? "s" : ""}
        {category !== "All" ? ` in ${category}` : ""}
      </div>

      {filtered.length > 0 ? (
        <div className="cmd-grid" data-testid="command-grid">
          {filtered.map((cmd) => (
            <CommandCard key={cmd.id} cmd={cmd} />
          ))}
        </div>
      ) : (
        <div className="state" data-testid="no-results">
          <div className="state-icon">
            <SearchX size={28} />
          </div>
          <h3>No commands found</h3>
          <p>Try a different keyword or clear the filters.</p>
        </div>
      )}
    </div>
  );
};

export default CommandExplorer;
