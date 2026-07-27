import { Iso } from '@/components/brand/Iso';
import { cn } from '@/lib/cn';

interface BrandFieldProps {
  /**
   * Tinte del campo. `ink` sobre el mundo claro, `white` sobre los drenches de
   * color del resultado.
   */
  readonly tone?: 'ink' | 'white';
  readonly className?: string;
}

/**
 * Marca como atmósfera: el isotipo a escala enorme y muy tenue, anclado fuera
 * de los bordes. Usa la silueta plana (icon-white) porque a esta escala y
 * opacidad los degradés del isotipo a color se ensucian y compiten con el texto.
 * Decorativo y no interactivo.
 */
export function BrandField({ tone = 'ink', className }: BrandFieldProps) {
  const tint = tone === 'white' ? 'text-white' : 'text-brand-deep';

  return (
    <div
      className={cn('pointer-events-none absolute inset-0 overflow-hidden', className)}
      aria-hidden="true"
    >
      <Iso
        tone="solid"
        className={cn(
          'absolute -bottom-[20vh] -left-[30vh] h-[68vh] w-[68vh]',
          tint,
          tone === 'white' ? 'opacity-[0.10]' : 'opacity-[0.05]',
        )}
      />
      <Iso
        tone="solid"
        className={cn(
          'absolute -right-[13vh] -top-[15vh] h-[40vh] w-[40vh]',
          tint,
          tone === 'white' ? 'opacity-[0.08]' : 'opacity-[0.04]',
        )}
      />
    </div>
  );
}
