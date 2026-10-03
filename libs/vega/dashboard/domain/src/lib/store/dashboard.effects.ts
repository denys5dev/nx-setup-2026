import { Injectable, inject } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { catchError, defer, exhaustMap, map, of, startWith } from 'rxjs';
import { DashboardService } from '../application/dashboard.service';
import {
  DashboardApiActions as api,
  DashboardPageActions as page,
} from './dashboard.actions';

@Injectable()
export class DashboardEffects {
  private readonly actions = inject(Actions);
  private readonly dashboard = inject(DashboardService);

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
              return this.dashboard
                .load()
                .pipe(map((result) => api.loaded(result)));
            case page.create.type:
              return this.dashboard
                .createTodo({ title: action.title })
                .pipe(map((todo) => api.created({ todo })));
            case page.update.type:
              return this.dashboard
                .updateTodo(action.id, action.input)
                .pipe(map((todo) => api.updated({ todo })));
            case page.delete.type:
              return this.dashboard
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
