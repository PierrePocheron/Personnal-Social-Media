// 📁 src/app/components/add-data-card/forms/add-relation-form.component.ts

import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-add-relation-form',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <form (ngSubmit)="submit()" class="flex flex-col gap-3">
      <label>
        🧍 Source ID :
        <input [(ngModel)]="source" name="source" required class="input" />
      </label>
      <label>
        🧍 Cible ID :
        <input [(ngModel)]="target" name="target" required class="input" />
      </label>
      <label>
        🧩 Type de relation :
        <input [(ngModel)]="type" name="type" required class="input" />
      </label>
      <label>
        🗣️ Contexte :
        <input [(ngModel)]="context" name="context" class="input" />
      </label>
      <button type="submit" class="btn">➕ Ajouter la relation</button>
    </form>
  `,
})
export class AddRelationFormComponent {
  private http = inject(HttpClient);

  source = '';
  target = '';
  type = '';
  context = '';

  submit() {
    this.http.post('http://localhost:8080/api/relations', {
      sourcePersonId: this.source,
      targetPersonId: this.target,
      type: this.type,
      context: this.context,
    }).subscribe(() => {
      alert('✅ Relation ajoutée !');
      this.source = '';
      this.target = '';
      this.type = '';
      this.context = '';
    });
  }
}
