import { cn } from '@/lib/cn';

interface LogoProps {
  readonly className?: string;
}

/**
 * Logo completo (isotipo + logotipo) tal cual lo entregó el cliente, servido
 * desde `public/brand/logo.svg` para no tocar el original. Va siempre a color
 * sobre fondo claro; sobre fondos de color se usa <Iso tone="solid" />.
 */
export function Logo({ className }: LogoProps) {
  return (
    <img
      src="/brand/logo.svg"
      alt="Leasing Argentina"
      draggable={false}
      className={cn('block select-none', className)}
    />
  );
}
