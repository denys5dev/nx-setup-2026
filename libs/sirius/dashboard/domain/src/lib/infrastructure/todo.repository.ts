import { Injectable } from '@nestjs/common';
import type { Todo } from '@celestial/shared/dashboard/contracts';

@Injectable()
export class TodoRepository {
  // ponytail: process-local demo storage; replace with a database before durable or multi-instance use.
  private readonly todos = new Map<string, Todo>();

  list(): Todo[] {
    return [...this.todos.values()].map((todo) => ({ ...todo }));
  }

  find(id: string): Todo | undefined {
    const todo = this.todos.get(id);
    return todo ? { ...todo } : undefined;
  }

  save(todo: Todo): Todo {
    this.todos.set(todo.id, { ...todo });
    return { ...todo };
  }

  delete(id: string): void {
    this.todos.delete(id);
  }
}
