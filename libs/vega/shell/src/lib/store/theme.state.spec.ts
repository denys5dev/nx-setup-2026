import { ThemeActions, themeFeature } from './theme.state';

describe('theme reducer', () => {
  it('when no state exists, should default to light', () => {
    expect(themeFeature.reducer(undefined, { type: 'unknown' })).toEqual({
      mode: 'light',
    });
  });

  it('when initialized is received, should restore the selected theme', () => {
    expect(
      themeFeature.reducer(
        undefined,
        ThemeActions.initialized({ mode: 'dark' }),
      ),
    ).toEqual({ mode: 'dark' });
  });

  it.each([
    ['light', 'dark'],
    ['dark', 'light'],
  ] as const)('when %s is toggled, should switch to %s', (mode, expected) => {
    expect(themeFeature.reducer({ mode }, ThemeActions.toggled())).toEqual({
      mode: expected,
    });
  });
});
