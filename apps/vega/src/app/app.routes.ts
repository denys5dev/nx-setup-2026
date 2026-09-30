import { Routes } from '@angular/router';

export const appRoutes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: 'dashboard' },
  {
    path: 'dashboard',
    loadChildren: () =>
      import('@celestial/vega/dashboard/feature').then(
        (m) => m.dashboardRoutes,
      ),
  },
];
