import { Component, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Button } from '@celestial/shared/ui/design-system';
import { Store } from '@ngrx/store';
import { ThemeActions, themeFeature } from './store/theme.state';

@Component({
  selector: 'v-shell',
  imports: [RouterOutlet, Button],
  templateUrl: './vega-shell.html',
  styleUrl: './vega-shell.scss',
})
export class VegaShell {
  protected readonly store = inject(Store);
  protected readonly theme = this.store.selectSignal(themeFeature.selectMode);

  toggleTheme(): void {
    this.store.dispatch(ThemeActions.toggled());
  }
}
