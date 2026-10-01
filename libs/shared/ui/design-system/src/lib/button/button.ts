import { Component, input } from '@angular/core';

@Component({
  selector: 'ds-button',
  imports: [],
  templateUrl: './button.html',
  styleUrl: './button.scss',
})
export class Button {
  readonly disabled = input(false);
  readonly pressed = input<boolean | null>(null);
  readonly variant = input<'primary' | 'secondary'>('primary');
  readonly type = input<'button' | 'submit' | 'reset'>('button');
}
