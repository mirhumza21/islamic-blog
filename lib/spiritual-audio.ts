let activeAudio: HTMLAudioElement | null = null;
let activeUtterance: SpeechSynthesisUtterance | null = null;
let resumeTimer: ReturnType<typeof setInterval> | null = null;
let currentId: string | null = null;
let currentOnEnd: (() => void) | null = null;

function clearResumeTimer() {
  if (resumeTimer) {
    clearInterval(resumeTimer);
    resumeTimer = null;
  }
}

function finish() {
  const onEnd = currentOnEnd;
  currentId = null;
  currentOnEnd = null;
  onEnd?.();
}

export function stopSpiritualAudio() {
  clearResumeTimer();
  if (activeAudio) {
    activeAudio.pause();
    activeAudio.src = "";
    activeAudio = null;
  }
  if (typeof window !== "undefined" && "speechSynthesis" in window) {
    window.speechSynthesis.cancel();
  }
  activeUtterance = null;
  if (currentId) finish();
}

function loadVoices(): Promise<SpeechSynthesisVoice[]> {
  if (typeof window === "undefined" || !("speechSynthesis" in window)) {
    return Promise.resolve([]);
  }

  const existing = window.speechSynthesis.getVoices();
  if (existing.length > 0) return Promise.resolve(existing);

  return new Promise((resolve) => {
    const done = () => resolve(window.speechSynthesis.getVoices());
    window.speechSynthesis.addEventListener("voiceschanged", done, { once: true });
    window.setTimeout(done, 400);
  });
}

function pickArabicVoice(voices: SpeechSynthesisVoice[]) {
  const arabic = voices.filter((voice) => {
    const lang = voice.lang.toLowerCase();
    const name = voice.name.toLowerCase();
    if (lang.startsWith("en") || /\benglish\b/.test(name)) return false;
    return lang.startsWith("ar") || /\barabic\b/.test(name);
  });
  return (
    arabic.find((voice) => /saudi|naayf|maged|arabia/i.test(`${voice.lang} ${voice.name}`)) ||
    arabic[0] ||
    null
  );
}

function speakArabicWithVoice(text: string, voice: SpeechSynthesisVoice) {
  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = voice.lang || "ar-SA";
  utterance.rate = 0.85;
  utterance.voice = voice;
  utterance.onend = () => {
    clearResumeTimer();
    activeUtterance = null;
    finish();
  };
  utterance.onerror = () => {
    clearResumeTimer();
    activeUtterance = null;
    finish();
  };
  activeUtterance = utterance;

  window.setTimeout(() => {
    window.speechSynthesis.resume();
    window.speechSynthesis.speak(utterance);
    clearResumeTimer();
    resumeTimer = setInterval(() => {
      if (!window.speechSynthesis.speaking) {
        clearResumeTimer();
        return;
      }
      if (window.speechSynthesis.paused) window.speechSynthesis.resume();
    }, 200);
  }, 60);
}

async function speakArabic(arabic: string) {
  if (!("speechSynthesis" in window)) return false;
  const voices = await loadVoices();
  const arabicVoice = pickArabicVoice(voices);
  if (!arabicVoice) return false;
  speakArabicWithVoice(arabic, arabicVoice);
  return true;
}

export async function playSpiritualAudio({
  id,
  arabic,
  audioUrl,
  onStart,
  onEnd,
}: {
  id: string;
  arabic: string;
  transliteration?: string;
  audioUrl?: string;
  onStart?: () => void;
  onEnd?: () => void;
}) {
  if (typeof window === "undefined") return;

  if (currentId === id) {
    stopSpiritualAudio();
    return;
  }

  stopSpiritualAudio();
  currentId = id;
  currentOnEnd = onEnd ?? null;
  onStart?.();

  if (audioUrl) {
    const audio = new Audio(audioUrl);
    activeAudio = audio;
    audio.onended = () => {
      activeAudio = null;
      finish();
    };
    audio.onerror = async () => {
      activeAudio = null;
      const started = await speakArabic(arabic);
      if (!started) finish();
    };
    try {
      await audio.play();
      return;
    } catch {
      activeAudio = null;
    }
  }

  const started = await speakArabic(arabic);
  if (!started) finish();
}
