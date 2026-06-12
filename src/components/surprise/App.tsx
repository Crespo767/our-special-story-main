import { useEffect, useRef, useState } from "react";
import { ChevronLeft, ChevronRight, Loader2 } from "lucide-react";

import avatarMain from "../../../Avatares/Avatar.png";
import avatarOne from "../../../Avatares/Avatar 1.png";
import avatarTwo from "../../../Avatares/Avatar 2.png";
import avatarThree from "../../../Avatares/Avatar 3.png";
import avatarFour from "../../../Avatares/Avatar 4.png";
import dogAvatar from "../../../Avatares/Cachorro sem fundo.png";
import dogAvatarOne from "../../../Avatares/Cachorro limpo 1.png";
import dogAvatarTwo from "../../../Avatares/Cachorro limpo 2.png";
import dogAvatarThree from "../../../Avatares/Cachorro limpo 3.png";
import dogAvatarFour from "../../../Avatares/Cachorro limpo 4.png";
import herAvatarMain from "../../../AvataresDela/Avatar dela.png";
import herAvatarOne from "../../../AvataresDela/Avatar dela 1.png";
import herAvatarTwo from "../../../AvataresDela/Avatar dela 2.png";
import herAvatarThree from "../../../AvataresDela/Avatar dela 3.png";
import herAvatarFour from "../../../AvataresDela/Avatar dela 4.png";
import herAvatarFive from "../../../AvataresDela/Avatar dela 5.png";
import herAvatarSix from "../../../AvataresDela/Avatar dela 6.png";
import herAvatarSeven from "../../../AvataresDela/Avatar dela 7.png";
import soundtrack from "../../../Music/aerosmith_sem_27_segundos_iniciais.mp3";
import messageText from "../../../Mensagem/Mensagens.txt?raw";

type Frame = {
  image: string;
  dogImage: string;
  title: string;
  message: string;
};

const frames: Frame[] = [
  {
    image: avatarMain,
    dogImage: dogAvatar,
    title: "Eu fiz isso pensando em você.",
    message: "Cada imagem aqui é um pedacinho do carinho que eu queria te mostrar.",
  },
  {
    image: avatarOne,
    dogImage: dogAvatarOne,
    title: "Você deixa tudo mais bonito.",
    message: "Até os momentos simples ficam especiais quando têm você no meio.",
  },
  {
    image: avatarTwo,
    dogImage: dogAvatarTwo,
    title: "Eu guardo nossos detalhes.",
    message: "As conversas, as risadas, os jeitos e tudo que só a gente entende.",
  },
  {
    image: avatarThree,
    dogImage: dogAvatarThree,
    title: "Tem coisa que vira lar.",
    message: "E estar perto de você virou uma dessas coisas para mim.",
  },
  {
    image: avatarFour,
    dogImage: dogAvatarFour,
    title: "Eu escolheria você de novo.",
    message: "Em qualquer versão da história, em qualquer quadro, em qualquer dia.",
  },
  {
    image: avatarOne,
    dogImage: dogAvatar,
    title: "Não quero perder nenhum detalhe.",
    message: "Por isso essa música, essa surpresa e esse jeito de te lembrar.",
  },
  {
    image: avatarThree,
    dogImage: dogAvatarTwo,
    title: "Ainda tem muito para viver.",
    message: "Que venham mais capítulos, mais planos e mais motivos para sorrir.",
  },
  {
    image: avatarMain,
    dogImage: dogAvatarFour,
    title: "Esse é só o começo.",
    message: "O resto da história eu quero continuar escrevendo com você.",
  },
];

const messageBlocks = messageText
  .split(/\r?\n(?:\s*---+\s*|\s*\r?\n)+/g)
  .map((block) => block.trim())
  .filter(Boolean);

const frameCount = Math.max(frames.length, messageBlocks.length);

const storyFrames = Array.from({ length: frameCount }, (_, index) => {
  const frame = frames[index % frames.length];
  const block = messageBlocks[index];
  if (!block) return frame;

  const lines = block
    .split(/\r?\n/g)
    .map((line) => line.trim())
    .filter(Boolean);
  const [firstLine, ...rest] = lines;

  return {
    ...frame,
    title: rest.length > 0 ? firstLine : `Mensagem ${index + 1}`,
    message: rest.length > 0 ? rest.join("\n\n") : firstLine,
  };
});

const herFrames = [
  herAvatarMain,
  herAvatarOne,
  herAvatarTwo,
  herAvatarThree,
  herAvatarFour,
  herAvatarFive,
  herAvatarSix,
  herAvatarSeven,
];

export default function App() {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [activeFrame, setActiveFrame] = useState(0);
  const [started, setStarted] = useState(false);
  const [introLoading, setIntroLoading] = useState(false);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    audio.volume = 0.28;
  }, []);

  async function startExperience() {
    if (introLoading || started) return;
    setIntroLoading(true);
    const audio = audioRef.current;
    if (audio) {
      audio.currentTime = 0;
      try {
        await audio.play();
      } catch {
        // Browser autoplay rules can still reject playback in unusual contexts.
      }
    }
    window.setTimeout(() => {
      setStarted(true);
      setIntroLoading(false);
    }, 3000);
  }

  function showPreviousFrame() {
    setStarted(true);
    setActiveFrame((current) => (current - 1 + storyFrames.length) % storyFrames.length);
  }

  function showNextFrame() {
    setStarted(true);
    setActiveFrame((current) => (current + 1) % storyFrames.length);
  }

  const currentFrame = storyFrames[activeFrame];

  return (
    <main className="relative min-h-screen overflow-hidden bg-[#120d0a] text-[#fff8ef]">
      <audio
        ref={audioRef}
        src={soundtrack}
        loop
      />

      {!started && (
        <section className="story-intro relative z-50 flex min-h-screen items-center justify-center px-6">
          <div className="story-intro-content">
            <p>
              Oi, tudo bem? Que bom ver você aqui. Eu preparei isso com muito carinho. Não é
              muito, mas foi de coração, e eu não podia deixar o Luke de fora kkkk. Espero que você
              goste. Aproveite :)
            </p>
            <button
              type="button"
              onClick={startExperience}
              disabled={introLoading}
              className="story-intro-button"
            >
              {introLoading ? (
                <>
                  <Loader2 className="h-5 w-5 animate-spin" />
                  Carregando
                </>
              ) : (
                "Começar"
              )}
            </button>
          </div>
        </section>
      )}

      <div className="story-page-bg absolute inset-0" />

      <section className="story-stage relative z-10 flex min-h-screen items-center justify-center px-4 pb-36 pt-16 sm:pb-44">
        <button
          onClick={showPreviousFrame}
          className="absolute left-4 z-20 hidden h-12 w-12 items-center justify-center rounded-md border border-[#f9c784]/25 bg-black/25 text-[#fff8ef] backdrop-blur-sm transition hover:bg-black/40 md:flex"
          aria-label="Imagem anterior"
          title="Imagem anterior"
        >
          <ChevronLeft className="h-7 w-7" />
        </button>

        <div className="story-layout w-full max-w-7xl">
          <div className="story-main-frame story-scene relative overflow-hidden rounded-2xl border border-[#f9c784]/55 shadow-[0_24px_80px_rgba(52,26,14,0.28)]">
            <img
              key={activeFrame}
              src={currentFrame.image}
              alt="Avatar"
              className="story-avatar h-full w-full animate-story-photo-in object-contain object-center"
            />
            <img
              src={currentFrame.dogImage}
              alt="Cachorro"
              className="story-dog pointer-events-none absolute animate-story-photo-in drop-shadow-[0_18px_24px_rgba(74,38,18,0.32)]"
            />
          </div>

          <aside className="story-text-panel">
            <p className="story-text-kicker">Para você</p>
            <h2>{currentFrame.title}</h2>
            <p>{currentFrame.message}</p>
          </aside>
        </div>

        <button
          onClick={showNextFrame}
          className="absolute right-4 z-20 hidden h-12 w-12 items-center justify-center rounded-md border border-[#f9c784]/25 bg-black/25 text-[#fff8ef] backdrop-blur-sm transition hover:bg-black/40 md:flex"
          aria-label="Proxima imagem"
          title="Proxima imagem"
        >
          <ChevronRight className="h-7 w-7" />
        </button>
      </section>

      <HerFilmStrip />
    </main>
  );
}

export { App as SurpriseApp };

function HerFilmStrip() {
  const strip = [...herFrames, ...herFrames];

  return (
    <div className="pointer-events-none absolute inset-x-0 bottom-0 z-20 overflow-hidden bg-black/18 py-4">
      <div className="story-film-strip flex w-max gap-3 will-change-transform">
        {strip.map((image, index) => (
          <div
            key={`${image}-${index}`}
            className="h-24 w-36 shrink-0 overflow-hidden rounded-md border border-[#f9c784]/25 bg-[#f6dfbd] shadow-lg sm:h-32 sm:w-48"
          >
            <img src={image} alt="" className="h-full w-full object-contain" loading="eager" />
          </div>
        ))}
      </div>
    </div>
  );
}

