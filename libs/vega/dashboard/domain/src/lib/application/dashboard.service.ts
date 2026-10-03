import { inject, Injectable } from '@angular/core';
import { forkJoin, map } from 'rxjs';
import type {
  CreateTodoInput,
  UpdateTodoInput,
} from '@celestial/shared/dashboard/contracts';
import { DashboardDataService } from '../infrastructure/dashboard.data.service';

@Injectable({ providedIn: 'root' })
export class DashboardService {
  private readonly data = inject(DashboardDataService);

  load() {
    return forkJoin({
      summary: this.data.getSummary(),
      todos: this.data.getTodos(),
    }).pipe(map(({ summary, todos }) => ({ message: summary.message, todos })));
  }

  createTodo(input: CreateTodoInput) {
    return this.data.createTodo({ title: input.title.trim() });
  }

  updateTodo(id: string, input: UpdateTodoInput) {
    return this.data.updateTodo(id, input);
  }

  deleteTodo(id: string) {
    return this.data.deleteTodo(id);
  }
}
