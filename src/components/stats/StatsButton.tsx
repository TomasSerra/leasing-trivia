import { forwardRef } from 'react';
import { cn } from '@/lib/cn';

/**
 * Zona secreta de apertura de estadísticas: invisible, cubre la esquina superior
 * derecha del inicio. Es para el operador del stand, no para el visitante, así
 * que no ocupa lugar en la composición.
 *
 * Sigue siendo un <button> real con nombre accesible: invisible a la vista no
 * es lo mismo que inexistente para un lector de pantalla o para el foco.
 */
export const StatsButton = forwardRef<HTMLButtonElement, React.ComponentPropsWithoutRef<'button'>>(
  function StatsButton({ className, ...props }, ref) {
    return (
      <button
        ref={ref}
        type="button"
        aria-label="Ver estadísticas de juego"
        className={cn(
          'absolute right-0 top-0 z-20 h-[14vh] w-[14vh]',
          // Sin fondo ni borde: se ve la pantalla, no el botón. El anillo de
          // foco se conserva para navegación por teclado.
          'bg-transparent outline-none focus-visible:ring-2 focus-visible:ring-brand-deep',
          className,
        )}
        {...props}
      />
    );
  },
);
