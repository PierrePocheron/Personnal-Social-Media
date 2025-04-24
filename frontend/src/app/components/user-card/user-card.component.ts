import { Component, computed, inject, signal, effect } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Person } from '@app/models/person.model';
import { FocusedPersonService } from '@app/services/focused-person.service';
import { PersonService } from '@app/services/person.service';
import { FormsModule } from '@angular/forms';


@Component({
  selector: 'app-user-card',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './user-card.component.html',
  styleUrls: ['./user-card.component.scss'],
})
export class UserCardComponent {
  private focusedPersonService = inject(FocusedPersonService);
  private personService = inject(PersonService);


  persons = signal<Person[]>([]);
  dropdownOpen = signal(false);
  search = signal('');


  user = computed(() => {
    const data = this.focusedPersonService.focusedPerson() ?? null;
    console.log('👤 [UserCardComponent] Données utilisateur centrée :', data);
    return data;
  });

  constructor() {
    this.personService.getAll().subscribe({
      next: (data) => {
        const sorted = [...data].sort((a, b) =>
          ((a.lastName ?? '') + (a.firstName ?? '')).localeCompare(
            (b.lastName ?? '') + (b.firstName ?? '')
          )
        );

        this.persons.set(sorted);
      },
    });
  }


  toggleDropdown() {
    this.dropdownOpen.update((v) => !v);
  }

  filteredPersons = computed(() => {
    const searchLower = this.search().toLowerCase();
    return this.persons().filter((p) => {
      const full = `${p.firstName} ${p.lastName} ${p.nickname ?? ''}`.toLowerCase();
      return full.includes(searchLower);
    });
  });



  selectPerson(id: string) {
    this.focusedPersonService.setFocusedPersonId(id);
    this.dropdownOpen.set(false);
  }


  get initials(): string {
    const person = this.user();
    const first = person?.firstName?.[0] || '';
    const last = person?.lastName?.[0] || '';
    return `${first}${last}`.toUpperCase();
  }
}
