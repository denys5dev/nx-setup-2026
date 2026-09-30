import { TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { Dashboard } from '@celestial/vega/dashboard/ui/dashboard';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import {
  DashboardPageActions,
  selectDashboardView,
} from '@celestial/vega/dashboard/domain';
import { DashboardPage } from './dashboard-page';

function render() {
  TestBed.configureTestingModule({
    imports: [DashboardPage],
    providers: [
      provideMockStore({
        selectors: [
          {
            selector: selectDashboardView,
            value: {
              message: '',
              loaded: false,
              pending: false,
              error: null,
              newTitle: '',
              editingId: null,
              editTitle: '',
              todos: [],
              remaining: 0,
            },
          },
        ],
      }),
    ],
  });
  const dispatch = vi.spyOn(TestBed.inject(MockStore), 'dispatch');
  const fixture = TestBed.createComponent(DashboardPage);

  fixture.detectChanges();

  return { fixture, dispatch };
}

describe('DashboardPage', () => {
  it('requests the dashboard on entry', () => {
    const { dispatch } = render();

    expect(dispatch).toHaveBeenCalledWith(DashboardPageActions.load());
  });

  const todo = { id: 'one', title: 'Plan', completed: false };
  const update = { id: todo.id, input: { completed: true } };

  it.each([
    [
      'refresh',
      (ui: Dashboard) => ui.refreshRequested.emit(),
      DashboardPageActions.load(),
    ],
    [
      'new draft',
      (ui: Dashboard) => ui.newTitleChanged.emit('Draft'),
      DashboardPageActions.newTitleChanged({ title: 'Draft' }),
    ],
    [
      'edit draft',
      (ui: Dashboard) => ui.editTitleChanged.emit('Rename'),
      DashboardPageActions.editTitleChanged({ title: 'Rename' }),
    ],
    [
      'edit',
      (ui: Dashboard) => ui.editRequested.emit(todo),
      DashboardPageActions.edit({ todo }),
    ],
    [
      'cancel edit',
      (ui: Dashboard) => ui.editCancelled.emit(),
      DashboardPageActions.cancelEdit(),
    ],
    [
      'create',
      (ui: Dashboard) => ui.todoCreated.emit('Draft'),
      DashboardPageActions.create({ title: 'Draft' }),
    ],
    [
      'update',
      (ui: Dashboard) => ui.todoUpdated.emit(update),
      DashboardPageActions.update(update),
    ],
    [
      'delete',
      (ui: Dashboard) => ui.todoDeleted.emit(todo.id),
      DashboardPageActions.delete({ id: todo.id }),
    ],
  ] as const)('maps the %s intention to a store action', (_, emit, action) => {
    const { fixture, dispatch } = render();
    const ui: Dashboard = fixture.debugElement.query(
      By.directive(Dashboard),
    ).componentInstance;
    dispatch.mockClear();

    emit(ui);

    expect(dispatch.mock.calls).toEqual([[action]]);
  });
});
