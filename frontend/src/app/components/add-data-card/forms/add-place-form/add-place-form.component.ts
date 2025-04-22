import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { ToastService } from '@app/services/toast.service';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-add-place-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule],
  templateUrl: './add-place-form.component.html',
})
export class AddPlaceFormComponent {
  private fb = inject(FormBuilder);
  private http = inject(HttpClient);
  private toast = inject(ToastService);

  form: FormGroup = this.fb.group({
    name: ['', Validators.required],
    categories: [''],
  });

  onSubmit() {
    if (this.form.invalid) {
      this.toast.error('Le formulaire est invalide.');
      return;
    }

    const payload = {
      name: this.form.value.name,
      categories: this.form.value.categories
        .split(',')
        .map((c: string) => c.trim())
        .filter((c: string) => !!c),
    };

    this.http.post('/api/places', payload).subscribe({
      next: () => {
        this.toast.success('📍 Lieu ajouté avec succès !');
        this.form.reset();
      },
      error: () => {
        this.toast.error('Erreur lors de l’ajout du lieu.');
      },
    });
  }
}
