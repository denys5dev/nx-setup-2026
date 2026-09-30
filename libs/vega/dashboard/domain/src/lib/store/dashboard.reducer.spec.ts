import { dashboardFeature, initialState } from './dashboard.reducer';
import {
  DashboardApiActions as api,
  DashboardPageActions as page,
} from './dashboard.actions';

const todo = { id: 'one', title: 'Plan release', completed: false };
const reducer = dashboardFeature.reducer;

describe('dashboard reducer', () => {
  it('returns the initial state for an unknown action', () => {
    const result = reducer(undefined, { type: 'unknown' });

    expect(result).toEqual(initialState);
  });

  it('sets pending and clears the previous error when a request starts', () => {
    const state = { ...initialState, error: 'Previous failure' };

    const result = reducer(state, api.started());

    expect(result).toEqual({ ...state, pending: true, error: null });
  });

  it('stores a loaded dashboard', () => {
    const result = reducer(
      initialState,
      api.loaded({ message: 'Welcome', todos: [todo] }),
    );

    expect(result).toEqual({
      ...initialState,
      message: 'Welcome',
      loaded: true,
      ids: ['one'],
      entities: { one: todo },
    });
  });

  it('clears the create draft only after server success', () => {
    const state = { ...initialState, newTitle: todo.title, pending: true };

    const result = reducer(state, api.created({ todo }));

    expect(result).toEqual({
      ...initialState,
      ids: ['one'],
      entities: { one: todo },
    });
  });

  it('updates the todo and closes the editor after server success', () => {
    const state = {
      ...initialState,
      ids: ['one'],
      entities: { one: todo },
      editingId: 'one',
      editTitle: 'Ship',
      pending: true,
    };
    const updated = { ...todo, title: 'Ship' };

    const result = reducer(state, api.updated({ todo: updated }));

    expect(result).toEqual({
      ...initialState,
      ids: ['one'],
      entities: { one: updated },
    });
  });

  it('preserves the editor when another todo is updated', () => {
    const other = { id: 'two', title: 'Other task', completed: false };
    const state = {
      ...initialState,
      ids: ['one', 'two'],
      entities: { one: todo, two: other },
      editingId: 'one',
      editTitle: 'Unsaved draft',
      pending: true,
    };
    const updated = { ...other, completed: true };

    const result = reducer(state, api.updated({ todo: updated }));

    expect(result).toEqual({
      ...state,
      entities: { one: todo, two: updated },
      pending: false,
    });
  });

  it('removes a todo after server confirmation', () => {
    const state = {
      ...initialState,
      ids: ['one'],
      entities: { one: todo },
      pending: true,
    };

    const result = reducer(state, api.deleted({ id: 'one' }));

    expect(result).toEqual(initialState);
  });

  it('preserves data and drafts when a request fails', () => {
    const state = {
      ...initialState,
      ids: ['one'],
      entities: { one: todo },
      pending: true,
      newTitle: 'Draft',
      editingId: 'one',
      editTitle: 'Rename',
    };

    const result = reducer(state, api.failed({ error: 'Unavailable' }));

    expect(result).toEqual({ ...state, pending: false, error: 'Unavailable' });
  });

  it('keeps the draft while create is requested', () => {
    const state = { ...initialState, newTitle: 'Draft' };

    const result = reducer(state, page.create({ title: 'Draft' }));

    expect(result).toBe(state);
  });

  it('opens the editor with the selected title', () => {
    const result = reducer(initialState, page.edit({ todo }));

    expect(result).toEqual({
      ...initialState,
      editingId: 'one',
      editTitle: todo.title,
    });
  });

  it('clears the editor on cancel', () => {
    const state = { ...initialState, editingId: 'one', editTitle: 'Draft' };

    const result = reducer(state, page.cancelEdit());

    expect(result).toEqual(initialState);
  });

  it('stores the new todo draft', () => {
    const result = reducer(
      initialState,
      page.newTitleChanged({ title: 'Draft' }),
    );

    expect(result.newTitle).toBe('Draft');
  });

  it('stores the edit draft', () => {
    const result = reducer(
      initialState,
      page.editTitleChanged({ title: 'Draft' }),
    );

    expect(result.editTitle).toBe('Draft');
  });
});
