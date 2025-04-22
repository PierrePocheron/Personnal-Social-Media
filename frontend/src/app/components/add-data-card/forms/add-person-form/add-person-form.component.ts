// 📁 src/app/components/add-data-card/forms/add-person-form.component.ts

import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-add-person-form',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <form (ngSubmit)="submit()" class="flex flex-col gap-3">
      <label>
        👤 Prénom :
        <input [(ngModel)]="firstName" name="firstName" required class="input" />
      </label>
      <label>
        👤 Nom :
        <input [(ngModel)]="lastName" name="lastName" required class="input" />
      </label>
      <button type="submit" class="btn">➕ Ajouter la personne</button>
    </form>
  `,
})
export class AddPersonFormComponent {
  private http = inject(HttpClient);

  firstName = '';
  lastName = '';

  submit() {
    this.http.post('http://localhost:8080/api/persons', {
      firstName: this.firstName,
      lastName: this.lastName,
    }).subscribe(() => {
      alert('✅ Personne ajoutée !');
      this.firstName = '';
      this.lastName = '';
    });
  }
}
