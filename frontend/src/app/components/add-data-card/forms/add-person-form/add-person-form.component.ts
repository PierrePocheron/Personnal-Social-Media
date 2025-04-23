import { Component, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ToastService } from '@app/services/toast.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { GraphReloadService } from '@src/app/services/graph-reload.service';

@Component({
  selector: 'app-add-person-form',
  templateUrl: './add-person-form.component.html',
  styleUrls: ['./add-person-form.component.scss'],
  imports: [CommonModule, FormsModule],
})
export class AddPersonFormComponent {
  private http = inject(HttpClient);
  private toast = inject(ToastService);
  private graphReload = inject(GraphReloadService)

  firstName = '';
  lastName = '';
  loading = false;

  submit() {
    if (!this.firstName.trim() || !this.lastName.trim()) return;

    this.loading = true;
    this.http.post('http://localhost:8080/api/persons', {
      firstName: this.firstName,
      lastName: this.lastName,
    }).subscribe({
      next: () => {
        this.toast.success('✅ Personne ajoutée !');
        this.firstName = '';
        this.lastName = '';
        this.graphReload.triggerReload();
      },
      error: () => this.toast.error('❌ Erreur lors de l’ajout'),
      complete: () => this.loading = false,
    });
  }
}
