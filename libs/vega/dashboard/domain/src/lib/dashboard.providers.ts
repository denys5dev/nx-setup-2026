import { provideState } from '@ngrx/store';
import { provideEffects } from '@ngrx/effects';
import { dashboardFeature } from './store/dashboard.reducer';
import { DashboardEffects } from './store/dashboard.effects';

export const dashboardDomainProviders = [
  provideState(dashboardFeature),
  provideEffects(DashboardEffects),
];
