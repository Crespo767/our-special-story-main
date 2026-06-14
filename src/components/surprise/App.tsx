import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { ChevronLeft, ChevronRight, Home, Loader2 } from "lucide-react";

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
  .split(/\r?\n\s*---+\s*\r?\n/g)
  .map((block) => block.trim())
  .filter(Boolean);

const frameCount = messageBlocks.length > 0 ? messageBlocks.length : frames.length;

function stripMarkdownBold(text: string) {
  return text.replace(/\*\*/g, "");
}

function normalizePanelMessage(title: string, message: string) {
  return stripMarkdownBold(`${title}\n\n${message}`)
    .replace(/[ \t]+/g, " ")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
}

function getPanelDensityClass(text: string) {
  if (text.length > 420) return "story-text-panel--extended";
  if (text.length > 300) return "story-text-panel--long";
  if (text.length > 190) return "story-text-panel--medium";
  return "story-text-panel--short";
}

function removeBlockLabel(lines: string[]) {
  const firstLine = stripMarkdownBold(lines[0] ?? "").trim();
  return /^bloco\s+\d+$/i.test(firstLine) ? lines.slice(1) : lines;
}

const storyFrames = Array.from({ length: frameCount }, (_, index) => {
  const frame = frames[index % frames.length];
  const block = messageBlocks[index];
  if (!block) return frame;

  const lines = removeBlockLabel(
    block
      .split(/\r?\n/g)
      .map((line) => line.trim())
      .filter(Boolean),
  );
  const [firstLine, ...rest] = lines;
  const title = firstLine ? stripMarkdownBold(firstLine) : `Mensagem ${index + 1}`;

  return {
    ...frame,
    title,
    message: rest.length > 0 ? rest.join("\n\n") : title,
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
  const textPanelRef = useRef<HTMLElement | null>(null);
  const messageCopyRef = useRef<HTMLParagraphElement | null>(null);
  const [activeFrame, setActiveFrame] = useState(0);
  const [started, setStarted] = useState(false);
  const [introLoading, setIntroLoading] = useState(false);
  const isFirstFrame = activeFrame === 0;
  const isLastFrame = activeFrame === storyFrames.length - 1;
  const currentFrame = storyFrames[activeFrame];
  const currentPanelMessage = normalizePanelMessage(currentFrame.title, currentFrame.message);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    audio.volume = 0.28;
  }, []);

  useLayoutEffect(() => {
    const panel = textPanelRef.current;
    const copy = messageCopyRef.current;
    if (!panel || !copy) return;

    let animationFrame = 0;

    function fitMessage() {
      window.cancelAnimationFrame(animationFrame);
      animationFrame = window.requestAnimationFrame(() => {
        if (!panel || !copy) return;

        const panelStyle = window.getComputedStyle(panel);
        const copyStyle = window.getComputedStyle(copy);
        const maxSize = Number.parseFloat(copyStyle.getPropertyValue("--story-message-size"));
        const minSize = Number.parseFloat(copyStyle.getPropertyValue("--story-message-min-size"));
        const availableHeight =
          panel.clientHeight -
          Number.parseFloat(panelStyle.paddingTop) -
          Number.parseFloat(panelStyle.paddingBottom);

        let low = Number.isFinite(minSize) ? minSize : 11;
        let high = Number.isFinite(maxSize) ? maxSize : 24;

        for (let step = 0; step < 10; step += 1) {
          const middle = (low + high) / 2;
          copy.style.fontSize = `${middle}px`;

          if (copy.scrollHeight <= availableHeight && copy.scrollWidth <= panel.clientWidth) {
            low = middle;
          } else {
            high = middle;
          }
        }

        copy.style.fontSize = `${Math.floor(low * 10) / 10}px`;
      });
    }

    fitMessage();
    const resizeObserver = new ResizeObserver(fitMessage);
    resizeObserver.observe(panel);

    void document.fonts?.ready.then(fitMessage);

    return () => {
      window.cancelAnimationFrame(animationFrame);
      resizeObserver.disconnect();
    };
  }, [currentPanelMessage, started]);

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
    setActiveFrame((current) => Math.max(current - 1, 0));
  }

  function showNextFrame() {
    setStarted(true);
    setActiveFrame((current) => Math.min(current + 1, storyFrames.length - 1));
  }

  function returnToStart() {
    setStarted(true);
    setActiveFrame(0);
  }

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

      {started && isLastFrame && (
        <button
          type="button"
          onClick={returnToStart}
          className="absolute right-4 top-4 z-30 inline-flex h-11 items-center justify-center gap-2 rounded-md border border-[#f9c784]/35 bg-black/30 px-4 text-sm font-bold text-[#fff8ef] backdrop-blur-sm transition hover:bg-black/45"
          aria-label="Voltar ao inicio"
          title="Voltar ao inicio"
        >
          <Home className="h-4 w-4" />
          Voltar ao inicio
        </button>
      )}

      <section className="story-stage relative z-10 flex min-h-screen items-center justify-center px-4 pb-36 pt-16 sm:pb-44">
        {!isFirstFrame && (
          <button
            onClick={showPreviousFrame}
            className="absolute left-4 z-20 hidden h-12 w-12 items-center justify-center rounded-md border border-[#f9c784]/25 bg-black/25 text-[#fff8ef] backdrop-blur-sm transition hover:bg-black/40 md:flex"
            aria-label="Imagem anterior"
            title="Imagem anterior"
          >
            <ChevronLeft className="h-7 w-7" />
          </button>
        )}

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

          <aside
            ref={textPanelRef}
            className={`story-text-panel ${getPanelDensityClass(currentPanelMessage)}`}
          >
            <p ref={messageCopyRef} className="story-message-copy">
              {currentPanelMessage}
            </p>
          </aside>
        </div>

        {!isLastFrame && (
          <button
            onClick={showNextFrame}
            className="absolute right-4 z-20 hidden h-12 w-12 items-center justify-center rounded-md border border-[#f9c784]/25 bg-black/25 text-[#fff8ef] backdrop-blur-sm transition hover:bg-black/40 md:flex"
            aria-label="Proxima imagem"
            title="Proxima imagem"
          >
            <ChevronRight className="h-7 w-7" />
          </button>
        )}
      </section>

      <HerFilmStrips />
    </main>
  );
}

export { App as SurpriseApp };

function HerFilmStrips() {
  const strip = [...herFrames, ...herFrames];

  return (
    <div className="pointer-events-none absolute inset-0 z-[5] overflow-hidden">
      <div className="story-film-edge story-film-edge--top">
        <div className="story-film-strip story-film-strip--horizontal">
          {strip.map((image, index) => (
            <FilmFrame key={`top-${image}-${index}`} image={image} />
          ))}
        </div>
      </div>

      <div className="story-film-edge story-film-edge--bottom">
        <div className="story-film-strip story-film-strip--horizontal story-film-strip--reverse">
          {strip.map((image, index) => (
            <FilmFrame key={`bottom-${image}-${index}`} image={image} />
          ))}
        </div>
      </div>

      <div className="story-film-edge story-film-edge--left">
        <div className="story-film-strip story-film-strip--vertical">
          {strip.map((image, index) => (
            <FilmFrame key={`left-${image}-${index}`} image={image} vertical />
          ))}
        </div>
      </div>

      <div className="story-film-edge story-film-edge--right">
        <div className="story-film-strip story-film-strip--vertical story-film-strip--reverse">
          {strip.map((image, index) => (
            <FilmFrame key={`right-${image}-${index}`} image={image} vertical />
          ))}
        </div>
      </div>
    </div>
  );
}

function FilmFrame({ image, vertical = false }: { image: string; vertical?: boolean }) {
  return (
    <div className={vertical ? "story-film-frame story-film-frame--vertical" : "story-film-frame"}>
      <img src={image} alt="" className="h-full w-full object-contain" loading="eager" />
    </div>
  );
}
