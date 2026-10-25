import React from "react";
import { Mic, MicOff } from "lucide-react";
import useSpeechRecognition from "../hooks/useSpeechRecognition";

// Reusable voice-input (voice memo) button. Dictates speech into text.
export const VoiceButton = ({ onTranscript, title = "Voice input", size = 18 }) => {
  const { supported, listening, toggle } = useSpeechRecognition({
    onResult: (text) => onTranscript?.(text),
  });

  if (!supported) return null;

  return (
    <button
      type="button"
      className={`voice-btn ${listening ? "listening" : ""}`}
      onClick={toggle}
      aria-label={title}
      aria-pressed={listening}
      title={listening ? "Listening… tap to stop" : title}
      data-testid="voice-button"
    >
      {listening ? <MicOff size={size} /> : <Mic size={size} />}
      {listening && <span className="voice-ring" />}
    </button>
  );
};

export default VoiceButton;
