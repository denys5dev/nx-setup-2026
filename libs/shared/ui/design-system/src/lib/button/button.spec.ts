import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Button } from './button';

describe('Button', () => {
  let fixture: ComponentFixture<Button>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Button],
    }).compileComponents();

    fixture = TestBed.createComponent(Button);
    await fixture.whenStable();
  });

  it('renders a native disabled button', () => {
    fixture.componentRef.setInput('disabled', true);
    fixture.detectChanges();

    expect(
      (fixture.nativeElement as HTMLElement).querySelector('button')?.disabled,
    ).toBe(true);
  });
});
