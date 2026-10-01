import { provideHttpClient } from '@angular/common/http';
import { provideBrowserGlobalErrorListeners } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideStore } from '@ngrx/store';
import { vegaShellRoutes } from './vega-shell.routes';

export const vegaShellProviders = [
  provideStore(),
  provideHttpClient(),
  provideBrowserGlobalErrorListeners(),
  provideRouter(vegaShellRoutes),
];
