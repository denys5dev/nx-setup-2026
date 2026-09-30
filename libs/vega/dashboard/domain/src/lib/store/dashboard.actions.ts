import { createActionGroup, emptyProps, props } from '@ngrx/store';
import type {
  Todo,
  UpdateTodoInput,
} from '@celestial/shared/dashboard/contracts';

export const DashboardPageActions = createActionGroup({
  source: 'Dashboard Page',
  events: {
    Load: emptyProps(),
    'New Title Changed': props<{ title: string }>(),
    'Edit Title Changed': props<{ title: string }>(),
    Edit: props<{ todo: Todo }>(),
    'Cancel Edit': emptyProps(),
    Create: props<{ title: string }>(),
    Update: props<{ id: string; input: UpdateTodoInput }>(),
    Delete: props<{ id: string }>(),
  },
});
export type DashboardPageAction = ReturnType<
  (typeof DashboardPageActions)[keyof typeof DashboardPageActions]
>;

export const DashboardApiActions = createActionGroup({
  source: 'Dashboard API',
  events: {
    Started: emptyProps(),
    Loaded: props<{ message: string; todos: Todo[] }>(),
    Created: props<{ todo: Todo }>(),
    Updated: props<{ todo: Todo }>(),
    Deleted: props<{ id: string }>(),
    Failed: props<{ error: string }>(),
  },
});
