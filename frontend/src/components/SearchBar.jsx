import React from "react";
import { Search, X } from "lucide-react";
import VoiceButton from "./VoiceButton";

// Controlled search input with optional voice (voice-memo) dictation.
export const SearchBar = ({ value, onChange, placeholder = "Search…", voice = false }) => {
  return (
    <div className="searchbar" data-testid="search-bar">
      <Search size={19} />
      <input
        type="text"
        value={value}
        placeholder={placeholder}
        onChange={(e) => onChange(e.target.value)}
        aria-label="Search"
        data-testid="search-input"
      />
      <div className="searchbar-actions">
        {value && (
          <button
            onClick={() => onChange("")}
            aria-label="Clear search"
            data-testid="search-clear"
            className="search-clear"
          >
            <X size={18} />
          </button>
        )}
        {voice && (
          <VoiceButton
            onTranscript={(t) => onChange(t)}
            title="Search by voice"
            size={17}
          />
        )}
      </div>
    </div>
  );
};

export default SearchBar;
