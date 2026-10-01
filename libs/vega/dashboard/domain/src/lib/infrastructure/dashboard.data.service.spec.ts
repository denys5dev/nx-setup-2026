import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import {
  HttpTestingController,
  provideHttpClientTesting,
} from '@angular/common/http/testing';
import { DashboardDataService } from './dashboard.data.service';

describe(DashboardDataService.name, () => {
  let data: DashboardDataService;
  let http: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting()],
    });
    data = TestBed.inject(DashboardDataService);
    http = TestBed.inject(HttpTestingController);
  });

  afterEach(() => http.verify());

  it('when getSummary is subscribed to, should fetch the summary', () => {
    const received = vi.fn();

    data.getSummary().subscribe(received);
    http
      .expectOne({ method: 'GET', url: '/api/dashboard' })
      .flush({ message: 'Welcome' });

    expect(received).toHaveBeenCalledWith({ message: 'Welcome' });
  });

  it('when getTodos is subscribed to, should fetch todos', () => {
    const received = vi.fn();

    data.getTodos().subscribe(received);
    http.expectOne({ method: 'GET', url: '/api/dashboard/todos' }).flush([]);

    expect(received).toHaveBeenCalledWith([]);
  });

  it('when createTodo is subscribed to, should post the create input', () => {
    const input = { title: 'Plan' };

    data.createTodo(input).subscribe();
    const request = http.expectOne({
      method: 'POST',
      url: '/api/dashboard/todos',
    });
    request.flush({ id: 'one', ...input, completed: false });

    expect(request.request.body).toEqual(input);
  });

  it('when updateTodo is subscribed to, should patch the update input', () => {
    const input = { completed: false };

    data.updateTodo('one', input).subscribe();
    const request = http.expectOne({
      method: 'PATCH',
      url: '/api/dashboard/todos/one',
    });
    request.flush({ id: 'one', title: 'Plan', ...input });

    expect(request.request.body).toEqual(input);
  });

  it('when deleteTodo is subscribed to, should delete the todo by id', () => {
    const received = vi.fn();

    data.deleteTodo('one').subscribe(received);
    http
      .expectOne({ method: 'DELETE', url: '/api/dashboard/todos/one' })
      .flush(null, { status: 204, statusText: 'No Content' });

    expect(received).toHaveBeenCalledOnce();
  });
});
