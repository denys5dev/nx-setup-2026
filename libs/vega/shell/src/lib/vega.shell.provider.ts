import { provideHttpClient } from '@angular/common/http';
import { provideBrowserGlobalErrorListeners } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideState, provideStore } from '@ngrx/store';
import { provideEffects } from '@ngrx/effects';
import { themeFeature } from './store/theme.state';
import { ThemeEffects } from './store/theme.effects';
import { vegaShellRoutes } from './vega-shell.routes';

export const vegaShellProviders = [
  provideStore(),
  provideState(themeFeature),
  provideEffects(ThemeEffects),
  provideHttpClient(),
  provideBrowserGlobalErrorListeners(),
  provideRouter(vegaShellRoutes),
];
