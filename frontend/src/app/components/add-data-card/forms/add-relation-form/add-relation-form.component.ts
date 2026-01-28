import { Component, inject, OnInit, computed, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ToastService } from '@app/services/toast.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { GraphReloadService } from '@src/app/services/graph-reload.service';
import { FocusedPersonService } from '@src/app/services/focused-person.service';
import { FancySelectComponent, FancySelectOption } from '@src/app/components/shared/fancy-select/fancy-select.component';

interface Person {
  id: string;
  firstName: string;
  lastName: string;
}

@Component({
  selector: 'app-add-relation-form',
  templateUrl: './add-relation-form.component.html',
  styleUrls: ['./add-relation-form.component.scss'],
  standalone: true,
  imports: [CommonModule, FormsModule, FancySelectComponent],
})
export class AddRelationFormComponent implements OnInit {
  private http = inject(HttpClient);
  private toast = inject(ToastService);
  private graphReload = inject(GraphReloadService);
  private focusedPersonService = inject(FocusedPersonService);

  persons = signal<Person[]>([]);
  sourceId = signal<string>('');
  targetId = signal<string>('');
  type = signal<string>('');
  context = signal<string>('');
  loading = signal<boolean>(false);

  sourceOptions = computed<FancySelectOption[]>(() => {
    return this.persons().map(p => ({
      label: `${p.firstName} ${p.lastName}`,
      value: p.id,
    }));
  });

  targetOptions = computed<FancySelectOption[]>(() => {
    const focusedId = this.focusedPersonService.focusedPersonId() ?? '';
    return this.persons()
      .filter(p => p.id !== focusedId)
      .map(p => ({
        label: `${p.firstName} ${p.lastName}`,
        value: p.id,
      }));
  });

  ngOnInit() {
    this.http.get<Person[]>('http://localhost:8080/api/persons').subscribe({
      next: (data) => {
        this.persons.set(data);

        const focusedId = this.focusedPersonService.focusedPersonId() ?? '';
        if (focusedId) {
          this.sourceId.set(focusedId);
        }
      },
      error: () => this.toast.error('❌ Erreur lors du chargement des personnes'),
    });
  }

  submit() {
    if (!this.sourceId() || !this.targetId() || !this.type().trim()) return;

    this.loading.set(true);
    this.http.post('http://localhost:8080/api/relations', {
      sourcePersonId: this.sourceId(),
      targetPersonId: this.targetId(),
      type: this.type(),
      context: this.context(),
    }).subscribe({
      next: () => {
        this.toast.success('✅ Relation ajoutée !');
        this.sourceId.set('');
        this.targetId.set('');
        this.type.set('');
        this.context.set('');
        this.graphReload.triggerReload();
      },
      error: () => this.toast.error('❌ Erreur lors de l’ajout'),
      complete: () => this.loading.set(false),
    });
  }
}
