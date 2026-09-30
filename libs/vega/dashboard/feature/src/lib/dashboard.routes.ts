import { Routes } from '@angular/router';
import { dashboardDomainProviders } from '@celestial/vega/dashboard/domain';
import { DashboardPage } from './dashboard-page';

export const dashboardRoutes: Routes = [
  {
    path: '',
    component: DashboardPage,
    providers: dashboardDomainProviders,
  },
];
