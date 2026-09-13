/**
 * OpenAI TTS para el recorrido curado.
 * Calidad por defecto (gpt-4o-mini-tts). Cache + prefetch en el cliente.
 */

export const TTS_VOICES = [
  { id: "nova", label: "Nova · clara" },
  { id: "alloy", label: "Alloy · grave" },
];

/** Algunas voces arrastran más; compensamos con speed. Rango API: 0.25–4.0 */
const VOICE_SPEED = {
  nova: 1.0,
  alloy: 1.05,
};

const VOICE_INSTRUCTIONS = {
  nova:
    "Habla en español dominicano, voz femenina clara y cercana, como narradora de documental. Ritmo natural de conversación. Tono serio pero cálido. No dramatizes.",
  alloy:
    "Habla en español dominicano, voz más grave y neutra (casi masculina), firme y documental. Ritmo calmado. Sin teatralidad ni tono infantil.",
};

/** gpt-4o-mini-tts = más natural; tts-1 = más rápido pero menos calidad */
const DEFAULT_MODEL = process.env.OPENAI_TTS_MODEL || "gpt-4o-mini-tts";

/** @type {Map<string, Buffer>} */
const audioCache = new Map();
const CACHE_MAX = 80;

export function listTtsVoices() {
  return {
    provider: "openai",
    configured: Boolean(process.env.OPENAI_API_KEY),
    defaultVoice: "nova",
    model: DEFAULT_MODEL,
    voices: TTS_VOICES,
  };
}

function cacheKey(model, voice, speed, text) {
  return `${model}|${voice}|${speed}|${text}`;
}

function remember(key, buf) {
  if (audioCache.size >= CACHE_MAX) {
    const first = audioCache.keys().next().value;
    audioCache.delete(first);
  }
  audioCache.set(key, buf);
}

/**
 * @param {string} text
 * @param {string} voice
 * @returns {Promise<Buffer>}
 */
export async function synthesizeSpeech(text, voice = "nova") {
  const key = process.env.OPENAI_API_KEY;
  if (!key) {
    const err = new Error("OPENAI_API_KEY no configurada");
    err.status = 503;
    throw err;
  }

  const input = String(text || "").trim().slice(0, 4096);
  if (!input) {
    const err = new Error("Texto vacío");
    err.status = 400;
    throw err;
  }

  const allowed = new Set(TTS_VOICES.map((v) => v.id));
  const voiceId = allowed.has(voice) ? voice : "nova";
  const model = DEFAULT_MODEL;
  const speed = VOICE_SPEED[voiceId] ?? 1.0;
  const ck = cacheKey(model, voiceId, speed, input);

  const hit = audioCache.get(ck);
  if (hit) return hit;

  const body = {
    model,
    voice: voiceId,
    input,
    response_format: "mp3",
    speed,
  };
  // Instrucciones de estilo por voz (solo modelo natural)
  if (model.includes("gpt-4o")) {
    body.instructions = VOICE_INSTRUCTIONS[voiceId] || VOICE_INSTRUCTIONS.nova;
  }

  const res = await fetch("https://api.openai.com/v1/audio/speech", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${key}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });

  if (!res.ok) {
    const detail = await res.text().catch(() => "");
    const err = new Error(`OpenAI TTS ${res.status}: ${detail.slice(0, 200)}`);
    err.status = res.status;
    throw err;
  }

  const buf = Buffer.from(await res.arrayBuffer());
  remember(ck, buf);
  return buf;
}
