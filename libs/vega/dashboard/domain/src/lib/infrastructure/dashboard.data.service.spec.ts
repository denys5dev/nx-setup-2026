import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import {
  HttpTestingController,
  provideHttpClientTesting,
} from '@angular/common/http/testing';
import { DashboardDataService } from './dashboard.data.service';

describe('DashboardDataService', () => {
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

  it('loads the summary', () => {
    const received = vi.fn();

    data.getSummary().subscribe(received);
    http
      .expectOne({ method: 'GET', url: '/api/dashboard' })
      .flush({ message: 'Welcome' });

    expect(received).toHaveBeenCalledWith({ message: 'Welcome' });
  });

  it('loads todos', () => {
    const received = vi.fn();

    data.getTodos().subscribe(received);
    http.expectOne({ method: 'GET', url: '/api/dashboard/todos' }).flush([]);

    expect(received).toHaveBeenCalledWith([]);
  });

  it('posts the create input', () => {
    const input = { title: 'Plan' };

    data.createTodo(input).subscribe();
    const request = http.expectOne({
      method: 'POST',
      url: '/api/dashboard/todos',
    });
    request.flush({ id: 'one', ...input, completed: false });

    expect(request.request.body).toEqual(input);
  });

  it('patches the update input', () => {
    const input = { completed: false };

    data.updateTodo('one', input).subscribe();
    const request = http.expectOne({
      method: 'PATCH',
      url: '/api/dashboard/todos/one',
    });
    request.flush({ id: 'one', title: 'Plan', ...input });

    expect(request.request.body).toEqual(input);
  });

  it('deletes by id', () => {
    const received = vi.fn();

    data.deleteTodo('one').subscribe(received);
    http
      .expectOne({ method: 'DELETE', url: '/api/dashboard/todos/one' })
      .flush(null, { status: 204, statusText: 'No Content' });

    expect(received).toHaveBeenCalledOnce();
  });
});
