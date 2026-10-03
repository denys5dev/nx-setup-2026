import { TestBed } from '@angular/core/testing';
import { provideMockActions } from '@ngrx/effects/testing';
import { Subject, of, throwError, type Subscription } from 'rxjs';
import type { Action } from '@ngrx/store';
import type { Todo } from '@celestial/shared/dashboard/contracts';
import { DashboardEffects } from './dashboard.effects';
import { DashboardService } from '../application/dashboard.service';
import {
  DashboardApiActions as api,
  DashboardPageActions as page,
} from './dashboard.actions';

const todo = { id: 'one', title: 'Plan', completed: false };

describe(DashboardEffects.name, () => {
  let actions: Subject<Action>;
  let received: Action[];
  let subscription: Subscription;
  let data: {
    load: ReturnType<typeof vi.fn>;
    createTodo: ReturnType<typeof vi.fn>;
    updateTodo: ReturnType<typeof vi.fn>;
    deleteTodo: ReturnType<typeof vi.fn>;
  };

  beforeEach(() => {
    actions = new Subject<Action>();
    received = [];
    data = {
      load: vi.fn(() => of({ message: 'Welcome', todos: [todo] })),
      createTodo: vi.fn(() => of(todo)),
      updateTodo: vi.fn(() => of({ ...todo, completed: true })),
      deleteTodo: vi.fn(() => of(undefined)),
    };
    TestBed.configureTestingModule({
      providers: [
        DashboardEffects,
        provideMockActions(() => actions),
        { provide: DashboardService, useValue: data },
      ],
    });
    subscription = TestBed.inject(DashboardEffects).request.subscribe(
      (action) => received.push(action),
    );
  });

  afterEach(() => subscription.unsubscribe());

  it('when load is dispatched, should emit the loaded summary and todos', () => {
    actions.next(page.load());

    expect(received).toEqual([
      api.started(),
      api.loaded({ message: 'Welcome', todos: [todo] }),
    ]);
  });

  it('when create is dispatched, should emit the created todo', () => {
    actions.next(page.create({ title: 'Plan' }));

    expect(received).toEqual([api.started(), api.created({ todo })]);
  });

  it('when create is dispatched with surrounding whitespace, should pass the title to the application service', () => {
    actions.next(page.create({ title: ' Plan ' }));

    expect(data.createTodo).toHaveBeenCalledWith({ title: ' Plan ' });
  });

  it('when update is dispatched, should emit the updated todo', () => {
    actions.next(page.update({ id: 'one', input: { completed: true } }));

    expect(received).toEqual([
      api.started(),
      api.updated({ todo: { ...todo, completed: true } }),
    ]);
  });

  it('when update is dispatched, should pass the id and input to the application service', () => {
    actions.next(page.update({ id: 'one', input: { completed: false } }));

    expect(data.updateTodo).toHaveBeenCalledWith('one', { completed: false });
  });

  it('when delete is dispatched, should emit the deleted todo id', () => {
    actions.next(page.delete({ id: 'one' }));

    expect(received).toEqual([api.started(), api.deleted({ id: 'one' })]);
  });

  it('when creating a todo fails, should emit a request failure', () => {
    data.createTodo.mockReturnValue(throwError(() => new Error('Offline')));

    actions.next(page.create({ title: 'Plan' }));

    expect(received).toEqual([
      api.started(),
      api.failed({ error: 'Unable to create todo. Please try again.' }),
    ]);
  });

  it('when create is dispatched after a failure, should emit the created todo', () => {
    data.createTodo.mockReturnValueOnce(throwError(() => new Error('Offline')));
    actions.next(page.create({ title: 'Plan' }));
    received.length = 0;

    actions.next(page.create({ title: 'Plan' }));

    expect(received).toEqual([api.started(), api.created({ todo })]);
  });

  it('when a request is pending, should ignore overlapping requests', () => {
    const response = new Subject<{ message: string; todos: Todo[] }>();
    data.load.mockReturnValue(response);
    actions.next(page.load());

    actions.next(page.create({ title: 'Plan' }));

    expect(data.createTodo).not.toHaveBeenCalled();
  });
});
