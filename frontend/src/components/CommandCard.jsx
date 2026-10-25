import React, { useState, useRef } from "react";
import { Copy, Check, AlertTriangle, Terminal, Bookmark, BookmarkCheck } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { addBookmark, removeBookmark, selectIsBookmarked } from "@/features/bookmarks/bookmarksSlice";
import { toast } from "sonner";

// Displays a single Git command with copy-to-clipboard (useState + useRef).
export const CommandCard = ({ cmd }) => {
  const [copied, setCopied] = useState(false);
  const timerRef = useRef(null);
  const dispatch = useDispatch();
  const saved = useSelector(selectIsBookmarked(cmd.command)); // Redux state

  const toggleBookmark = () => {
    if (saved) {
      dispatch(removeBookmark(cmd.command));
      toast("Removed from saved commands");
    } else {
      dispatch(addBookmark({ command: cmd.command, title: cmd.title, example: cmd.example }));
      toast.success("Saved to bookmarks");
    }
  };

  const handleCopy = async () => {
    const value = cmd.example || cmd.command;
    try {
      await navigator.clipboard.writeText(value);
    } catch (e) {
      // fallback for insecure contexts / older browsers
      const ta = document.createElement("textarea");
      ta.value = value;
      document.body.appendChild(ta);
      ta.select();
      document.execCommand("copy");
      document.body.removeChild(ta);
    }
    setCopied(true);
    toast.success("Command copied", {
      description: value.split("\n")[0],
    });
    clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => setCopied(false), 1600);
  };

  return (
    <div className="scene-card">
      <article className="cmd-card" data-testid={`command-card-${cmd.id}`}>
        <div className="cmd-top">
          <span className="cmd-cat">{cmd.category}</span>
        </div>
        <h3 className="cmd-title">{cmd.title}</h3>

        <div className="cmd-code">
          <code>{cmd.command}</code>
          <button
            className="copy-btn"
            onClick={handleCopy}
            aria-label="Copy command"
            data-testid={`copy-btn-${cmd.id}`}
            title="Copy example"
          >
            {copied ? <Check size={16} /> : <Copy size={16} />}
          </button>
        </div>

        <p className="cmd-desc">{cmd.description}</p>

        <div className="cmd-mistake">
          <AlertTriangle size={16} />
          <span>
            <strong>Common mistake: </strong>
            {cmd.common_mistake}
          </span>
        </div>

        <div className="cmd-actions">
          <span className="icon-btn" style={{ cursor: "default" }}>
            <Terminal size={15} /> {cmd.example.split("\n")[0]}
          </span>
          <button className={`icon-btn ${saved ? "on" : ""}`} onClick={toggleBookmark} aria-pressed={saved} data-testid={`bookmark-btn-${cmd.id}`}>
            {saved ? <BookmarkCheck size={15} /> : <Bookmark size={15} />} {saved ? "Saved" : "Save"}
          </button>
        </div>
      </article>
    </div>
  );
};

export default CommandCard;
