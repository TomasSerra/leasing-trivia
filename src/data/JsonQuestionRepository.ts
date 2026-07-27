import type { GameQuestion, RawQuestion } from '@/domain/types';
import { pickQuestions } from '@/domain/quiz';
import { QUESTIONS_PER_GAME, RECENT_GAMES_MEMORY } from '@/domain/config';
import type { QuestionRepository } from './QuestionRepository';

/**
 * Repositorio sobre el JSON estático. Recuerda los ids usados en las últimas
 * `RECENT_GAMES_MEMORY` partidas y los desprioriza, para que dos visitantes
 * seguidos no vean las mismas preguntas.
 */
export class JsonQuestionRepository implements QuestionRepository {
  private recentIds: number[] = [];

  constructor(
    private readonly pool: readonly RawQuestion[],
    private readonly perGame: number = QUESTIONS_PER_GAME,
    private readonly memoryGames: number = RECENT_GAMES_MEMORY,
  ) {}

  nextGame(): GameQuestion[] {
    const questions = pickQuestions(this.pool, this.recentIds, this.perGame);
    this.remember(questions.map((q) => q.id));
    return questions;
  }

  private remember(ids: readonly number[]): void {
    const maxIds = this.perGame * this.memoryGames;
    this.recentIds = [...ids, ...this.recentIds].slice(0, maxIds);
  }
}
