import { createContext, useContext, useMemo, type ReactNode } from 'react';
import rawQuestions from '@/data/questions.json';
import type { RawQuestion } from '@/domain/types';
import type { QuestionRepository } from '@/data/QuestionRepository';
import type { StatsRepository } from '@/data/StatsRepository';
import { JsonQuestionRepository } from '@/data/JsonQuestionRepository';
import { LocalStatsRepository } from '@/data/LocalStatsRepository';

interface Repositories {
  readonly questions: QuestionRepository;
  readonly stats: StatsRepository;
}

const RepositoryContext = createContext<Repositories | null>(null);

interface RepositoryProviderProps {
  readonly children: ReactNode;
  /** Override para tests o para inyectar otra fuente sin tocar la UI. */
  readonly value?: Repositories;
}

export function RepositoryProvider({ children, value }: RepositoryProviderProps) {
  const repositories = useMemo<Repositories>(
    () =>
      value ?? {
        questions: new JsonQuestionRepository(rawQuestions as RawQuestion[]),
        stats: new LocalStatsRepository(),
      },
    [value],
  );

  return <RepositoryContext.Provider value={repositories}>{children}</RepositoryContext.Provider>;
}

function useRepositories(): Repositories {
  const ctx = useContext(RepositoryContext);
  if (!ctx) throw new Error('useRepositories debe usarse dentro de <RepositoryProvider>');
  return ctx;
}

export function useQuestionRepository(): QuestionRepository {
  return useRepositories().questions;
}

export function useStatsRepository(): StatsRepository {
  return useRepositories().stats;
}
