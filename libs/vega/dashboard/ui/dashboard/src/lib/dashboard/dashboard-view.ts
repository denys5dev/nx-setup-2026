import type { Todo } from '@celestial/shared/dashboard/contracts';

export interface DashboardView {
  readonly message: string;
  readonly loaded: boolean;
  readonly pending: boolean;
  readonly error: string | null;
  readonly newTitle: string;
  readonly editingId: string | null;
  readonly editTitle: string;
  readonly todos: readonly Todo[];
  readonly remaining: number;
}
