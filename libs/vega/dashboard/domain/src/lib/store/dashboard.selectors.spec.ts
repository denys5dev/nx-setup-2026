import { initialState } from './dashboard.reducer';
import {
  selectTodos,
  selectRemaining,
  selectDashboardView,
} from './dashboard.selectors';

const todos = [
  { id: 'one', title: 'Plan', completed: false },
  { id: 'two', title: 'Ship', completed: true },
];
const state = {
  dashboard: {
    ...initialState,
    ids: ['one', 'two'],
    entities: { one: todos[0], two: todos[1] },
  },
};

describe('dashboard selectors', () => {
  it('when selectTodos is called, should return todos in entity order', () => {
    const result = selectTodos(state);

    expect(result).toEqual(todos);
  });

  it('when selectRemaining is called, should count only incomplete todos', () => {
    const result = selectRemaining(state);

    expect(result).toBe(1);
  });

  it('when selectDashboardView is called, should return the presentation model', () => {
    const result = selectDashboardView(state);

    expect(result).toEqual({
      message: '',
      loaded: false,
      pending: false,
      error: null,
      newTitle: '',
      editingId: null,
      editTitle: '',
      todos,
      remaining: 1,
    });
  });
});
