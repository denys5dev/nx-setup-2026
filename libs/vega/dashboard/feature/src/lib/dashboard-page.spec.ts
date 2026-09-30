import { TestBed } from '@angular/core/testing';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import {
  DashboardPageActions,
  selectDashboardView,
} from '@celestial/vega/dashboard/domain';
import { DashboardPage } from './dashboard-page';

describe('DashboardPage', () => {
  it('requests the dashboard on entry', () => {
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

    expect(dispatch).toHaveBeenCalledWith(DashboardPageActions.load());
  });
});
