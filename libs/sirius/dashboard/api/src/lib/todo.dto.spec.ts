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
  ])(
    'when parseCreateTodo receives invalid input %j, should throw BadRequestException',
    (body) => {
      const act = () => parseCreateTodo(body);

      expect(act).toThrow(BadRequestException);
    },
  );

  it.each([
    null,
    [],
    {},
    { completed: 'false' },
    { completed: null },
    { title: '' },
    { unknown: true },
  ])(
    'when parseUpdateTodo receives invalid input %j, should throw BadRequestException',
    (body) => {
      const act = () => parseUpdateTodo(body);

      expect(act).toThrow(BadRequestException);
    },
  );

  it('when parseCreateTodo receives a title with surrounding whitespace, should trim the title', () => {
    const body = { title: '  Plan release  ' };

    const result = parseCreateTodo(body);

    expect(result).toEqual({ title: 'Plan release' });
  });

  it('when parseUpdateTodo receives completed as false, should preserve false without adding absent fields', () => {
    const body = { completed: false };

    const result = parseUpdateTodo(body);

    expect(result).toEqual({ completed: false });
  });

  it('when parseUpdateTodo receives a title with surrounding whitespace, should trim the title', () => {
    const body = { title: ' Rename ' };

    const result = parseUpdateTodo(body);

    expect(result).toEqual({ title: 'Rename' });
  });
});
