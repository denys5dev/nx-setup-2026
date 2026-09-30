import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import type {
  CreateTodoInput,
  DashboardSummary,
  Todo,
  UpdateTodoInput,
} from '@celestial/shared/dashboard/contracts';

@Injectable({ providedIn: 'root' })
export class DashboardDataService {
  private readonly http = inject(HttpClient);
  private readonly todosUrl = '/api/dashboard/todos';

  getSummary() {
    return this.http.get<DashboardSummary>('/api/dashboard');
  }

  getTodos() {
    return this.http.get<Todo[]>(this.todosUrl);
  }

  createTodo(input: CreateTodoInput) {
    return this.http.post<Todo>(this.todosUrl, input);
  }

  updateTodo(id: string, input: UpdateTodoInput) {
    return this.http.patch<Todo>(
      `${this.todosUrl}/${encodeURIComponent(id)}`,
      input,
    );
  }

  deleteTodo(id: string) {
    return this.http.delete<void>(`${this.todosUrl}/${encodeURIComponent(id)}`);
  }
}
