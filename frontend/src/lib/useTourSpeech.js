import { useCallback, useEffect, useRef, useState } from "react";

function stopSpeaking() {
  if (typeof window === "undefined" || !window.speechSynthesis) return;
  window.speechSynthesis.cancel();
}

/** Voz fija: Paulina es-MX (con fallbacks). */
function pickPaulina(voices) {
  const list = voices || [];
  const paulinaMx = list.find(
    (v) => /paulina/i.test(v.name) && /^es(-|_)?mx/i.test(v.lang || ""),
  );
  if (paulinaMx) return paulinaMx;
  const paulina = list.find((v) => /paulina/i.test(v.name) && /^es/i.test(v.lang || ""));
  if (paulina) return paulina;
  const mx = list.find((v) => /^es(-|_)?mx/i.test(v.lang || ""));
  if (mx) return mx;
  return list.find((v) => /^es/i.test(v.lang || "")) || list[0] || null;
}

/**
 * Lectura por voz del tour (Web Speech API) — Paulina es-MX.
 */
export function useTourSpeech(text, { autoKey } = {}) {
  const [speaking, setSpeaking] = useState(false);
  const [supported, setSupported] = useState(true);
  const utteranceRef = useRef(null);
  const textRef = useRef(text);
  const continueRef = useRef(false);
  const speakingRef = useRef(false);
  textRef.current = text;
  speakingRef.current = speaking;

  useEffect(() => {
    setSupported(typeof window !== "undefined" && "speechSynthesis" in window);
  }, []);

  const speak = useCallback(() => {
    if (typeof window === "undefined" || !("speechSynthesis" in window)) return;
    const payload = textRef.current?.trim();
    if (!payload) return;
    stopSpeaking();

    const u = new SpeechSynthesisUtterance(payload);
    u.rate = 0.95;
    u.pitch = 1;

    const start = () => {
      const voice = pickPaulina(window.speechSynthesis.getVoices());
      if (voice) {
        u.voice = voice;
        u.lang = voice.lang || "es-MX";
      } else {
        u.lang = "es-MX";
      }
      utteranceRef.current = u;
      window.speechSynthesis.speak(u);
    };

    u.onstart = () => {
      speakingRef.current = true;
      setSpeaking(true);
    };
    u.onend = () => {
      speakingRef.current = false;
      setSpeaking(false);
      utteranceRef.current = null;
    };
    u.onerror = () => {
      speakingRef.current = false;
      setSpeaking(false);
      utteranceRef.current = null;
    };

    if (!window.speechSynthesis.getVoices().length) {
      const onVoices = () => {
        window.speechSynthesis.removeEventListener("voiceschanged", onVoices);
        start();
      };
      window.speechSynthesis.addEventListener("voiceschanged", onVoices);
      window.setTimeout(() => {
        if (!utteranceRef.current) start();
      }, 250);
      return;
    }
    start();
  }, []);

  const stop = useCallback(() => {
    continueRef.current = false;
    stopSpeaking();
    speakingRef.current = false;
    setSpeaking(false);
    utteranceRef.current = null;
  }, []);

  useEffect(() => {
    const shouldContinue = continueRef.current || speakingRef.current;
    stopSpeaking();
    speakingRef.current = false;
    setSpeaking(false);
    utteranceRef.current = null;
    if (!shouldContinue) return undefined;
    continueRef.current = false;
    const t = window.setTimeout(() => speak(), 60);
    return () => window.clearTimeout(t);
  }, [autoKey, speak]);

  useEffect(() => () => stopSpeaking(), []);

  const toggle = useCallback(() => {
    if (speakingRef.current) stop();
    else speak();
  }, [speak, stop]);

  const markContinue = useCallback(() => {
    if (speakingRef.current) continueRef.current = true;
  }, []);

  return { speaking, supported, toggle, stop, speak, markContinue };
}

export function stepSpeechText(step, epilogue, { done = false } = {}) {
  if (done && epilogue) return epilogue;
  if (!step) return "";
  return [step.line, step.detail].filter(Boolean).join(". ");
}
