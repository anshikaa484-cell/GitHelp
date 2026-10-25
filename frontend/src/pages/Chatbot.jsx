import React, { useState, useRef, useEffect } from "react";
import { Volume2, VolumeX } from "lucide-react";
import ChatWindow from "@/components/ChatWindow";
import useChatbotMatch from "@/hooks/useChatbotMatch";
import useSpeechSynthesis from "@/hooks/useSpeechSynthesis";
import { FAQS } from "@/data/gitData";

const SUGGESTIONS = [
  "How do I clone a repository?",
  "Undo my last commit",
  "Create a new branch",
  "Push my code to GitHub",
];

let msgId = 0;

export const Chatbot = () => {
  const match = useChatbotMatch(FAQS);
  const idRef = useRef(0);
  const { isSupported: ttsSupported, speaking, speak, cancel } = useSpeechSynthesis();

  const [readAloud, setReadAloud] = useState(false);
  const [messages, setMessages] = useState([
    {
      id: ++msgId,
      role: "bot",
      text: "Hi! I'm your Git assistant. Ask me a common Git question — like how to clone a repo, create a branch, or undo a commit.",
    },
  ]);
  const [input, setInput] = useState("");

  const pushMessage = (role, text) => {
    idRef.current += 1;
    setMessages((m) => [...m, { id: `${role}-${idRef.current}-${Date.now()}`, role, text }]);
  };

  const handleSend = (rawText) => {
    const text = (rawText ?? input).trim();
    if (!text) return;
    pushMessage("user", text);
    setInput("");
    // rule-based match (no AI)
    const result = match(text);
    setTimeout(() => {
      pushMessage("bot", result.answer);
      if (readAloud && ttsSupported) speak(result.answer);
    }, 350);
  };

  // If user turns read-aloud off, stop any in-progress speech immediately.
  useEffect(() => {
    if (!readAloud) cancel();
  }, [readAloud, cancel]);

  const toggleReadAloud = () => setReadAloud((v) => !v);

  return (
    <div className="page container" data-testid="chatbot-page">
      <div className="page-head">
        <span className="eyebrow">Git Chatbot</span>
        <h1 style={{ marginTop: 16 }}>Ask a quick Git question</h1>
        <p>
          A simple rule-based assistant (no AI) that matches your question to
          common Git answers using keyword matching.
        </p>
      </div>

      <div className="chat-layout">
        <ChatWindow
          messages={messages}
          input={input}
          onInputChange={setInput}
          onSend={() => handleSend()}
          suggestions={messages.length <= 1 ? SUGGESTIONS : []}
          onSuggestion={(s) => handleSend(s)}
          headerAction={
            ttsSupported && (
              <button
                type="button"
                onClick={toggleReadAloud}
                className={`tts-toggle ${readAloud ? "on" : ""} ${speaking ? "speaking" : ""}`}
                data-testid="tts-toggle"
                aria-pressed={readAloud}
                title={readAloud ? "Mute read-aloud" : "Read answers aloud"}
              >
                {readAloud ? <Volume2 size={16} /> : <VolumeX size={16} />}
                <span>{readAloud ? "Read aloud" : "Muted"}</span>
              </button>
            )
          }
          onSpeakMessage={(text) => speak(text)}
          canSpeak={ttsSupported}
        />

        <aside className="side-panel" data-testid="chat-side-panel">
          <h4>Try asking about…</h4>
          <p className="hint">
            Tap a topic to autofill the chat. The assistant works fully offline
            on local FAQ data.
          </p>
          {SUGGESTIONS.map((s) => (
            <div
              key={s}
              className="history-item"
              style={{ cursor: "pointer" }}
              onClick={() => handleSend(s)}
              data-testid={`side-suggestion-${s.slice(0, 10).replace(/\s+/g, "-")}`}
            >
              <span>{s}</span>
            </div>
          ))}
        </aside>
      </div>
    </div>
  );
};

export default Chatbot;
