import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { BookmarkX, Trash2 } from "lucide-react";
import { selectBookmarks, removeBookmark, clearBookmarks } from "@/features/bookmarks/bookmarksSlice";
import CopyButton from "@/components/CopyButton";

export default function Bookmarks() {
  const items = useSelector(selectBookmarks);
  const dispatch = useDispatch();
  return (
    <div className="page container" data-testid="bookmarks-page">
      <div className="page-head"><span className="eyebrow">Saved commands</span><h1 style={{ marginTop: 16 }}>Your bookmarks</h1><p>Saved in this browser only.</p></div>
      {items.length === 0 ? (
        <div className="state" data-testid="bookmarks-empty"><div className="state-icon"><BookmarkX size={28} /></div><h3>Nothing saved yet</h3><p>Press Save on any command to keep it here.</p><Link to="/commands" className="btn btn-primary btn-sm">Browse commands</Link></div>
      ) : (
        <>
          <div className="guide-list">
            {items.map((b) => (
              <div key={b.command} className="panel row">
                <div><strong>{b.title}</strong><div className="cmd-code"><code style={{ whiteSpace: "pre-wrap" }}>{b.command}</code><CopyButton text={b.command} /></div></div>
                <button className="btn btn-ghost btn-sm" onClick={() => dispatch(removeBookmark(b.command))} aria-label={`Remove ${b.command}`}><Trash2 size={14} /> Remove</button>
              </div>
            ))}
          </div>
          <button className="btn btn-ghost btn-sm" style={{ marginTop: 16 }} onClick={() => dispatch(clearBookmarks())}>Remove all</button>
        </>
      )}
    </div>
  );
}
