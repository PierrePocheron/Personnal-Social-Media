import { Component, importProvidersFrom } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { LucideAngularModule } from 'lucide-angular';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive, LucideAngularModule],
  providers: [],
  template: `
    <aside class="w-20 h-screen glass border-r-0 flex flex-col items-center py-8 gap-8 fixed left-0 top-0 z-50">
      <!-- Logo -->
      <div class="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-lg shadow-indigo-500/20 mb-4">
        <span class="text-white font-bold text-lg">M</span>
      </div>

      <!-- Nav Items -->
      <nav class="flex flex-col gap-6 w-full px-2">
        <a routerLink="/" routerLinkActive="active" [routerLinkActiveOptions]="{exact: true}" class="nav-item group">
          <lucide-icon name="home" class="w-6 h-6 text-slate-300 group-hover:text-white transition-colors"></lucide-icon>
          <div class="tooltip">Home</div>
        </a>

        <a routerLink="/graph" routerLinkActive="active" class="nav-item group">
          <lucide-icon name="activity" class="w-6 h-6 text-slate-300 group-hover:text-white transition-colors"></lucide-icon>
          <div class="tooltip">Graph</div>
        </a>

        <a routerLink="/calendar" routerLinkActive="active" class="nav-item group">
          <lucide-icon name="calendar" class="w-6 h-6 text-slate-300 group-hover:text-white transition-colors"></lucide-icon>
          <div class="tooltip">Life</div>
        </a>

        <div class="h-px w-8 bg-white/10 mx-auto my-2"></div>

        <a routerLink="/data" routerLinkActive="active" class="nav-item group">
          <lucide-icon name="database" class="w-6 h-6 text-slate-300 group-hover:text-white transition-colors"></lucide-icon>
          <div class="tooltip">Data</div>
        </a>
      </nav>

      <!-- Bottom -->
      <div class="mt-auto">
        <button class="nav-item group">
          <lucide-icon name="settings" class="w-6 h-6 text-slate-300 group-hover:text-white transition-colors"></lucide-icon>
        </button>
      </div>
    </aside>
  `,
  styles: [`
    .nav-item {
      @apply w-12 h-12 rounded-xl flex items-center justify-center transition-all duration-300 relative mx-auto;
    }
    .nav-item:hover {
      @apply bg-white/5;
    }
    .nav-item.active {
      @apply bg-indigo-500/20 text-indigo-400 shadow-[0_0_20px_rgba(99,102,241,0.3)];
    }
    .nav-item.active lucide-icon {
      @apply text-indigo-400;
    }

    .tooltip {
      @apply absolute left-14 bg-glass-panel px-3 py-1 rounded-lg text-xs text-white opacity-0 translate-x-[-10px] pointer-events-none transition-all duration-200 border border-white/10 whitespace-nowrap;
    }
    .nav-item:hover .tooltip {
      @apply opacity-100 translate-x-0;
    }
  `]
})
export class SidebarComponent {}
