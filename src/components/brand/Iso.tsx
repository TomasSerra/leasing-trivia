import { useId } from 'react';
import { cn } from '@/lib/cn';
import {
  ISO_GRADIENTS,
  ISO_PATHS_COLOR,
  ISO_PATHS_SOLID,
  ISO_VIEWBOX_COLOR,
  ISO_VIEWBOX_SOLID,
} from './isoGeometry';

type IsoTone = 'color' | 'solid';

interface IsoProps {
  readonly className?: string;
  /**
   * `color` → isotipo original con sus cinco degradés (fondos claros).
   * `solid` → silueta de una tinta pintada con `currentColor`, para fondos de
   * color y para el campo de marca del fondo. Es el `icon-white` del cliente,
   * teñible para que sirva también sobre superficies claras.
   */
  readonly tone?: IsoTone;
  /** Decorativo por defecto; pasar un label lo expone como imagen accesible. */
  readonly label?: string;
}

/**
 * Isotipo de Leasing Argentina. Inline (no <img>) por dos razones: la variante
 * plana necesita heredar el color del contexto, y los degradés necesitan IDs
 * únicos por instancia para no colisionar cuando hay varios isotipos en pantalla.
 */
export function Iso({ className, tone = 'color', label }: IsoProps) {
  const uid = useId().replace(/:/g, '');
  const decorative = label === undefined;

  const a11y = decorative
    ? ({ 'aria-hidden': true } as const)
    : ({ role: 'img', 'aria-label': label } as const);

  if (tone === 'solid') {
    return (
      <svg
        viewBox={ISO_VIEWBOX_SOLID}
        className={cn(className)}
        fill="currentColor"
        focusable="false"
        {...a11y}
      >
        {ISO_PATHS_SOLID.map((d, i) => (
          <path key={i} d={d} />
        ))}
      </svg>
    );
  }

  return (
    <svg
      viewBox={ISO_VIEWBOX_COLOR}
      className={cn(className)}
      focusable="false"
      {...a11y}
    >
      <defs>
        {ISO_GRADIENTS.map((g) => (
          <linearGradient
            key={g.id}
            id={`${uid}-${g.id}`}
            x1={g.x1}
            y1={g.y1}
            x2={g.x2}
            y2={g.y2}
            gradientUnits="userSpaceOnUse"
          >
            {g.stops.map(([offset, color]) => (
              <stop key={offset} offset={offset} stopColor={color} />
            ))}
          </linearGradient>
        ))}
      </defs>
      {ISO_PATHS_COLOR.map((d, i) => (
        <path key={i} d={d} fill={`url(#${uid}-${ISO_GRADIENTS[i]?.id})`} />
      ))}
    </svg>
  );
}
