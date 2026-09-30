import { Routes } from '@angular/router';
import { dashboardDomainProviders } from '@celestial/vega/dashboard/domain';
import { DashboardPage } from '@celestial/vega/dashboard/feature/dashboard-page';

export const dashboardShellRoutes: Routes = [
  {
    path: '',
    component: DashboardPage,
    providers: dashboardDomainProviders,
  },
];
