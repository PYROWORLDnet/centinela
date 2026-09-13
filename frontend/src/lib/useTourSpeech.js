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

/** Nova → voz española femenina; Alloy → masculina/grave (fallback del navegador). */
function pickBrowserVoice(preferredId) {
  if (typeof window === "undefined" || !window.speechSynthesis) return null;
  const list = window.speechSynthesis.getVoices?.() || [];
  if (!list.length) return null;

  const es = list.filter((v) => /^es([-_]|$)/i.test(v.lang || ""));
  const pool = es.length ? es : list;
  const label = (v) => `${v.name || ""} ${v.voiceURI || ""}`;

  const maleRe =
    /\b(male|hombre|juan|carlos|jorge|diego|antonio|miguel|pablo|daniel|eddie|reed|thomas|alex|enrique|fred|rishi|david|mark|james)\b|google uk english male|microsoft .+ male|english \(united (kingdom|states)\).*male/i;
  const femaleRe =
    /\b(female|femenin\w*|mujer|monica|mónica|paulina|lucia|lucía|maria|maría|carmen|elena|soledad|sabina|ines|inés|penelope|meadow|samantha|karen|moira|zira|victoria|fiona)\b|español.*femen|mexican.*femen|google uk english female|microsoft .+ female/i;

  if (preferredId === "alloy") {
    return (
      pool.find((v) => maleRe.test(label(v))) ||
      list.find((v) => maleRe.test(label(v))) ||
      pool.find((v) => !femaleRe.test(label(v))) ||
      list.find((v) => !femaleRe.test(label(v))) ||
      pool[pool.length - 1] ||
      null
    );
  }

  return (
    pool.find((v) => femaleRe.test(label(v))) ||
    pool.find((v) => /female|femen/i.test(v.name || "")) ||
    pool[0] ||
    null
  );
}

function waitForBrowserVoices() {
  return new Promise((resolve) => {
    if (typeof window === "undefined" || !window.speechSynthesis) {
      resolve([]);
      return;
    }
    const existing = window.speechSynthesis.getVoices();
    if (existing?.length) {
      resolve(existing);
      return;
    }
    const done = () => {
      window.speechSynthesis.removeEventListener("voiceschanged", done);
      resolve(window.speechSynthesis.getVoices() || []);
    };
    window.speechSynthesis.addEventListener("voiceschanged", done);
    // iOS a veces no dispara voiceschanged
    window.setTimeout(done, 250);
  });
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

  // Prefetch paso actual (solo con OpenAI; en browser evita 503 en móvil)
  useEffect(() => {
    if (provider === "browser") return undefined;
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
  }, [text, voiceId, autoKey, ensureObjectUrl, provider]);

  // Prefetch siguiente paso mientras suena el actual
  useEffect(() => {
    if (provider === "browser") return;
    const payload = String(prefetchText || "").trim();
    if (!payload) return;
    ensureObjectUrl(payload, voiceIdRef.current).catch(() => {});
  }, [prefetchText, voiceId, ensureObjectUrl, provider]);

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

  const speakBrowser = useCallback(async () => {
    if (typeof window === "undefined" || !("speechSynthesis" in window)) return;
    const payload = textRef.current?.trim();
    if (!payload) return;
    stopBrowserSpeech();
    await waitForBrowserVoices();
    const u = new SpeechSynthesisUtterance(payload);
    // Natural delivery — do not pitch/rate-hack; that sounded robotic vs OpenAI web TTS.
    u.rate = 1;
    u.pitch = 1;
    u.lang = "es-MX";
    const picked = pickBrowserVoice(voiceIdRef.current);
    if (picked) {
      u.voice = picked;
      if (picked.lang) u.lang = picked.lang;
    }
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

    // Sin OpenAI configurado: ir directo al fallback (evita 503 en móvil).
    if (provider === "browser") {
      if (ctrl.signal.aborted) return;
      await speakBrowser();
      return;
    }

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
      await speakBrowser();
    }
  }, [ensureObjectUrl, finishOrAdvance, provider, speakBrowser, stopPlayback]);

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
