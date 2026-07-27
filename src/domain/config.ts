/** Parámetros del juego. Un solo lugar para ajustar el balance en el evento. */

/** Preguntas por partida. */
export const QUESTIONS_PER_GAME = 3;

/** Tiempo total para responder las 3 preguntas. */
export const GAME_DURATION_MS = 40_000;

/** Cuánto dura el reveal antes de avanzar. El reloj se pausa durante este
 *  lapso, así los 40s son 40s de pensar. */
export const REVEAL_MS = 900;

/** Al errar el reveal dura más: hay que leer cuál era la correcta, no sólo ver
 *  que salió mal. Es el momento didáctico de la trivia. */
export const REVEAL_INCORRECT_EXTRA_MS = 1_000;

/** Acuse visual al tocar, antes de que empiece el reveal. */
export const ACKNOWLEDGE_MS = 140;

/** Últimos segundos en que el timer entra en modo urgencia. */
export const URGENCY_MS = 10_000;

/** Inactividad durante una partida → vuelve al inicio (no heredar partidas). */
export const IDLE_RESET_MS = 45_000;

/** Inactividad en el inicio → pantalla atractora. */
export const ATTRACT_AFTER_MS = 3 * 60_000;

/** Cuántas partidas hacia atrás se recuerdan para no repetir preguntas. */
export const RECENT_GAMES_MEMORY = 2;

/** Zona horaria para agrupar las estadísticas por día. */
export const STATS_TIME_ZONE = 'America/Argentina/Buenos_Aires';
