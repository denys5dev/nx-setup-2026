import { DOCUMENT, Injectable, inject } from '@angular/core';
import {
  Actions,
  createEffect,
  ofType,
  type OnInitEffects,
} from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { tap, withLatestFrom } from 'rxjs';
import { LocalStorageService } from '../infrastructure/local-storage.service';
import { ThemeActions, themeFeature } from './theme.state';

@Injectable()
export class ThemeEffects implements OnInitEffects {
  readonly #actions = inject(Actions);
  readonly #store = inject(Store);
  readonly #storage = inject(LocalStorageService);
  readonly #document = inject(DOCUMENT);

  readonly applyTheme = createEffect(
    () =>
      this.#actions.pipe(
        ofType(ThemeActions.initialized, ThemeActions.toggled),
        withLatestFrom(this.#store.select(themeFeature.selectMode)),
        tap(([action, mode]) => {
          this.#document.documentElement.dataset['theme'] = mode;
          if (action.type === ThemeActions.toggled.type) {
            this.#storage.set('vega-theme', mode);
          }
        }),
      ),
    { dispatch: false },
  );

  ngrxOnInitEffects(): ReturnType<typeof ThemeActions.initialized> {
    const saved = this.#storage.get('vega-theme');
    const mode =
      saved === 'light' || saved === 'dark'
        ? saved
        : this.#document.defaultView?.matchMedia?.(
              '(prefers-color-scheme: dark)',
            ).matches
          ? 'dark'
          : 'light';
    return ThemeActions.initialized({ mode });
  }
}
