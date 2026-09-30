import { createEntityAdapter, type EntityState } from '@ngrx/entity';
import { createFeature, createReducer, on } from '@ngrx/store';
import type { Todo } from '@celestial/shared/dashboard/contracts';
import {
  DashboardApiActions as api,
  DashboardPageActions as page,
} from './dashboard.actions';

export interface DashboardState extends EntityState<Todo> {
  message: string;
  loaded: boolean;
  pending: boolean;
  error: string | null;
  newTitle: string;
  editingId: string | null;
  editTitle: string;
}

export const todoAdapter = createEntityAdapter<Todo>();
export const initialState = todoAdapter.getInitialState<DashboardState>({
  message: '',
  loaded: false,
  pending: false,
  error: null,
  newTitle: '',
  editingId: null,
  editTitle: '',
});

export const dashboardFeature = createFeature({
  name: 'dashboard',
  reducer: createReducer(
    initialState,
    on(page.newTitleChanged, (state, { title }) => ({
      ...state,
      newTitle: title,
    })),
    on(page.editTitleChanged, (state, { title }) => ({
      ...state,
      editTitle: title,
    })),
    on(page.edit, (state, { todo }) => ({
      ...state,
      editingId: todo.id,
      editTitle: todo.title,
    })),
    on(page.cancelEdit, (state) => ({
      ...state,
      editingId: null,
      editTitle: '',
    })),
    on(api.started, (state) => ({ ...state, pending: true, error: null })),
    on(api.loaded, (state, { message, todos }) =>
      todoAdapter.setAll(todos, {
        ...state,
        message,
        loaded: true,
        pending: false,
      }),
    ),
    on(api.created, (state, { todo }) =>
      todoAdapter.addOne(todo, { ...state, pending: false, newTitle: '' }),
    ),
    on(api.updated, (state, { todo }) =>
      todoAdapter.upsertOne(todo, {
        ...state,
        pending: false,
        editingId: null,
        editTitle: '',
      }),
    ),
    on(api.deleted, (state, { id }) =>
      todoAdapter.removeOne(id, { ...state, pending: false }),
    ),
    on(api.failed, (state, { error }) => ({ ...state, pending: false, error })),
  ),
});
