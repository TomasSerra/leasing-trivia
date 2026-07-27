import { Iso } from '@/components/brand/Iso';

/**
 * Pantalla atractora: aparece tras varios minutos de inactividad en el inicio.
 * Isotipo latiendo sobre azul pleno e invitación a tocar. El primer gesto la
 * baja (lo maneja useAttractScreen).
 */
export function AttractScreen() {
  return (
    <div className="fixed inset-0 z-40 flex flex-col items-center justify-center gap-[3vh] bg-brand-deep [animation:soft-fade_400ms_var(--ease-out-quart)]">
      <Iso
        tone="solid"
        className="h-[34vh] w-[34vh] text-white [animation:attract-pulse_2.8s_ease-in-out_infinite]"
      />
      <p className="text-[3.4rem] font-black leading-none tracking-[-0.02em] text-white">
        Tocá para jugar
      </p>
      <p className="text-[1.6rem] font-normal text-white/80">
        Trivia sobre leasing · Leasing Argentina
      </p>
    </div>
  );
}
