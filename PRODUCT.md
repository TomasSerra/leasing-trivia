# Product

## Register

product

## Users

Visitantes de un stand de Leasing Argentina en ferias, congresos o eventos del sector productivo. No son usuarios recurrentes: pasan una vez, de pie, con poco tiempo y distraídos por el entorno. Muchos no saben qué es el leasing; algunos son potenciales tomadores (PyMEs, empresas). El operador del stand también es "usuario": necesita ver cuánta gente jugó por día.

La interacción es una TV touch vertical (9:16) instalada como PWA en modo kiosco. Alguien decide en medio segundo si la toca.

## Product Purpose

Una trivia de 3 preguntas (tomadas al azar de un set de 20) con 40 segundos para responderlas. El objetivo no es el juego en sí, es didáctico: que en menos de un minuto el visitante entienda qué es un canon, quién es el Dador y quién el Tomador, y se lleve una idea concreta del leasing como herramienta de financiación.

Éxito = gente que se acerca, juega, y sale sabiendo algo que no sabía. Por eso el feedback es inmediato y se juegan siempre las 3 preguntas aunque la primera esté mal.

## Brand Personality

Institucional, claro, confiable. Formal estilo banco pero moderno y directo, no acartonado. Tres palabras: **serio, claro, cercano**. Voz explicativa en español rioplatense, sin marketing ni promesas: dice lo que el leasing literalmente es y hace. Debe transmitir la solidez de una asociación que agrupa a los principales bancos del país, sin volverse fría.

## Anti-references

- Trivias de app de juego infantil: colores estridentes, timers rojos parpadeantes, sonidos de premio.
- El default "tarjeta blanca sobre gris" que hace que todo parezca un formulario genérico.
- Estética fintech-neón o gamer. Esto es una asociación bancaria, no una startup.
- Cualquier color fuera de la paleta de marca (restricción dura del cliente).

## Design Principles

1. **Legible a tres metros.** Todo tamaño de tipografía y contraste se decide pensando en alguien parado frente a una TV grande, no en un lector cercano.
2. **La marca es el ambiente, no un sticker.** El isotipo y la paleta construyen el clima; no se pega un logo en una esquina y listo.
3. **Enseñar, no castigar.** El error informa (muestra la respuesta correcta), no corta la experiencia. Se juegan siempre las 3.
4. **Dos mundos.** Jugar es claro y sereno (máxima legibilidad); el resultado es color pleno (el momento emocional). El contraste narra.
5. **Kiosco confiable.** Auto-reset, atractora y bloqueo de gestos: la próxima persona siempre encuentra la app lista, nunca una partida a medias ni el navegador expuesto.

## Accessibility & Inclusion

- Contraste WCAG AA en todo texto real (cuerpo ≥4.5:1, display ≥3:1); los ratios medidos están en DESIGN.md.
- El feedback nunca depende sólo del color: correcta lleva ✓ y verde, incorrecta lleva ✗ y rojo. Funciona para daltonismo.
- `prefers-reduced-motion`: todas las animaciones (wipe entre mundos, entradas, pulso de la atractora) degradan a transición instantánea o crossfade.
- Objetivos táctiles grandes (opciones ≥13vh, botones ≥6rem) para uso de pie y dedos, no mouse.
