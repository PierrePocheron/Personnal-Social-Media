import { Component, inject, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ToastService } from '@app/services/toast.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { GraphReloadService } from '@src/app/services/graph-reload.service';


interface Person {
  id: string;
  firstName: string;
  lastName: string;
}

@Component({
  selector: 'app-add-relation-form',
  templateUrl: './add-relation-form.component.html',
  styleUrls: ['./add-relation-form.component.scss'],
  imports: [CommonModule, FormsModule],
})
export class AddRelationFormComponent implements OnInit {
  private http = inject(HttpClient);
  private toast = inject(ToastService);
  private graphReload = inject(GraphReloadService)

  persons: Person[] = [];
  sourceId = '';
  targetId = '';
  type = '';
  context = '';
  loading = false;

  ngOnInit() {
    this.http.get<Person[]>('http://localhost:8080/api/persons')
      .subscribe({
        next: (data) => this.persons = data,
        error: () => this.toast.error('❌ Erreur lors du chargement des personnes'),
      });
  }

  submit() {
    if (!this.sourceId || !this.targetId || !this.type.trim()) return;

    this.loading = true;
    this.http.post('http://localhost:8080/api/relations', {
      sourcePersonId: this.sourceId,
      targetPersonId: this.targetId,
      type: this.type,
      context: this.context,
    }).subscribe({
      next: () => {
        this.toast.success('✅ Relation ajoutée !');
        this.sourceId = '';
        this.targetId = '';
        this.type = '';
        this.context = '';
        this.graphReload.triggerReload();
      },
      error: () => this.toast.error('❌ Erreur lors de l’ajout'),
      complete: () => this.loading = false,
    });
  }
}
