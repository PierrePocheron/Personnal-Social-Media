import { Component } from '@angular/core';
import { bootstrapApplication } from '@angular/platform-browser';

@Component({
  selector: 'app-root',
  template: `
    <div class="min-h-screen bg-gray-100 flex items-center justify-center">
      <div class="bg-white p-8 rounded-lg shadow-md">
        <h1 class="text-3xl font-bold text-gray-900 mb-4">Hello from {{ name }}!</h1>
        <a 
          target="_blank" 
          href="https://angular.dev/overview"
          class="text-blue-600 hover:text-blue-800 underline"
        >
          Learn more about Angular
        </a>
      </div>
    </div>
  `,
})
export class App {
  name = 'Angular';
}

bootstrapApplication(App);