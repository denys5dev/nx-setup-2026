import { Routes } from '@angular/router';

export const vegaShellRoutes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: 'dashboard' },
  {
    path: 'dashboard',
    loadChildren: () =>
      import('@celestial/vega/dashboard/shell').then(
        (m) => m.dashboardShellRoutes,
      ),
  },
];
