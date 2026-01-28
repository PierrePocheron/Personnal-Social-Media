import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-loading-spinner',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="flex flex-col items-center justify-center p-8 gap-4 h-full w-full">
      <div class="relative w-12 h-12">
        <div class="absolute inset-0 border-4 border-indigo-500/30 rounded-full"></div>
        <div class="absolute inset-0 border-4 border-indigo-500/80 rounded-full border-t-transparent animate-spin"></div>
      </div>
      <span *ngIf="message" class="text-sm text-slate-400 font-medium animate-pulse">
        {{ message }}
      </span>
    </div>
  `
})
export class LoadingSpinnerComponent {
  @Input() message: string = 'Chargement...';
}
