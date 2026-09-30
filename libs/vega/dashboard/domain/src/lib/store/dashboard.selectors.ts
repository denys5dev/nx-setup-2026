import { createSelector } from '@ngrx/store';
import { dashboardFeature, todoAdapter } from './dashboard.reducer';

export const { selectAll: selectTodos } = todoAdapter.getSelectors(
  dashboardFeature.selectDashboardState,
);
export const selectRemaining = createSelector(
  selectTodos,
  (todos) => todos.filter((todo) => !todo.completed).length,
);
export const selectDashboardView = createSelector(
  dashboardFeature.selectDashboardState,
  selectTodos,
  selectRemaining,
  (state, todos, remaining) => ({
    message: state.message,
    loaded: state.loaded,
    pending: state.pending,
    error: state.error,
    newTitle: state.newTitle,
    editingId: state.editingId,
    editTitle: state.editTitle,
    todos,
    remaining,
  }),
);
export type DashboardView = ReturnType<typeof selectDashboardView>;
