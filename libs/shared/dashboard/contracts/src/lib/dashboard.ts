export const TODO_TITLE_MAX_LENGTH = 120;

export interface DashboardSummary {
  readonly message: string;
}

export interface Todo {
  readonly id: string;
  readonly title: string;
  readonly completed: boolean;
}

export interface CreateTodoInput {
  readonly title: string;
}

export interface UpdateTodoInput {
  readonly title?: string;
  readonly completed?: boolean;
}
