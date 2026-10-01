import { Routes } from '@angular/router';
import { VegaShell } from './vega.shell';

export const vegaShellRoutes: Routes = [
  {
    path: '',
    component: VegaShell,
    children: [
      { path: '', pathMatch: 'full', redirectTo: 'dashboard' },
      {
        path: 'dashboard',
        loadChildren: () =>
          import('@celestial/vega/dashboard/shell').then(
            (m) => m.dashboardShellRoutes,
          ),
      },
    ],
  },
];
