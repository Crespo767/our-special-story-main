import { useEffect, useMemo, useRef, useState } from "react";
import { ChevronLeft, ChevronRight, RotateCcw } from "lucide-react";

import avatarMain from "../../../Avatares/Avatar.png";
import avatarOne from "../../../Avatares/Avatar 1.png";
import avatarTwo from "../../../Avatares/Avatar 2.png";
import avatarThree from "../../../Avatares/Avatar 3.png";
import avatarFour from "../../../Avatares/Avatar 4.png";
import dogAvatar from "../../../Avatares/Cachorro sem fundo.png";
import soundtrack from "../../../Music/aerosmith_sem_27_segundos_iniciais.mp3";
import storyTextRaw from "../../../Texto/texto.txt?raw";

type Frame = {
  image: string;
  title: string;
  paragraphs: string[];
};

type ExperienceState = "intro" | "loading" | "story";

const avatarFrames = [avatarMain, avatarOne, avatarTwo, avatarThree, avatarFour];

function parseStoryBlocks(text: string): Frame[] {
  return text
    .split(/\n---\n/g)
    .map((block, index) => {
      const lines = block
        .trim()
        .split(/\r?\n/)
        .map((line) => line.trim())
        .filter(Boolean);
      const rawTitle = lines[0] ?? `Bloco ${index + 1}`;
      return {
        image: avatarFrames[index % avatarFrames.length],
        title: rawTitle.replace(/\*\*/g, ""),
        paragraphs: lines.slice(1),
      };
    })
    .filter((frame) => frame.paragraphs.length > 0);
}

export default function App() {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [activeFrame, setActiveFrame] = useState(0);
  const [experienceState, setExperienceState] = useState<ExperienceState>("intro");
  const frames = useMemo(() => parseStoryBlocks(storyTextRaw), []);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    audio.volume = 0.62;
  }, []);

  async function startExperience() {
    setActiveFrame(0);
    setExperienceState("loading");
    const audio = audioRef.current;
    if (audio) {
      try {
        audio.currentTime = 0;
        await audio.play();
      } catch {
        // The story still starts if the browser blocks audio for any reason.
      }
    }

    window.setTimeout(() => setExperienceState("story"), 3000);
  }

  function showPreviousFrame() {
    setActiveFrame((current) => Math.max(current - 1, 0));
  }

  function showNextFrame() {
    setActiveFrame((current) => Math.min(current + 1, frames.length - 1));
  }

  function returnToStart() {
    const audio = audioRef.current;
    if (audio) {
      audio.pause();
      audio.currentTime = 0;
    }
    setActiveFrame(0);
    setExperienceState("intro");
  }

  const currentFrame = frames[activeFrame];
  const isFirstFrame = activeFrame === 0;
  const isLastFrame = activeFrame === frames.length - 1;

  return (
    <main className="relative min-h-screen overflow-x-hidden bg-[#111111] text-[#fff8ef]">
      <audio ref={audioRef} src={soundtrack} loop preload="auto" />

      {experienceState === "intro" && <IntroScreen onStart={startExperience} />}

      {experienceState === "loading" && <LoadingScreen />}

      {experienceState === "story" && currentFrame && (
        <section className="relative z-10 flex min-h-screen items-center justify-center px-4 pb-24 pt-20 sm:px-6 lg:px-10">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_34%_40%,rgba(249,199,132,0.2),transparent_32%),linear-gradient(135deg,#120d0a_0%,#21120d_48%,#0b1012_100%)]" />

          {isLastFrame && (
            <button
              onClick={returnToStart}
              className="absolute right-4 top-4 z-30 inline-flex items-center gap-2 rounded-md border border-[#f9c784]/45 bg-black/35 px-4 py-3 text-sm font-semibold text-[#fff8ef] shadow-lg backdrop-blur-sm transition hover:bg-black/50 sm:right-6 sm:top-6"
              aria-label="Voltar ao inicio"
              title="Voltar ao inicio"
            >
              <RotateCcw className="h-5 w-5" />
              Voltar ao início
            </button>
          )}

          <div className="relative z-10 grid w-full max-w-7xl items-center gap-5 lg:grid-cols-[minmax(0,1.18fr)_minmax(360px,0.82fr)]">
            <div className="story-main-frame relative overflow-hidden rounded-xl border border-[#f9c784]/35 bg-[#f6dfbd] shadow-[0_24px_80px_rgba(0,0,0,0.46)]">
              <img
                key={activeFrame}
                src={currentFrame.image}
                alt="Avatar do homem"
                className="relative z-10 h-full max-h-[82vh] min-h-[390px] w-full animate-story-photo-in object-contain object-bottom"
              />
              <img
                src={dogAvatar}
                alt="Cachorro"
                className="pointer-events-none absolute bottom-[4%] left-[48%] z-20 w-[19%] min-w-24 max-w-44 drop-shadow-[0_16px_24px_rgba(0,0,0,0.28)]"
              />
            </div>

            <article className="story-text-panel relative rounded-xl border border-[#f9c784]/35 bg-[#130d0a]/82 px-5 py-5 shadow-[0_22px_70px_rgba(0,0,0,0.42)] backdrop-blur-sm sm:px-7 sm:py-7 lg:max-h-[78vh] lg:overflow-y-auto">
              <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[#f9c784]/75">
                {currentFrame.title} de {frames.length}
              </p>
              <div className="mt-5 space-y-4 text-[1.08rem] leading-relaxed text-[#fff8ef]/90 sm:text-xl">
                {currentFrame.paragraphs.map((paragraph, index) => (
                  <p key={`${paragraph}-${index}`}>{renderInlineMarkdown(paragraph)}</p>
                ))}
              </div>
            </article>
          </div>

          <div className="absolute inset-x-4 bottom-5 z-20 flex items-center justify-between gap-4 sm:inset-x-8">
            <button
              onClick={showPreviousFrame}
              disabled={isFirstFrame}
              className="inline-flex h-12 min-w-12 items-center justify-center rounded-md border border-[#f9c784]/35 bg-black/35 px-4 text-[#fff8ef] shadow-lg backdrop-blur-sm transition hover:bg-black/50 disabled:pointer-events-none disabled:opacity-30"
              aria-label="Bloco anterior"
              title="Bloco anterior"
            >
              <ChevronLeft className="h-6 w-6" />
              <span className="hidden sm:inline">Anterior</span>
            </button>

            <div className="rounded-full border border-[#f9c784]/25 bg-black/28 px-4 py-2 text-sm font-medium text-[#fff8ef]/80 backdrop-blur-sm">
              {activeFrame + 1} / {frames.length}
            </div>

            <button
              onClick={showNextFrame}
              disabled={isLastFrame}
              className="inline-flex h-12 min-w-12 items-center justify-center rounded-md border border-[#f9c784]/35 bg-black/35 px-4 text-[#fff8ef] shadow-lg backdrop-blur-sm transition hover:bg-black/50 disabled:pointer-events-none disabled:opacity-30"
              aria-label="Proximo bloco"
              title="Proximo bloco"
            >
              <span className="hidden sm:inline">Próximo</span>
              <ChevronRight className="h-6 w-6" />
            </button>
          </div>
        </section>
      )}
    </main>
  );
}

export { App as SurpriseApp };

function IntroScreen({ onStart }: { onStart: () => void }) {
  return (
    <section className="relative z-10 flex min-h-screen items-center justify-center overflow-hidden bg-[linear-gradient(135deg,#f7f7f7_0%,#c8c8c8_45%,#f1f1f1_100%)] px-5 text-[#202020]">
      <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(255,255,255,0.55),transparent_28%,rgba(255,255,255,0.32)_62%,transparent)]" />
      <div className="relative mx-auto flex max-w-2xl flex-col items-center text-center">
        <p className="text-2xl font-semibold leading-snug sm:text-4xl">
          Oi, tudo bem? Que bom que você veio aqui.
        </p>
        <p className="mt-5 text-lg leading-relaxed text-[#303030] sm:text-2xl">
          Eu preparei essa surpresa. Não é muito, mas é de coração. Vamos começar?
        </p>
        <button
          onClick={onStart}
          className="mt-10 rounded-md bg-[#202020] px-12 py-5 text-2xl font-bold text-white shadow-[0_18px_42px_rgba(0,0,0,0.28)] transition hover:translate-y-[-2px] hover:bg-[#050505] sm:px-16 sm:py-6 sm:text-3xl"
        >
          Começar
        </button>
      </div>
    </section>
  );
}

function LoadingScreen() {
  return (
    <section className="relative z-10 flex min-h-screen items-center justify-center bg-[#111111] px-5 text-center text-[#fff8ef]">
      <div className="max-w-xl">
        <p className="text-2xl font-semibold sm:text-4xl">Só um instante...</p>
        <p className="mt-4 text-lg text-[#fff8ef]/72 sm:text-xl">
          A música já começou. A surpresa entra junto com ela.
        </p>
      </div>
    </section>
  );
}

function renderInlineMarkdown(text: string) {
  const parts = text.split(/(\*\*[^*]+\*\*)/g);
  return parts.map((part, index) => {
    if (part.startsWith("**") && part.endsWith("**")) {
      return <strong key={`${part}-${index}`}>{part.slice(2, -2)}</strong>;
    }
    return part;
  });
}
