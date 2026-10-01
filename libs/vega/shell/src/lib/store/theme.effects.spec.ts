import { DOCUMENT } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { provideEffects } from '@ngrx/effects';
import { provideState, provideStore, Store } from '@ngrx/store';
import { ThemeEffects } from './theme.effects';
import { ThemeActions, themeFeature } from './theme.state';

describe(ThemeEffects.name, () => {
  beforeEach(() => localStorage.removeItem('vega-theme'));

  afterEach(() => {
    TestBed.resetTestingModule();
    vi.restoreAllMocks();
    localStorage.removeItem('vega-theme');
    delete document.documentElement.dataset['theme'];
  });

  function initialize(prefersDark = false, hasWindow = true) {
    TestBed.configureTestingModule({
      providers: [
        {
          provide: DOCUMENT,
          useValue: {
            documentElement: document.documentElement,
            defaultView: hasWindow
              ? {
                  localStorage,
                  matchMedia: (query: string) => ({
                    matches:
                      query === '(prefers-color-scheme: dark)' && prefersDark,
                  }),
                }
              : null,
          },
        },
        provideStore(),
        provideState(themeFeature),
        provideEffects(ThemeEffects),
      ],
    });
    return TestBed.inject(Store);
  }

  it.each([
    ['light', true, 'light'],
    ['dark', false, 'dark'],
    [null, true, 'dark'],
    [null, false, 'light'],
    ['invalid', true, 'dark'],
    ['invalid', false, 'light'],
  ] as const)(
    'when saved theme is %s and system dark mode is %s, should apply %s',
    (saved, prefersDark, expected) => {
      if (saved !== null) localStorage.setItem('vega-theme', saved);

      const store = initialize(prefersDark);

      expect({
        mode: store.selectSignal(themeFeature.selectMode)(),
        applied: document.documentElement.dataset['theme'],
      }).toEqual({ mode: expected, applied: expected });
    },
  );

  it('when initialized from system preference, should leave the saved preference unset', () => {
    initialize(true);

    expect(localStorage.getItem('vega-theme')).toBeNull();
  });

  it('when toggled twice, should apply and persist each selected theme', () => {
    const store = initialize();

    const modes = ['dark', 'light'].map(() => {
      store.dispatch(ThemeActions.toggled());
      return [
        document.documentElement.dataset['theme'],
        localStorage.getItem('vega-theme'),
      ];
    });

    expect(modes).toEqual([
      ['dark', 'dark'],
      ['light', 'light'],
    ]);
  });

  it('when storage reads are blocked, should use the system theme', () => {
    vi.spyOn(Storage.prototype, 'getItem').mockImplementation(() => {
      throw new DOMException('Blocked', 'SecurityError');
    });

    initialize(true);

    expect(document.documentElement.dataset['theme']).toBe('dark');
  });

  it('when storage writes are blocked, should continue applying theme changes', () => {
    vi.spyOn(Storage.prototype, 'setItem').mockImplementation(() => {
      throw new DOMException('Full', 'QuotaExceededError');
    });
    const store = initialize();

    store.dispatch(ThemeActions.toggled());

    expect(document.documentElement.dataset['theme']).toBe('dark');
  });

  it('when no browser window exists, should initialize and toggle without storage', () => {
    const store = initialize(false, false);

    store.dispatch(ThemeActions.toggled());

    expect(document.documentElement.dataset['theme']).toBe('dark');
  });
});
