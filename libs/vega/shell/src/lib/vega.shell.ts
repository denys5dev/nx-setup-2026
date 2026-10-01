import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'v-shell',
  imports: [RouterOutlet],
  templateUrl: './vega-shell.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class VegaShell {}
