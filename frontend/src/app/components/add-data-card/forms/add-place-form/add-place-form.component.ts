// 📁 src/app/components/add-data-card/forms/add-place-form.component.ts

import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-add-place-form',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <form (ngSubmit)="submit()" class="flex flex-col gap-3">
      <label>
        🏠 Nom du lieu :
        <input [(ngModel)]="name" name="name" required class="input" />
      </label>
      <label>
        🏷️ Catégories (séparées par des virgules) :
        <input [(ngModel)]="categories" name="categories" class="input" />
      </label>
      <button type="submit" class="btn">➕ Ajouter le lieu</button>
    </form>
  `,
})
export class AddPlaceFormComponent {
  private http = inject(HttpClient);

  name = '';
  categories = '';

  submit() {
    const catArray = this.categories.split(',').map(c => c.trim()).filter(Boolean);

    this.http.post('http://localhost:8080/api/places', {
      name: this.name,
      categories: catArray,
    }).subscribe(() => {
      alert('✅ Lieu ajouté !');
      this.name = '';
      this.categories = '';
    });
  }
}
