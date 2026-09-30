import { Component, input, output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import {
  DashboardPageActions,
  type DashboardPageAction,
  type DashboardView,
} from '@celestial/vega/dashboard/domain';
import { TODO_TITLE_MAX_LENGTH } from '@celestial/shared/dashboard/contracts';
import { Button } from '@celestial/shared/ui/design-system';

@Component({
  selector: 'v-dashboard',
  imports: [FormsModule, Button],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.scss',
})
export class Dashboard {
  readonly view = input.required<DashboardView>();
  readonly action = output<DashboardPageAction>();
  protected readonly actions = DashboardPageActions;
  protected readonly titleMaxLength = TODO_TITLE_MAX_LENGTH;
}
