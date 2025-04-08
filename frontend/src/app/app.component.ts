import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet],
  template: `
    <main class="min-h-screen bg-gray-100 p-4">
      <router-outlet></router-outlet>
    </main>
  `
})
export class AppComponent {}
