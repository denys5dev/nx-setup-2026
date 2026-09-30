import { BadRequestException } from '@nestjs/common';
import { TODO_TITLE_MAX_LENGTH } from '@celestial/shared/dashboard/contracts';
import { parseCreateTodo, parseUpdateTodo } from './todo.dto';

describe('todo request validation', () => {
  it.each([
    null,
    [],
    {},
    { title: 42 },
    { title: '   ' },
    { title: 'x'.repeat(TODO_TITLE_MAX_LENGTH + 1) },
    { title: 'Valid', id: 'injected' },
  ])('rejects invalid creates: %j', (body) => {
    const act = () => parseCreateTodo(body);

    expect(act).toThrow(BadRequestException);
  });

  it.each([
    null,
    [],
    {},
    { completed: 'false' },
    { completed: null },
    { title: '' },
    { unknown: true },
  ])('rejects invalid patches: %j', (body) => {
    const act = () => parseUpdateTodo(body);

    expect(act).toThrow(BadRequestException);
  });

  it('trims a create title', () => {
    const body = { title: '  Plan release  ' };

    const result = parseCreateTodo(body);

    expect(result).toEqual({ title: 'Plan release' });
  });

  it('preserves false without adding absent patch fields', () => {
    const body = { completed: false };

    const result = parseUpdateTodo(body);

    expect(result).toEqual({ completed: false });
  });

  it('trims an updated title', () => {
    const body = { title: ' Rename ' };

    const result = parseUpdateTodo(body);

    expect(result).toEqual({ title: 'Rename' });
  });
});
