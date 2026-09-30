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
  it('selects todos in entity order', () => {
    const result = selectTodos(state);

    expect(result).toEqual(todos);
  });

  it('counts only incomplete todos', () => {
    const result = selectRemaining(state);

    expect(result).toBe(1);
  });

  it('builds the presentation model', () => {
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
