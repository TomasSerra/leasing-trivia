import { useEffect, useState } from 'react';
import Confetti from 'react-confetti';
import { cn } from '@/lib/cn';
import type { AnsweredQuestion, GameOutcome } from '@/domain/types';
import { countCorrect } from '@/domain/quiz';
import { Iso } from '@/components/brand/Iso';
import { BrandField } from '@/components/kiosk/BrandField';

interface ResultScreenProps {
  readonly outcome: GameOutcome;
  readonly answers: readonly AnsweredQuestion[];
  readonly onHome: () => void;
}

const COPY: Record<GameOutcome, { title: string; subtitle: string }> = {
  won: { title: '¡Ganaste!', subtitle: 'Respondiste las tres preguntas correctamente.' },
  'lost-mistake': { title: '¡Casi!', subtitle: 'Para ganar necesitás las tres respuestas correctas.' },
  'lost-timeout': { title: '¡Se acabó el tiempo!', subtitle: 'Hay que responder las tres antes de que termine.' },
};

const THANKS_COPY = { title: 'Gracias por participar', subtitle: 'Te esperamos para volver a intentarlo.' };
const CONFETTI_COLORS = ['#005c9c', '#6197c0', '#98c9ed', '#c9e3f5', '#049bc2', '#5bcaf4', '#ffffff'];
const FULL_HD_VERTICAL_AREA = 1080 * 1920;
const FULL_HD_VERTICAL_CONFETTI = 640;

function readViewportSize() {
  if (typeof window === 'undefined') return { width: 0, height: 0 };

  const viewport = window.visualViewport;
  return {
    width: Math.round(viewport?.width ?? window.innerWidth),
    height: Math.round(viewport?.height ?? window.innerHeight),
  };
}

function useViewportSize() {
  const [size, setSize] = useState(readViewportSize);

  useEffect(() => {
    const updateSize = () => setSize(readViewportSize());
    const viewport = window.visualViewport;

    updateSize();
    window.addEventListener('resize', updateSize);
    window.addEventListener('orientationchange', updateSize);
    viewport?.addEventListener('resize', updateSize);
    viewport?.addEventListener('scroll', updateSize);

    return () => {
      window.removeEventListener('resize', updateSize);
      window.removeEventListener('orientationchange', updateSize);
      viewport?.removeEventListener('resize', updateSize);
      viewport?.removeEventListener('scroll', updateSize);
    };
  }, []);

  return size;
}

function confettiPiecesFor(width: number, height: number): number {
  const area = width * height;
  const scaled = Math.round((area / FULL_HD_VERTICAL_AREA) * FULL_HD_VERTICAL_CONFETTI);
  return Math.min(720, Math.max(280, scaled));
}

function illustrationFor(correct: number): { src: string; alt: string } | null {
  if (correct === 3) return { src: '/images/cup.webp', alt: 'Copa de ganador' };
  if (correct > 0) return { src: '/images/nervous.webp', alt: 'Resultado parcial' };
  return null;
}

/**
 * Pantalla de resultado (mundo pleno). Drench de color según el desenlace, con
 * un wipe vertical al entrar. Cierra con una ilustración según los aciertos.
 */
export function ResultScreen({ outcome, answers, onHome }: ResultScreenProps) {
  const won = outcome === 'won';
  const correct = countCorrect(answers);
  const copy = correct === 0 ? THANKS_COPY : COPY[outcome];
  const illustration = illustrationFor(correct);
  const scoreLabel = correct === 0 ? '0 de 0 correctas' : `${correct} de ${answers.length} correctas`;
  const { width, height } = useViewportSize();
  const confettiPieces = confettiPiecesFor(width, height);

  return (
    <div className="relative h-dvh w-full overflow-hidden">
      {/* Capa de color con wipe vertical: el momento memorable entre mundos. */}
      <div
        className={cn(
          'absolute inset-0 [animation:world-wipe_520ms_var(--ease-out-expo)]',
          won ? 'bg-teal-deep' : 'bg-brand-deep',
        )}
      />
      <BrandField tone="white" />
      {won && width > 0 && height > 0 && (
        <Confetti
          width={width}
          height={height}
          colors={CONFETTI_COLORS}
          numberOfPieces={confettiPieces}
          recycle={false}
          tweenDuration={1800}
          initialVelocityY={{ min: 7, max: 16 }}
          confettiSource={{ x: 0, y: -height * 0.1, w: width, h: height * 0.18 }}
          aria-hidden="true"
          style={{
            position: 'fixed',
            inset: 0,
            width,
            height,
            pointerEvents: 'none',
            zIndex: 20,
          }}
        />
      )}

      <div className="relative z-10 flex h-full flex-col items-center px-[3.2rem] py-[3.6rem] text-center [animation:content-rise_460ms_var(--ease-out-expo)_120ms_both]">
        <Iso tone="solid" className="h-[4.4rem] w-[4.4rem] text-white" label="Leasing Argentina" />

        <div
          className={cn(
            'flex flex-col items-center gap-[1.2rem]',
            illustration ? 'mt-[4vh]' : 'my-auto',
          )}
        >
          <p className="text-[1.8rem] font-bold uppercase tracking-[0.1em] text-white/80">
            {scoreLabel}
          </p>
          <h1 className="text-balance text-[5.6rem] font-black leading-[0.95] text-white">
            {copy.title}
          </h1>
          {copy.subtitle && (
            <p className="max-w-[32ch] text-[2rem] font-normal leading-[1.3] text-white/85">
              {copy.subtitle}
            </p>
          )}
        </div>

        {illustration && (
          <div className="flex min-h-0 flex-1 items-center justify-center py-[2.4rem]">
            <img
              src={illustration.src}
              alt={illustration.alt}
              draggable={false}
              className="h-auto w-[min(44vw,24vh)] max-w-[20rem] object-contain drop-shadow-[0_1rem_2rem_rgba(0,0,0,0.14)]"
            />
          </div>
        )}

        <div className="flex w-full flex-col">
          <button
            type="button"
            onClick={onHome}
            className={cn(
              'h-[8rem] w-full rounded-[1.4rem] bg-white text-[2.4rem] font-black transition-transform duration-200 ease-[var(--ease-out-quart)] active:scale-[0.98]',
              won ? 'text-teal-deep' : 'text-brand-deep',
            )}
          >
            Volver al inicio
          </button>
        </div>
      </div>
    </div>
  );
}
