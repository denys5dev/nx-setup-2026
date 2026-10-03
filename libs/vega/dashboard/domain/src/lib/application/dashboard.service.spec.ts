import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import {
  HttpTestingController,
  provideHttpClientTesting,
} from '@angular/common/http/testing';
import { DashboardService } from './dashboard.service';

describe(DashboardService.name, () => {
  let service: DashboardService;
  let http: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting()],
    });
    service = TestBed.inject(DashboardService);
    http = TestBed.inject(HttpTestingController);
  });

  afterEach(() => http.verify());

  it('when load is called, should combine the summary and todos', () => {
    const received = vi.fn();
    const todo = { id: 'one', title: 'Plan', completed: false };

    service.load().subscribe(received);
    http.expectOne('/api/dashboard').flush({ message: 'Welcome' });
    http.expectOne('/api/dashboard/todos').flush([todo]);

    expect(received).toHaveBeenCalledWith({
      message: 'Welcome',
      todos: [todo],
    });
  });

  it('when createTodo receives surrounding whitespace, should send a trimmed title', () => {
    service.createTodo({ title: ' Plan ' }).subscribe();
    const request = http.expectOne({
      method: 'POST',
      url: '/api/dashboard/todos',
    });
    request.flush({ id: 'one', title: 'Plan', completed: false });

    expect(request.request.body).toEqual({ title: 'Plan' });
  });

  it('when loading the summary fails, should propagate the failure', () => {
    const received = vi.fn();
    service.load().subscribe({ error: received });
    const summary = http.expectOne('/api/dashboard');
    http.expectOne('/api/dashboard/todos');

    summary.flush(null, { status: 500, statusText: 'Server error' });

    expect(received).toHaveBeenCalledWith(
      expect.objectContaining({ status: 500 }),
    );
  });
});
