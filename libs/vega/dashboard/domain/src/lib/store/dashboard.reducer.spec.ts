import { dashboardFeature, initialState } from './dashboard.reducer';
import {
  DashboardApiActions as api,
  DashboardPageActions as page,
} from './dashboard.actions';

const todo = { id: 'one', title: 'Plan release', completed: false };
const reducer = dashboardFeature.reducer;

describe('dashboard reducer', () => {
  it('when an unknown action is received without state, should return the initial state', () => {
    const result = reducer(undefined, { type: 'unknown' });

    expect(result).toEqual(initialState);
  });

  it('when started is received, should set pending and clear the previous error', () => {
    const state = { ...initialState, error: 'Previous failure' };

    const result = reducer(state, api.started());

    expect(result).toEqual({ ...state, pending: true, error: null });
  });

  it('when loaded is received, should store the dashboard', () => {
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

  it('when created is received, should store the todo and clear the create draft', () => {
    const state = { ...initialState, newTitle: todo.title, pending: true };

    const result = reducer(state, api.created({ todo }));

    expect(result).toEqual({
      ...initialState,
      ids: ['one'],
      entities: { one: todo },
    });
  });

  it('when updated is received for the edited todo, should update the todo and close the editor', () => {
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

  it('when updated is received for another todo, should preserve the editor', () => {
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

  it('when deleted is received, should remove the todo', () => {
    const state = {
      ...initialState,
      ids: ['one'],
      entities: { one: todo },
      pending: true,
    };

    const result = reducer(state, api.deleted({ id: 'one' }));

    expect(result).toEqual(initialState);
  });

  it('when failed is received, should preserve data and drafts and store the error', () => {
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

  it('when create is received, should preserve the draft', () => {
    const state = { ...initialState, newTitle: 'Draft' };

    const result = reducer(state, page.create({ title: 'Draft' }));

    expect(result).toBe(state);
  });

  it('when edit is received, should open the editor with the selected title', () => {
    const result = reducer(initialState, page.edit({ todo }));

    expect(result).toEqual({
      ...initialState,
      editingId: 'one',
      editTitle: todo.title,
    });
  });

  it('when cancelEdit is received, should clear the editor', () => {
    const state = { ...initialState, editingId: 'one', editTitle: 'Draft' };

    const result = reducer(state, page.cancelEdit());

    expect(result).toEqual(initialState);
  });

  it('when newTitleChanged is received, should store the new todo draft', () => {
    const result = reducer(
      initialState,
      page.newTitleChanged({ title: 'Draft' }),
    );

    expect(result.newTitle).toBe('Draft');
  });

  it('when editTitleChanged is received, should store the edit draft', () => {
    const result = reducer(
      initialState,
      page.editTitleChanged({ title: 'Draft' }),
    );

    expect(result.editTitle).toBe('Draft');
  });
});
