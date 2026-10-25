import { useState, useRef, useCallback, useEffect } from "react";

// Web Speech API wrapper (browser-native, no backend / no API key).
export function useSpeechRecognition({ onResult, lang = "en-US" } = {}) {
  const SpeechRecognition =
    typeof window !== "undefined" &&
    (window.SpeechRecognition || window.webkitSpeechRecognition);

  const supported = Boolean(SpeechRecognition);
  const [listening, setListening] = useState(false);
  const [interim, setInterim] = useState("");
  const recognitionRef = useRef(null);
  const onResultRef = useRef(onResult);

  useEffect(() => {
    onResultRef.current = onResult;
  }, [onResult]);

  const stop = useCallback(() => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
    }
    setListening(false);
  }, []);

  const start = useCallback(() => {
    if (!supported) return;
    const recognition = new SpeechRecognition();
    recognition.lang = lang;
    recognition.interimResults = true;
    recognition.continuous = false;
    recognition.maxAlternatives = 1;

    recognition.onstart = () => setListening(true);
    recognition.onerror = () => {
      setListening(false);
      setInterim("");
    };
    recognition.onend = () => {
      setListening(false);
      setInterim("");
    };
    recognition.onresult = (event) => {
      let finalText = "";
      let interimText = "";
      for (let i = event.resultIndex; i < event.results.length; i++) {
        const t = event.results[i][0].transcript;
        if (event.results[i].isFinal) finalText += t;
        else interimText += t;
      }
      setInterim(interimText);
      if (finalText && onResultRef.current) {
        onResultRef.current(finalText.trim());
      }
    };

    recognitionRef.current = recognition;
    try {
      recognition.start();
    } catch (e) {
      setListening(false);
    }
  }, [SpeechRecognition, supported, lang]);

  const toggle = useCallback(() => {
    if (listening) stop();
    else start();
  }, [listening, start, stop]);

  useEffect(() => () => stop(), [stop]);

  return { supported, listening, interim, start, stop, toggle };
}

export default useSpeechRecognition;
