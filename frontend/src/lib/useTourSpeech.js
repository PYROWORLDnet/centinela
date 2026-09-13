import { useCallback, useEffect, useRef, useState } from "react";

const VOICE_KEY = "centinela-tts-voice";
const DEFAULT_VOICE = "nova";
const ALLOWED_VOICES = new Set(["nova", "alloy"]);

const FALLBACK_VOICES = [
  { id: "nova", label: "Nova · clara" },
  { id: "alloy", label: "Alloy · neutra" },
];

function readStoredVoice() {
  try {
    const stored = localStorage.getItem(VOICE_KEY);
    if (stored && ALLOWED_VOICES.has(stored)) return stored;
    return DEFAULT_VOICE;
  } catch {
    return DEFAULT_VOICE;
  }
}

function stopBrowserSpeech() {
  if (typeof window === "undefined" || !window.speechSynthesis) return;
  window.speechSynthesis.cancel();
}

/**
 * Lectura por voz del tour — OpenAI TTS (prefetch + cache + autoavance).
 */
export function useTourSpeech(text, { autoKey, prefetchText, done = false, onAdvance } = {}) {
  const [speaking, setSpeaking] = useState(false);
  const [supported, setSupported] = useState(true);
  const [voices, setVoices] = useState(FALLBACK_VOICES);
  const [voiceId, setVoiceIdState] = useState(DEFAULT_VOICE);
  const [loading, setLoading] = useState(false);
  const [provider, setProvider] = useState("openai");

  const textRef = useRef(text);
  const continueRef = useRef(false);
  const autoplayRef = useRef(false);
  const speakingRef = useRef(false);
  const audioRef = useRef(null);
  const cacheRef = useRef(new Map()); // key → objectUrl
  const inflightRef = useRef(new Map()); // key → Promise<objectUrl>
  const playAbortRef = useRef(null);
  const voiceIdRef = useRef(DEFAULT_VOICE);
  const prefetchGen = useRef(0);
  const doneRef = useRef(done);
  const onAdvanceRef = useRef(onAdvance);

  textRef.current = text;
  speakingRef.current = speaking;
  voiceIdRef.current = voiceId;
  doneRef.current = done;
  onAdvanceRef.current = onAdvance;

  useEffect(() => {
    setVoiceIdState(readStoredVoice());
    let cancelled = false;
    fetch("/api/tts/voices")
      .then((r) => r.json())
      .then((data) => {
        if (cancelled) return;
        if (data?.voices?.length) setVoices(data.voices);
        setProvider(data?.configured ? "openai" : "browser");
        setSupported(true);
      })
      .catch(() => {
        if (!cancelled) {
          setProvider("browser");
          setSupported(typeof window !== "undefined" && "speechSynthesis" in window);
        }
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const stopPlayback = useCallback(() => {
    playAbortRef.current?.abort();
    playAbortRef.current = null;
    if (audioRef.current) {
      audioRef.current.onended = null;
      audioRef.current.onerror = null;
      audioRef.current.onplay = null;
      audioRef.current.pause();
      audioRef.current.src = "";
      audioRef.current = null;
    }
    stopBrowserSpeech();
  }, []);

  const ensureObjectUrl = useCallback(async (payload, voice) => {
    const cacheKey = `${voice}::${payload}`;
    const cached = cacheRef.current.get(cacheKey);
    if (cached) return cached;

    const inflight = inflightRef.current.get(cacheKey);
    if (inflight) return inflight;

    const promise = (async () => {
      const res = await fetch("/api/tts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: payload, voice }),
      });
      if (!res.ok) throw new Error(`TTS ${res.status}`);
      const blob = await res.blob();
      const objectUrl = URL.createObjectURL(blob);
      cacheRef.current.set(cacheKey, objectUrl);
      inflightRef.current.delete(cacheKey);
      return objectUrl;
    })().catch((err) => {
      inflightRef.current.delete(cacheKey);
      throw err;
    });

    inflightRef.current.set(cacheKey, promise);
    return promise;
  }, []);

  const finishOrAdvance = useCallback(() => {
    speakingRef.current = false;
    setSpeaking(false);
    if (!autoplayRef.current) return;
    if (doneRef.current) {
      autoplayRef.current = false;
      return;
    }
    continueRef.current = true;
    onAdvanceRef.current?.();
  }, []);

  // Prefetch paso actual
  useEffect(() => {
    const payload = String(text || "").trim();
    if (!payload) return undefined;
    const voice = voiceIdRef.current;
    const gen = ++prefetchGen.current;
    ensureObjectUrl(payload, voice).catch(() => {
      /* prefetch fallido: speak hará fallback */
    });
    return () => {
      void gen;
    };
  }, [text, voiceId, autoKey, ensureObjectUrl]);

  // Prefetch siguiente paso mientras suena el actual
  useEffect(() => {
    const payload = String(prefetchText || "").trim();
    if (!payload) return;
    ensureObjectUrl(payload, voiceIdRef.current).catch(() => {});
  }, [prefetchText, voiceId, ensureObjectUrl]);

  const setVoiceId = useCallback(
    (id) => {
      const next = id || DEFAULT_VOICE;
      setVoiceIdState(next);
      voiceIdRef.current = next;
      try {
        localStorage.setItem(VOICE_KEY, next);
      } catch {
        /* ignore */
      }
      autoplayRef.current = false;
      continueRef.current = false;
      stopPlayback();
      speakingRef.current = false;
      setSpeaking(false);
      setLoading(false);
    },
    [stopPlayback],
  );

  const speakBrowser = useCallback(() => {
    if (typeof window === "undefined" || !("speechSynthesis" in window)) return;
    const payload = textRef.current?.trim();
    if (!payload) return;
    stopBrowserSpeech();
    const u = new SpeechSynthesisUtterance(payload);
    u.rate = 1.05;
    u.lang = "es-MX";
    u.onstart = () => {
      speakingRef.current = true;
      setSpeaking(true);
      setLoading(false);
    };
    u.onend = () => {
      finishOrAdvance();
    };
    u.onerror = () => {
      speakingRef.current = false;
      setSpeaking(false);
      setLoading(false);
      autoplayRef.current = false;
    };
    window.speechSynthesis.speak(u);
  }, [finishOrAdvance]);

  const speak = useCallback(async () => {
    const payload = textRef.current?.trim();
    if (!payload) return;

    autoplayRef.current = true;
    stopPlayback();
    setLoading(true);
    const ctrl = new AbortController();
    playAbortRef.current = ctrl;

    try {
      const objectUrl = await ensureObjectUrl(payload, voiceIdRef.current);
      if (ctrl.signal.aborted) return;

      const audio = new Audio(objectUrl);
      audioRef.current = audio;
      audio.preload = "auto";
      audio.onplay = () => {
        speakingRef.current = true;
        setSpeaking(true);
        setLoading(false);
      };
      audio.onended = () => {
        finishOrAdvance();
      };
      audio.onerror = () => {
        speakingRef.current = false;
        setSpeaking(false);
        setLoading(false);
        speakBrowser();
      };
      await audio.play();
    } catch (err) {
      if (err?.name === "AbortError" || ctrl.signal.aborted) return;
      setLoading(false);
      speakBrowser();
    }
  }, [ensureObjectUrl, finishOrAdvance, speakBrowser, stopPlayback]);

  const stop = useCallback(() => {
    autoplayRef.current = false;
    continueRef.current = false;
    stopPlayback();
    speakingRef.current = false;
    setSpeaking(false);
    setLoading(false);
  }, [stopPlayback]);

  useEffect(() => {
    const shouldContinue = continueRef.current || speakingRef.current;
    stopPlayback();
    speakingRef.current = false;
    setSpeaking(false);
    setLoading(false);
    if (!shouldContinue) return undefined;
    continueRef.current = false;
    const t = window.setTimeout(() => speak(), 40);
    return () => window.clearTimeout(t);
  }, [autoKey, speak, stopPlayback]);

  useEffect(() => () => stopPlayback(), [stopPlayback]);

  const toggle = useCallback(() => {
    if (speakingRef.current || loading) stop();
    else speak();
  }, [speak, stop, loading]);

  const markContinue = useCallback(() => {
    if (speakingRef.current || loading || autoplayRef.current) continueRef.current = true;
  }, [loading]);

  return {
    speaking,
    loading,
    supported,
    provider,
    voices,
    voiceId,
    setVoiceId,
    toggle,
    stop,
    speak,
    markContinue,
  };
}

export function stepSpeechText(step, epilogue, { done = false } = {}) {
  if (done && epilogue) return epilogue;
  if (!step) return "";
  return [step.line, step.detail].filter(Boolean).join(". ");
}
