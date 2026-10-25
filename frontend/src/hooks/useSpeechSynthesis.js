import { useCallback, useEffect, useRef, useState } from "react";

/**
 * Small wrapper over the browser SpeechSynthesis API for reading text out loud.
 * Degrades gracefully (isSupported=false) in environments without the API.
 */
const useSpeechSynthesis = () => {
  const synthRef = useRef(
    typeof window !== "undefined" ? window.speechSynthesis : null
  );
  const isSupported = !!synthRef.current;
  const [speaking, setSpeaking] = useState(false);

  const cancel = useCallback(() => {
    if (!isSupported) return;
    synthRef.current.cancel();
    setSpeaking(false);
  }, [isSupported]);

  const speak = useCallback(
    (text) => {
      if (!isSupported || !text) return;
      // Read code fences naturally: strip backticks so TTS reads the command text.
      const cleaned = String(text).replace(/`/g, "").replace(/\s+/g, " ").trim();
      if (!cleaned) return;
      synthRef.current.cancel();
      const u = new SpeechSynthesisUtterance(cleaned);
      u.rate = 1;
      u.pitch = 1;
      u.volume = 1;
      u.lang = "en-US";
      u.onstart = () => setSpeaking(true);
      u.onend = () => setSpeaking(false);
      u.onerror = () => setSpeaking(false);
      synthRef.current.speak(u);
    },
    [isSupported]
  );

  // Ensure any queued speech stops when the component unmounts.
  useEffect(() => {
    return () => {
      if (isSupported) synthRef.current.cancel();
    };
  }, [isSupported]);

  return { isSupported, speaking, speak, cancel };
};

export default useSpeechSynthesis;
