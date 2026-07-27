interface QuestionPromptProps {
  readonly prompt: string;
}

/** Enunciado de la pregunta. Balancea líneas y admite textos largos (p.15/16). */
export function QuestionPrompt({ prompt }: QuestionPromptProps) {
  return (
    <h1 className="text-balance text-[2.5rem] font-black leading-[1.08] tracking-[-0.02em] text-ink">
      {prompt}
    </h1>
  );
}
