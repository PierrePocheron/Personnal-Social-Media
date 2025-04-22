// 📁 src/app/components/add-data-card/forms/add-event-form.component.ts

import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-add-event-form',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <form (ngSubmit)="submit()" class="flex flex-col gap-3">
      <label>
        📝 Titre :
        <input [(ngModel)]="title" name="title" required class="input" />
      </label>
      <label>
        📅 Type :
        <input [(ngModel)]="type" name="type" required class="input" />
      </label>
      <label>
        📍 Lieu :
        <input [(ngModel)]="location" name="location" class="input" />
      </label>
      <label>
        🧾 Description :
        <textarea [(ngModel)]="description" name="description" class="input"></textarea>
      </label>
      <label>
        📆 Date :
        <input type="date" [(ngModel)]="date" name="date" required class="input" />
      </label>
      <button type="submit" class="btn">➕ Ajouter l'événement</button>
    </form>
  `,
})
export class AddEventFormComponent {
  private http = inject(HttpClient);

  title = '';
  type = '';
  location = '';
  description = '';
  date = '';

  submit() {
    this.http.post('http://localhost:8080/api/events', {
      title: this.title,
      type: this.type,
      location: this.location,
      description: this.description,
      startDate: this.date,
      endDate: this.date,
      participants: [],
    }).subscribe(() => {
      alert('✅ Événement ajouté !');
      this.title = '';
      this.type = '';
      this.location = '';
      this.description = '';
      this.date = '';
    });
  }
}
