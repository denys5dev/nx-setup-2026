import { Component, input, output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { TODO_TITLE_MAX_LENGTH } from '@celestial/shared/dashboard/contracts';
import type {
  Todo,
  UpdateTodoInput,
} from '@celestial/shared/dashboard/contracts';
import { Button } from '@celestial/shared/ui/design-system';
import type { DashboardView } from './dashboard-view';

@Component({
  selector: 'v-dashboard',
  imports: [FormsModule, Button],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.scss',
})
export class Dashboard {
  readonly view = input.required<DashboardView>();
  readonly refreshRequested = output<void>();
  readonly newTitleChanged = output<string>();
  readonly editTitleChanged = output<string>();
  readonly editRequested = output<Todo>();
  readonly editCancelled = output<void>();
  readonly todoCreated = output<string>();
  readonly todoUpdated = output<{ id: string; input: UpdateTodoInput }>();
  readonly todoDeleted = output<string>();
  protected readonly titleMaxLength = TODO_TITLE_MAX_LENGTH;
}
