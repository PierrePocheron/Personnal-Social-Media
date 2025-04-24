import { Component, computed, Injector, inject, signal, effect, ViewChild, HostListener, ElementRef, AfterViewInit, runInInjectionContext } from '@angular/core';
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
  private injector = inject(Injector);



  persons = signal<Person[]>([]);
  dropdownOpen = signal(false);
  search = signal('');
  highlightedIndex = signal(0);

  @ViewChild('searchInput') searchInputRef!: ElementRef<HTMLInputElement>;
  @ViewChild('dropdownContainer') dropdownContainerRef!: ElementRef;

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent) {
    const target = event.target as HTMLElement;
    if (this.dropdownOpen() && this.dropdownContainerRef && !this.dropdownContainerRef.nativeElement.contains(target)) {
      this.dropdownOpen.set(false);
    }
  }

  ngAfterViewInit(): void {
    runInInjectionContext(this.injector, () => {
      effect(() => {
        if (this.dropdownOpen()) {
          setTimeout(() => this.searchInputRef?.nativeElement?.focus(), 0);
        }
      });
    });
  }

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
    console.log('🟢 toggleDropdown appelé');
    this.dropdownOpen.update((v) => !v);
    this.highlightedIndex.set(0);
    this.search.set('');
  }

  filteredPersons = computed(() => {
    const searchLower = this.search().toLowerCase();
    return this.persons().filter((p) => {
      const full = `${p.firstName} ${p.lastName} ${p.nickname ?? ''}`.toLowerCase();
      return full.includes(searchLower);
    });
  });



  selectPerson(id: string | undefined) {
    if (!id) return;
    this.focusedPersonService.setFocusedPersonId(id);
    this.dropdownOpen.set(false);
  }

  handleKeydown(event: KeyboardEvent) {
    const total = this.filteredPersons().length;
    const index = this.highlightedIndex();

    if (event.key === 'Escape') {
      this.dropdownOpen.set(false);
      event.preventDefault();
    } else if (event.key === 'ArrowDown') {
      this.highlightedIndex.set((index + 1) % total);
      event.preventDefault();
    } else if (event.key === 'ArrowUp') {
      this.highlightedIndex.set((index - 1 + total) % total);
      event.preventDefault();
    } else if (event.key === 'Enter') {
      this.selectPerson(this.filteredPersons()[index]?.id);
      event.preventDefault();
    }
  }

  get searchValue(): string {
    return this.search();
  }

  set searchValue(value: string) {
    this.search.set(value);
  }


  get initials(): string {
    const person = this.user();
    const first = person?.firstName?.[0] || '';
    const last = person?.lastName?.[0] || '';
    return `${first}${last}`.toUpperCase();
  }
}
