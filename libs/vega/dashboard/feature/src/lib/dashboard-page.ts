import { Component, inject, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import {
  DashboardPageActions,
  selectDashboardView,
} from '@celestial/vega/dashboard/domain';
import { Dashboard } from './dashboard';

@Component({
  selector: 'v-dashboard-page',
  imports: [Dashboard],
  template: '<v-dashboard [view]="view()" (action)="store.dispatch($event)" />',
})
export class DashboardPage implements OnInit {
  protected readonly store = inject(Store);
  protected readonly view = this.store.selectSignal(selectDashboardView);

  ngOnInit(): void {
    this.store.dispatch(DashboardPageActions.load());
  }
}
