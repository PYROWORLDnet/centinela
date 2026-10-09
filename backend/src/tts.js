/**
 * Voz del recorrido curado: ElevenLabs (acento dominicano) + OpenAI TTS.
 * Cache en memoria + disco temporal; el cliente hace prefetch.
 */
import { createHash } from "node:crypto";
import { mkdirSync, readFileSync, writeFileSync, existsSync } from "node:fs";
import { tmpdir } from "node:os";
import path from "node:path";
import { THEMES } from "./data/curated/themes.js";
import { getCuratedTour } from "./data/curated/index.js";
import { episodeTexts } from "./data/episodes/index.js";

/** Voces de la biblioteca compartida de ElevenLabs etiquetadas con acento dominicano. */
const ELEVEN_VOICES = [
  { id: "el-mayra", elId: "matPJjeuu5MgFjRpMGfZ", label: "Mayra · cálida", gender: "female" },
  { id: "el-diana", elId: "IeiHyO4UwOOUdKQ0HSDK", label: "Diana · joven, expresiva", gender: "female" },
  { id: "el-angelina", elId: "NNLcf0MlUZirnZQqeMJ8", label: "Angelina · clara", gender: "female" },
  { id: "el-crystal", elId: "dfbit8KZwSN0OJGuj7pq", label: "Crystal · narradora", gender: "female" },
  { id: "el-amara", elId: "Y6B7kfk4Eyet3NowpN3g", label: "Amara · suave", gender: "female" },
  { id: "el-lina", elId: "oWjuL7HSoaEJRMDMP3HD", label: "Lina · cercana", gender: "female" },
  { id: "el-chaer", elId: "6yJbRCDgjQDmHJ6NrRYG", label: "Chaer · locutor grave", gender: "male" },
  { id: "el-tony", elId: "2vyVHGyPYK7eCnfdVvk9", label: "Tony Vásquez · reflexivo", gender: "male" },
  { id: "el-makemcie", elId: "awOajHsqRllBLH3sYn6Z", label: "Makemcie · documental", gender: "male" },
  { id: "el-luis", elId: "fokPj1J1ZT7E7ul4hoLS", label: "Luis Féliz · narrador", gender: "male" },
  { id: "el-matias", elId: "IoWn77TsmQnza94sYlfg", label: "Matías · relajado", gender: "male" },
  { id: "el-wanaby", elId: "CCXmXKZExbF90N5aaPWM", label: "Wanaby · joven, redes", gender: "male" },
  { id: "el-anderson", elId: "tpbS1suUR3ke5cIZG2E3", label: "Anderson · carismático", gender: "male" },
  { id: "el-michael", elId: "1cbIUZoxnknSRNz8qJ6d", label: "Michael · conversado", gender: "male" },
];

/** El recorrido de la web usa una sola voz: la narradora de los episodios. */
const NARRATOR_ELEVEN = "el-mayra";
const NARRATOR_OPENAI = "nova";

/** gpt-4o-mini-tts = más natural; tts-1 = más rápido pero menos calidad */
const OPENAI_MODEL = process.env.OPENAI_TTS_MODEL || "gpt-4o-mini-tts";
/** Escuchar en vivo prioriza latencia; el modo película prioriza expresión. */
const ELEVEN_MODEL_LIVE = process.env.ELEVENLABS_MODEL || "eleven_multilingual_v2";
const ELEVEN_MODEL_FILM = process.env.ELEVENLABS_FILM_MODEL || "eleven_v3";

/** Frases fijas del modo película que no salen de los recorridos. */
export const FILM_LINES = {
  outro: "Esto es Centinela. Míralo tú mismo. Comparte esto con alguien que necesite despertar.",
};

/** Tras un fallo de ElevenLabs (sin crédito, caído) se usa OpenAI sin reintentar cada frase. */
const ELEVEN_COOLDOWN_MS = 10 * 60 * 1000;
let elevenDownUntil = 0;

const elevenKey = () => process.env.ELEVENLABS_API_KEY || "";
const openaiKey = () => process.env.OPENAI_API_KEY || "";

export function listTtsVoices() {
  const eleven = Boolean(elevenKey());
  const openai = Boolean(openaiKey());
  const provider = eleven ? "elevenlabs" : openai ? "openai" : "browser";
  const voice = { id: eleven ? NARRATOR_ELEVEN : NARRATOR_OPENAI, label: "Narradora", gender: "female" };
  const voices = eleven || openai ? [voice] : [];
  return {
    provider,
    configured: eleven || openai,
    defaultVoice: voice.id,
    groups: voices.length ? [{ provider, label: "Narradora", voices }] : [],
    voices,
  };
}

/* ---------- cache ---------- */

/** @type {Map<string, {audio: Buffer, words: Array|null}>} */
const memCache = new Map();
const MEM_MAX = 120;
const DISK_DIR = path.join(tmpdir(), "centinela-tts");

function cacheKey(parts) {
  return createHash("sha1").update(parts.join("|")).digest("hex");
}

function readCache(key) {
  const hit = memCache.get(key);
  if (hit) return hit;
  try {
    const file = path.join(DISK_DIR, `${key}.json`);
    if (!existsSync(file)) return null;
    const raw = JSON.parse(readFileSync(file, "utf8"));
    const entry = { audio: Buffer.from(raw.audio, "base64"), words: raw.words || null };
    remember(key, entry, { disk: false });
    return entry;
  } catch {
    return null;
  }
}

function remember(key, entry, { disk = true } = {}) {
  if (memCache.size >= MEM_MAX) memCache.delete(memCache.keys().next().value);
  memCache.set(key, entry);
  if (!disk) return;
  try {
    mkdirSync(DISK_DIR, { recursive: true });
    writeFileSync(
      path.join(DISK_DIR, `${key}.json`),
      JSON.stringify({ audio: entry.audio.toString("base64"), words: entry.words }),
    );
  } catch {
    /* disco de solo lectura: basta la memoria */
  }
}

/* ---------- corpus permitido para ElevenLabs ---------- */

const squash = (s) =>
  String(s || "")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9ñ]+/g, "");

let corpusCache = null;

/**
 * ElevenLabs cobra por carácter: solo narra texto que sale de los recorridos
 * curados (o de FILM_LINES), para que el endpoint no sea un TTS gratis abierto.
 */
function corpus() {
  if (corpusCache) return corpusCache;
  const pieces = [];
  for (const t of THEMES) {
    const tour = getCuratedTour(t.id);
    if (!tour) continue;
    pieces.push(tour.title, tour.epilogue);
    for (const s of tour.steps || []) pieces.push(s.line, s.detail);
  }
  pieces.push(...Object.values(FILM_LINES), ...episodeTexts());
  corpusCache = pieces.map(squash).filter(Boolean);
  return corpusCache;
}

function isCuratedText(text) {
  const parts = String(text)
    .split(/(?<=[.!?…])\s+/)
    .map(squash)
    .filter((p) => p.length > 0);
  if (!parts.length) return false;
  const all = corpus();
  return parts.every((p) => all.some((c) => c.includes(p)));
}

/* ---------- providers ---------- */

function alignmentToWords(alignment) {
  const chars = alignment?.characters;
  const starts = alignment?.character_start_times_seconds;
  const ends = alignment?.character_end_times_seconds;
  if (!chars?.length || !starts || !ends) return null;
  const words = [];
  let cur = null;
  let inTag = false;
  for (let i = 0; i < chars.length; i += 1) {
    const ch = chars[i];
    // Etiquetas de actuación de eleven_v3 ([sighs], [laughs]…): no son palabras habladas.
    if (ch === "[") inTag = true;
    if (inTag) {
      if (ch === "]") inTag = false;
      continue;
    }
    if (/\s/.test(ch)) {
      if (cur) words.push(cur);
      cur = null;
      continue;
    }
    if (!cur) cur = { w: "", start: starts[i], end: ends[i] };
    cur.w += ch;
    cur.end = ends[i];
  }
  if (cur) words.push(cur);
  return words;
}

async function elevenSpeech(voice, input, { film }) {
  const model = film ? ELEVEN_MODEL_FILM : ELEVEN_MODEL_LIVE;
  const text = input.slice(0, model === "eleven_v3" ? 3000 : 5000);
  const key = cacheKey(["el", model, voice.elId, text]);
  const hit = readCache(key);
  if (hit) return hit;

  const voice_settings =
    model === "eleven_v3"
      ? { stability: 0.5, similarity_boost: 0.8 }
      : { stability: 0.45, similarity_boost: 0.8, style: 0.2, use_speaker_boost: true };

  const res = await fetch(
    `https://api.elevenlabs.io/v1/text-to-speech/${voice.elId}/with-timestamps?output_format=mp3_44100_128`,
    {
      method: "POST",
      headers: { "xi-api-key": elevenKey(), "Content-Type": "application/json" },
      body: JSON.stringify({ text, model_id: model, language_code: "es", voice_settings }),
    },
  );
  if (!res.ok) {
    const detail = await res.text().catch(() => "");
    const err = new Error(`ElevenLabs ${res.status}: ${detail.slice(0, 200)}`);
    err.status = res.status === 401 || res.status === 429 ? 503 : 502;
    throw err;
  }
  const data = await res.json();
  const entry = {
    audio: Buffer.from(data.audio_base64 || "", "base64"),
    words: alignmentToWords(data.alignment),
  };
  remember(key, entry);
  return entry;
}

async function openaiSpeech(voiceId, input) {
  const text = input.slice(0, 4096);
  const speed = 1.0;
  const key = cacheKey(["oa", OPENAI_MODEL, voiceId, String(speed), text]);
  const hit = readCache(key);
  if (hit) return hit;

  const body = { model: OPENAI_MODEL, voice: voiceId, input: text, response_format: "mp3", speed };
  if (OPENAI_MODEL.includes("gpt-4o")) {
    body.instructions =
      "Habla en español dominicano, clara y con ritmo natural de conversación, como una narradora de documental. Tono serio pero cercano. No alentes ni dramatizes.";
  }

  const res = await fetch("https://api.openai.com/v1/audio/speech", {
    method: "POST",
    headers: { Authorization: `Bearer ${openaiKey()}`, "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  if (!res.ok) {
    const detail = await res.text().catch(() => "");
    const err = new Error(`OpenAI TTS ${res.status}: ${detail.slice(0, 200)}`);
    err.status = res.status;
    throw err;
  }
  const entry = { audio: Buffer.from(await res.arrayBuffer()), words: null };
  remember(key, entry);
  return entry;
}

/**
 * @param {string} text
 * @param {string} voice  id de listTtsVoices()
 * @param {{ film?: boolean }} [opts]
 * @returns {Promise<{audio: Buffer, words: Array<{w:string,start:number,end:number}>|null}>}
 */
export async function synthesizeSpeech(text, voice = "", { film = false } = {}) {
  const input = String(text || "").trim();
  if (!input) {
    const err = new Error("Texto vacío");
    err.status = 400;
    throw err;
  }

  const el = ELEVEN_VOICES.find((v) => v.id === voice);
  if (el && elevenKey()) {
    if (!isCuratedText(input)) {
      const err = new Error("Solo se narra texto de los recorridos de Centinela");
      err.status = 400;
      throw err;
    }
    // El modo película necesita los tiempos por palabra de ElevenLabs: sin respaldo.
    if (film) return elevenSpeech(el, input, { film });
    if (Date.now() >= elevenDownUntil) {
      try {
        return await elevenSpeech(el, input, { film });
      } catch (err) {
        if (!openaiKey()) throw err;
        elevenDownUntil = Date.now() + ELEVEN_COOLDOWN_MS;
        console.warn(`[tts] ElevenLabs falló, usando OpenAI por un rato: ${err.message}`);
      }
    }
  }

  if (!openaiKey()) {
    const err = new Error("Ninguna voz configurada (ELEVENLABS_API_KEY / OPENAI_API_KEY)");
    err.status = 503;
    throw err;
  }
  return openaiSpeech(NARRATOR_OPENAI, input);
}
