import { TestBed } from '@angular/core/testing';
import { provideMockActions } from '@ngrx/effects/testing';
import { Subject, of, throwError, type Subscription } from 'rxjs';
import type { Action } from '@ngrx/store';
import type { Todo } from '@celestial/shared/dashboard/contracts';
import { DashboardEffects } from './dashboard.effects';
import { DashboardDataService } from '../infrastructure/dashboard.data.service';
import {
  DashboardApiActions as api,
  DashboardPageActions as page,
} from './dashboard.actions';

const todo = { id: 'one', title: 'Plan', completed: false };

describe('DashboardEffects', () => {
  let actions: Subject<Action>;
  let received: Action[];
  let subscription: Subscription;
  let data: {
    getSummary: ReturnType<typeof vi.fn>;
    getTodos: ReturnType<typeof vi.fn>;
    createTodo: ReturnType<typeof vi.fn>;
    updateTodo: ReturnType<typeof vi.fn>;
    deleteTodo: ReturnType<typeof vi.fn>;
  };

  beforeEach(() => {
    actions = new Subject<Action>();
    received = [];
    data = {
      getSummary: vi.fn(() => of({ message: 'Welcome' })),
      getTodos: vi.fn(() => of([todo])),
      createTodo: vi.fn(() => of(todo)),
      updateTodo: vi.fn(() => of({ ...todo, completed: true })),
      deleteTodo: vi.fn(() => of(undefined)),
    };
    TestBed.configureTestingModule({
      providers: [
        DashboardEffects,
        provideMockActions(() => actions),
        { provide: DashboardDataService, useValue: data },
      ],
    });
    subscription = TestBed.inject(DashboardEffects).request.subscribe(
      (action) => received.push(action),
    );
  });

  afterEach(() => subscription.unsubscribe());

  it('loads summary and todos', () => {
    actions.next(page.load());

    expect(received).toEqual([
      api.started(),
      api.loaded({ message: 'Welcome', todos: [todo] }),
    ]);
  });

  it('creates a todo', () => {
    actions.next(page.create({ title: 'Plan' }));

    expect(received).toEqual([api.started(), api.created({ todo })]);
  });

  it('trims the new title before transport', () => {
    actions.next(page.create({ title: ' Plan ' }));

    expect(data.createTodo).toHaveBeenCalledWith({ title: 'Plan' });
  });

  it('updates a todo', () => {
    actions.next(page.update({ id: 'one', input: { completed: true } }));

    expect(received).toEqual([
      api.started(),
      api.updated({ todo: { ...todo, completed: true } }),
    ]);
  });

  it('passes the update id and input to infrastructure', () => {
    actions.next(page.update({ id: 'one', input: { completed: false } }));

    expect(data.updateTodo).toHaveBeenCalledWith('one', { completed: false });
  });

  it('deletes a todo', () => {
    actions.next(page.delete({ id: 'one' }));

    expect(received).toEqual([api.started(), api.deleted({ id: 'one' })]);
  });

  it('reports a failed request', () => {
    data.createTodo.mockReturnValue(throwError(() => new Error('Offline')));

    actions.next(page.create({ title: 'Plan' }));

    expect(received).toEqual([
      api.started(),
      api.failed({ error: 'Unable to create todo. Please try again.' }),
    ]);
  });

  it('continues listening after a failure', () => {
    data.createTodo.mockReturnValueOnce(throwError(() => new Error('Offline')));
    actions.next(page.create({ title: 'Plan' }));
    received.length = 0;

    actions.next(page.create({ title: 'Plan' }));

    expect(received).toEqual([api.started(), api.created({ todo })]);
  });

  it('ignores overlapping requests while the dashboard is busy', () => {
    const response = new Subject<Todo[]>();
    data.getTodos.mockReturnValue(response);
    actions.next(page.load());

    actions.next(page.create({ title: 'Plan' }));

    expect(data.createTodo).not.toHaveBeenCalled();
  });
});
