import { TestBed } from '@angular/core/testing';
import {
  DashboardPageActions,
  type DashboardView,
} from '@celestial/vega/dashboard/domain';
import { Dashboard } from './dashboard';

const view: DashboardView = {
  message: 'Welcome',
  loaded: true,
  pending: false,
  error: null,
  newTitle: '',
  editingId: null,
  editTitle: '',
  todos: [{ id: 'one', title: 'Plan release', completed: false }],
  remaining: 1,
};

function render(overrides: Partial<DashboardView> = {}) {
  TestBed.configureTestingModule({ imports: [Dashboard] });
  const fixture = TestBed.createComponent(Dashboard);
  fixture.componentRef.setInput('view', { ...view, ...overrides });
  fixture.detectChanges();
  return fixture;
}

describe('Dashboard', () => {
  it('renders the supplied summary', () => {
    const fixture = render();

    const element: HTMLElement = fixture.nativeElement;

    expect(element.querySelector('[role="status"]')?.textContent).toContain(
      'Welcome',
    );
  });

  it('renders the supplied todo', () => {
    const fixture = render();

    const element: HTMLElement = fixture.nativeElement;

    expect(element.querySelector('.todo-title')?.textContent).toContain(
      'Plan release',
    );
  });

  it('renders the supplied error', () => {
    const fixture = render({ error: 'Unavailable' });

    const element: HTMLElement = fixture.nativeElement;

    expect(element.querySelector('[role="alert"]')?.textContent).toContain(
      'Unavailable',
    );
  });

  it('emits create without changing the supplied draft', () => {
    const fixture = render({ newTitle: 'Draft' });
    const emitted = vi.fn();
    fixture.componentInstance.action.subscribe(emitted);

    fixture.nativeElement
      .querySelector('form')
      .dispatchEvent(new Event('submit', { bubbles: true, cancelable: true }));

    expect(emitted).toHaveBeenCalledWith(
      DashboardPageActions.create({ title: 'Draft' }),
    );
  });
});
