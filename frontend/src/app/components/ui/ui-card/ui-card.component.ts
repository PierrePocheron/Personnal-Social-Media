import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-ui-card',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="glass-panel rounded-2xl p-6 h-full animate-fade-in" [ngClass]="customClass">
      <ng-content></ng-content>
    </div>
  `
})
export class UiCardComponent {
  @Input() customClass: string = '';
}
