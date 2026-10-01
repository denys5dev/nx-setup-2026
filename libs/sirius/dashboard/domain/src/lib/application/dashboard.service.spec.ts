import { NotFoundException } from '@nestjs/common';
import { DashboardService } from './dashboard.service';
import { TodoRepository } from '../infrastructure/todo.repository';

describe(DashboardService.name, () => {
  let service: DashboardService;

  beforeEach(() => {
    service = new DashboardService(new TodoRepository());
  });

  it('when getSummary is called, should return the summary', () => {
    const result = service.getSummary();

    expect(result).toEqual({ message: 'Welcome to Sirius' });
  });

  it('when getTodo is called for a created todo, should return the todo', () => {
    const todo = service.createTodo({ title: 'Plan' });

    const result = service.getTodo(todo.id);

    expect(result).toEqual(todo);
  });

  it('when listTodos is called, should return created todos', () => {
    const todo = service.createTodo({ title: 'Plan' });

    const result = service.listTodos();

    expect(result).toEqual([todo]);
  });

  it('when getTodo is called, should return a copy of stored data', () => {
    const todo = service.createTodo({ title: 'Plan' });

    const result = service.getTodo(todo.id);

    expect(result).not.toBe(todo);
  });

  it('when updateTodo is called with a title, should rename the todo', () => {
    const todo = service.createTodo({ title: 'Plan' });

    const result = service.updateTodo(todo.id, { title: 'Ship' });

    expect(result).toEqual({ ...todo, title: 'Ship' });
  });

  it('when updateTodo is called with completed as true, should complete the todo', () => {
    const todo = service.createTodo({ title: 'Plan' });

    const result = service.updateTodo(todo.id, { completed: true });

    expect(result.completed).toBe(true);
  });

  it('when updateTodo is called with completed as false, should reopen the todo', () => {
    const todo = service.createTodo({ title: 'Plan' });
    service.updateTodo(todo.id, { completed: true });

    const result = service.updateTodo(todo.id, { completed: false });

    expect(result.completed).toBe(false);
  });

  it('when deleteTodo is called, should remove the todo', () => {
    const todo = service.createTodo({ title: 'Plan' });

    service.deleteTodo(todo.id);

    expect(service.listTodos()).toEqual([]);
  });

  it('when getTodo is called for a missing todo, should throw NotFoundException', () => {
    const act = () => service.getTodo('missing');

    expect(act).toThrow(NotFoundException);
  });

  it('when updateTodo is called for a missing todo, should throw NotFoundException', () => {
    const act = () => service.updateTodo('missing', { title: 'Gone' });

    expect(act).toThrow(NotFoundException);
  });

  it('when deleteTodo is called for a missing todo, should throw NotFoundException', () => {
    const act = () => service.deleteTodo('missing');

    expect(act).toThrow(NotFoundException);
  });
});
