import { TestBed } from '@angular/core/testing';
import type { DashboardView } from './dashboard-view';
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

describe(Dashboard.name, () => {
  it('when a summary is supplied, should render the summary', () => {
    const fixture = render();

    const element: HTMLElement = fixture.nativeElement;

    expect(element.querySelector('[role="status"]')?.textContent).toContain(
      'Welcome',
    );
  });

  it('when a todo is supplied, should render the todo', () => {
    const fixture = render();

    const element: HTMLElement = fixture.nativeElement;

    expect(
      element.querySelector('.dashboard__todo-title')?.textContent,
    ).toContain('Plan release');
  });

  it('when an error is supplied, should render the error', () => {
    const fixture = render({ error: 'Unavailable' });

    const element: HTMLElement = fixture.nativeElement;

    expect(element.querySelector('[role="alert"]')?.textContent).toContain(
      'Unavailable',
    );
  });

  it('when the form is submitted, should emit the supplied draft', () => {
    const fixture = render({ newTitle: 'Draft' });
    const emitted = vi.fn();
    fixture.componentInstance.todoCreated.subscribe(emitted);

    fixture.nativeElement
      .querySelector('form')
      .dispatchEvent(new Event('submit', { bubbles: true, cancelable: true }));

    expect(emitted).toHaveBeenCalledWith('Draft');
  });
});
