import {
  createActionGroup,
  createFeature,
  createReducer,
  emptyProps,
  on,
  props,
} from '@ngrx/store';

export type Theme = 'light' | 'dark';

export const ThemeActions = createActionGroup({
  source: 'Theme',
  events: {
    Initialized: props<{ mode: Theme }>(),
    Toggled: emptyProps(),
  },
});

export const themeFeature = createFeature({
  name: 'theme',
  reducer: createReducer(
    { mode: 'light' as Theme },
    on(ThemeActions.initialized, (_state, { mode }) => ({ mode })),
    on(ThemeActions.toggled, ({ mode }) => ({
      mode: mode === 'dark' ? ('light' as const) : ('dark' as const),
    })),
  ),
});
