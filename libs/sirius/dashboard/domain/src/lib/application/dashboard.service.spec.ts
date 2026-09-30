import { NotFoundException } from '@nestjs/common';
import { DashboardService } from './dashboard.service';
import { TodoRepository } from '../infrastructure/todo.repository';

describe('DashboardService', () => {
  let service: DashboardService;

  beforeEach(() => {
    service = new DashboardService(new TodoRepository());
  });

  it('returns the summary', () => {
    const result = service.getSummary();

    expect(result).toEqual({ message: 'Welcome to Sirius' });
  });

  it('reads a created todo', () => {
    const todo = service.createTodo({ title: 'Plan' });

    const result = service.getTodo(todo.id);

    expect(result).toEqual(todo);
  });

  it('lists created todos', () => {
    const todo = service.createTodo({ title: 'Plan' });

    const result = service.listTodos();

    expect(result).toEqual([todo]);
  });

  it('returns a copy of stored data', () => {
    const todo = service.createTodo({ title: 'Plan' });

    const result = service.getTodo(todo.id);

    expect(result).not.toBe(todo);
  });

  it('renames a todo', () => {
    const todo = service.createTodo({ title: 'Plan' });

    const result = service.updateTodo(todo.id, { title: 'Ship' });

    expect(result).toEqual({ ...todo, title: 'Ship' });
  });

  it('completes a todo', () => {
    const todo = service.createTodo({ title: 'Plan' });

    const result = service.updateTodo(todo.id, { completed: true });

    expect(result.completed).toBe(true);
  });

  it('reopens a todo', () => {
    const todo = service.createTodo({ title: 'Plan' });
    service.updateTodo(todo.id, { completed: true });

    const result = service.updateTodo(todo.id, { completed: false });

    expect(result.completed).toBe(false);
  });

  it('deletes a todo', () => {
    const todo = service.createTodo({ title: 'Plan' });

    service.deleteTodo(todo.id);

    expect(service.listTodos()).toEqual([]);
  });

  it('rejects getTodo for a missing todo', () => {
    const act = () => service.getTodo('missing');

    expect(act).toThrow(NotFoundException);
  });

  it('rejects updateTodo for a missing todo', () => {
    const act = () => service.updateTodo('missing', { title: 'Gone' });

    expect(act).toThrow(NotFoundException);
  });

  it('rejects deleteTodo for a missing todo', () => {
    const act = () => service.deleteTodo('missing');

    expect(act).toThrow(NotFoundException);
  });
});
