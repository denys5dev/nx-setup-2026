import { Component, inject, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import {
  DashboardPageActions,
  selectDashboardModel,
} from '@celestial/vega/dashboard/domain';
import { Dashboard } from '@celestial/vega/dashboard/ui/dashboard';

@Component({
  selector: 'v-dashboard-page',
  imports: [Dashboard],
  templateUrl: './dashboard-page.html',
})
export class DashboardPage implements OnInit {
  protected readonly store = inject(Store);
  protected readonly model = this.store.selectSignal(selectDashboardModel);
  protected readonly actions = DashboardPageActions;

  ngOnInit(): void {
    this.store.dispatch(DashboardPageActions.load());
  }
}
