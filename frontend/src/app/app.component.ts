import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet], // ✅ Importation explicite de RouterOutlet
  template: `
    <nav>
      <a routerLink="/">Home</a> |
      <a routerLink="/profile">Profile</a>
    </nav>

    <router-outlet></router-outlet>
  `,
})
export class AppComponent {}
