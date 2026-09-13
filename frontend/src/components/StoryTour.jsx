import { useTourSpeech, stepSpeechText } from "../lib/useTourSpeech";

/**
 * Carril narrativo del recorrido curado.
 * Lectura por voz OpenAI + selector de voz.
 */
export default function StoryTour({
  tour,
  stepIndex,
  done,
  onPrev,
  onNext,
  onSkip,
  onRestart,
  onExplore,
}) {
  if (!tour) return null;

  const total = tour.steps?.length || 0;
  const step = tour.steps?.[stepIndex];
  const isLast = stepIndex >= total - 1;
  const speechKey = done ? "epilogue" : `step-${step?.id ?? stepIndex}`;
  const speechText = stepSpeechText(step, tour.epilogue, { done });

  return (
    <StoryTourInner
      tour={tour}
      step={step}
      stepIndex={stepIndex}
      total={total}
      isLast={isLast}
      done={done}
      speechKey={speechKey}
      speechText={speechText}
      onPrev={onPrev}
      onNext={onNext}
      onSkip={onSkip}
      onRestart={onRestart}
      onExplore={onExplore}
    />
  );
}

function StoryTourInner({
  tour,
  step,
  stepIndex,
  total,
  isLast,
  done,
  speechKey,
  speechText,
  onPrev,
  onNext,
  onSkip,
  onRestart,
  onExplore,
}) {
  const {
    speaking,
    loading,
    supported,
    voices,
    voiceId,
    setVoiceId,
    toggle,
    stop,
    markContinue,
  } = useTourSpeech(speechText, { autoKey: speechKey });

  function handleNext() {
    markContinue();
    onNext();
  }

  function handlePrev() {
    markContinue();
    onPrev();
  }

  function handleSkip() {
    stop();
    onSkip();
  }

  function handleExplore() {
    stop();
    onExplore();
  }

  function handleRestart() {
    stop();
    onRestart();
  }

  function handleVoiceChange(e) {
    stop();
    setVoiceId(e.target.value);
  }

  const voiceControls = supported && (
    <div className="story__voice">
      <SpeakButton speaking={speaking} loading={loading} onClick={toggle} label="Escuchar este paso" />
      <label className="story__voice-label">
        <span className="sr-only">Voz</span>
        <select
          className="story__voice-select"
          value={voiceId}
          onChange={handleVoiceChange}
          aria-label="Elegir voz"
          title="Elegir voz"
        >
          {voices.map((v) => (
            <option key={v.id} value={v.id}>
              {v.label}
            </option>
          ))}
        </select>
      </label>
    </div>
  );

  if (done) {
    return (
      <div className="story" role="region" aria-label="Cierre del recorrido">
        <div className="story__top">
          <p className="story__eyebrow">Fin del recorrido</p>
          {voiceControls}
        </div>
        <p className="story__line story__line--epilogue">{tour.epilogue}</p>
        <div className="story__actions">
          <button type="button" className="story__btn story__btn--ghost" onClick={handleRestart}>
            Ver otra vez
          </button>
          <button type="button" className="story__btn story__btn--primary" onClick={handleExplore}>
            Explorar el mapa
          </button>
        </div>
      </div>
    );
  }

  if (!step) return null;

  return (
    <div className="story" role="region" aria-label={tour.title || "Recorrido"}>
      <div className="story__top">
        <p className="story__eyebrow">
          Paso {stepIndex + 1} de {total}
        </p>
        <div className="story__top-right">
          {voiceControls}
          <button type="button" className="story__skip" onClick={handleSkip}>
            Explorar libre
          </button>
        </div>
      </div>
      <div className="story__copy" key={step.id}>
        <div className="story__title-row">
          <p className="story__line">{step.line}</p>
        </div>
        {step.detail && <p className="story__detail">{step.detail}</p>}
      </div>
      <div className="story__actions">
        <button
          type="button"
          className="story__btn story__btn--ghost"
          onClick={handlePrev}
          disabled={stepIndex <= 0}
        >
          Atrás
        </button>
        <div className="story__dots" aria-hidden>
          {tour.steps.map((s, i) => (
            <span
              key={s.id}
              className={i === stepIndex ? "is-on" : i < stepIndex ? "is-done" : undefined}
            />
          ))}
        </div>
        <button type="button" className="story__btn story__btn--primary" onClick={handleNext}>
          {isLast ? "Entender el cierre" : "Siguiente"}
        </button>
      </div>
    </div>
  );
}

function SpeakButton({ speaking, loading, onClick, label }) {
  return (
    <button
      type="button"
      className={`story__speak${speaking || loading ? " is-speaking" : ""}`}
      onClick={onClick}
      aria-label={label}
      aria-pressed={speaking}
      title={label}
      disabled={loading}
    >
      {loading ? (
        <span className="story__speak-dot" aria-hidden />
      ) : speaking ? (
        <svg viewBox="0 0 24 24" width="16" height="16" aria-hidden>
          <rect x="6" y="5" width="4" height="14" rx="1" fill="currentColor" />
          <rect x="14" y="5" width="4" height="14" rx="1" fill="currentColor" />
        </svg>
      ) : (
        <svg viewBox="0 0 24 24" width="16" height="16" aria-hidden>
          <path d="M4 9v6h3.5L12 19V5L7.5 9H4z" fill="currentColor" />
          <path
            d="M15.5 8.5a4 4 0 0 1 0 7M18 6a7 7 0 0 1 0 12"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.6"
            strokeLinecap="round"
          />
        </svg>
      )}
    </button>
  );
}
