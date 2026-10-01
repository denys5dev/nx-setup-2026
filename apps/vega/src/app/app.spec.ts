import { TestBed } from '@angular/core/testing';
import {
  HttpTestingController,
  provideHttpClientTesting,
} from '@angular/common/http/testing';
import { provideRouter, Router } from '@angular/router';
import { App } from './app';
import { appConfig } from './app.config';

describe(App.name, () => {
  it('when the root route is opened, should render the dashboard inside the Vega shell', async () => {
    TestBed.configureTestingModule({
      imports: [App],
      providers: [...appConfig.providers, provideHttpClientTesting()],
    });

    const fixture = TestBed.createComponent(App);
    fixture.detectChanges();
    const router = TestBed.inject(Router);
    await router.navigateByUrl('/');
    await fixture.whenStable();

    const http = TestBed.inject(HttpTestingController);
    http.expectOne('/api/dashboard').flush({ message: 'Shell dashboard' });
    http.expectOne('/api/dashboard/todos').flush([]);
    await fixture.whenStable();

    expect(router.url).toBe('/dashboard');
    expect(
      (fixture.nativeElement as HTMLElement).querySelector(
        'v-shell v-dashboard-page',
      )?.textContent,
    ).toContain('Shell dashboard');
    http.verify();
  });

  it('when App is rendered, should provide the route outlet', async () => {
    TestBed.configureTestingModule({
      imports: [App],
      providers: [provideRouter([])],
    });

    const fixture = TestBed.createComponent(App);
    await fixture.whenStable();

    expect(
      (fixture.nativeElement as HTMLElement).querySelector('router-outlet'),
    ).not.toBeNull();
  });
});
