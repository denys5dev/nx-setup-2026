import { provideStore } from '@ngrx/store';
import { provideHttpClient } from '@angular/common/http';
import {
  ApplicationConfig,
  provideBrowserGlobalErrorListeners,
} from '@angular/core';
import { provideRouter } from '@angular/router';
import { appRoutes } from './app.routes';

export const appConfig: ApplicationConfig = {
  providers: [
    provideStore(),
    provideHttpClient(),
    provideBrowserGlobalErrorListeners(),
    provideRouter(appRoutes),
  ],
};
