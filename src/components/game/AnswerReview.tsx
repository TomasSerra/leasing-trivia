import type { AnsweredQuestion } from '@/domain/types';
import { CheckIcon, CrossIcon } from './icons';

interface AnswerReviewProps {
  readonly answers: readonly AnsweredQuestion[];
}

/**
 * Repaso de las 3 respuestas en la pantalla de resultado: qué preguntó, si
 * acertó y cuál era la correcta. Es el momento didáctico, va sobre fondo de
 * color, así que usa blanco con transparencias del mismo fondo.
 */
export function AnswerReview({ answers }: AnswerReviewProps) {
  return (
    <ul className="flex w-full flex-col gap-[0.9rem]">
      {answers.map((answer) => {
        const correct = answer.question.options.find((o) => o.isCorrect);
        return (
          <li
            key={answer.question.id}
            className="flex items-start gap-[1rem] rounded-[1rem] bg-white/12 px-[1.2rem] py-[1rem] text-white"
          >
            <span
              className="mt-[0.15rem] flex h-[2.2rem] w-[2.2rem] shrink-0 items-center justify-center rounded-full bg-white/20"
              aria-hidden="true"
            >
              {answer.wasCorrect ? (
                <CheckIcon className="h-[1.3rem] w-[1.3rem]" />
              ) : (
                <CrossIcon className="h-[1.3rem] w-[1.3rem]" />
              )}
            </span>
            <div className="min-w-0">
              <p className="text-[1.25rem] font-bold leading-[1.2]">{answer.question.prompt}</p>
              {!answer.wasCorrect && correct && (
                <p className="mt-[0.35rem] text-[1.1rem] font-normal leading-[1.25] text-white/85">
                  Respuesta correcta: {correct.text}
                </p>
              )}
            </div>
          </li>
        );
      })}
    </ul>
  );
}
