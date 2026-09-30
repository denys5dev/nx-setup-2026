import { Injectable, NotFoundException } from '@nestjs/common';
import { randomUUID } from 'node:crypto';
import type {
  CreateTodoInput,
  DashboardSummary,
  Todo,
  UpdateTodoInput,
} from '@celestial/shared/dashboard/contracts';
import { TodoRepository } from '../infrastructure/todo.repository';

@Injectable()
export class DashboardService {
  constructor(private readonly todos: TodoRepository) {}

  getSummary(): DashboardSummary {
    return { message: 'Welcome to Sirius' };
  }

  listTodos(): Todo[] {
    return this.todos.list();
  }

  getTodo(id: string): Todo {
    const todo = this.todos.find(id);
    if (!todo) throw new NotFoundException('Todo not found');
    return todo;
  }

  createTodo(input: CreateTodoInput): Todo {
    return this.todos.save({
      id: randomUUID(),
      title: input.title,
      completed: false,
    });
  }

  updateTodo(id: string, input: UpdateTodoInput): Todo {
    const todo = this.getTodo(id);
    return this.todos.save({
      ...todo,
      title: input.title ?? todo.title,
      completed: input.completed ?? todo.completed,
    });
  }

  deleteTodo(id: string): void {
    this.getTodo(id);
    this.todos.delete(id);
  }
}
