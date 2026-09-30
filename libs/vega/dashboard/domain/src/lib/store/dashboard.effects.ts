import { Injectable, inject } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import {
  catchError,
  defer,
  exhaustMap,
  forkJoin,
  map,
  of,
  startWith,
} from 'rxjs';
import { DashboardDataService } from '../infrastructure/dashboard.data.service';
import {
  DashboardApiActions as api,
  DashboardPageActions as page,
} from './dashboard.actions';

@Injectable()
export class DashboardEffects {
  private readonly actions = inject(Actions);
  private readonly data = inject(DashboardDataService);

  // ponytail: one in-flight dashboard request; use per-operation concurrency when the UI needs parallel edits.
  readonly request = createEffect(() =>
    this.actions.pipe(
      ofType(page.load, page.create, page.update, page.delete),
      exhaustMap((action) => {
        const operation =
          action.type === page.load.type
            ? 'load dashboard'
            : action.type === page.create.type
              ? 'create todo'
              : action.type === page.update.type
                ? 'update todo'
                : 'delete todo';
        return defer(() => {
          switch (action.type) {
            case page.load.type:
              return forkJoin({
                summary: this.data.getSummary(),
                todos: this.data.getTodos(),
              }).pipe(
                map(({ summary, todos }) =>
                  api.loaded({ message: summary.message, todos }),
                ),
              );
            case page.create.type:
              return this.data
                .createTodo({ title: action.title.trim() })
                .pipe(map((todo) => api.created({ todo })));
            case page.update.type:
              return this.data
                .updateTodo(action.id, action.input)
                .pipe(map((todo) => api.updated({ todo })));
            case page.delete.type:
              return this.data
                .deleteTodo(action.id)
                .pipe(map(() => api.deleted({ id: action.id })));
          }
        }).pipe(
          catchError(() =>
            of(
              api.failed({
                error: `Unable to ${operation}. Please try again.`,
              }),
            ),
          ),
          startWith(api.started()),
        );
      }),
    ),
  );
}
