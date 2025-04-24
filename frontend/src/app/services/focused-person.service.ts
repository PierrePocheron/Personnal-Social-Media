import { Injectable, effect, signal } from "@angular/core";
import { Person } from "@src/app/models/person.model";
import { PersonService } from "@src/app/services/person.service";

@Injectable({ providedIn: "root" })
export class FocusedPersonService {
  private storageKey = "focusedPersonId";
  private personIdSignal = signal<string | null>(this.loadFromStorage());
  private personSignal = signal<Person | null>(null); // 👈 la personne entière

  constructor(private personService: PersonService) {
    const initialId = this.loadFromStorage();

  if (initialId) {
    console.log('✅ [FocusedPersonService] ID trouvé dans le localStorage :', initialId);
    this.personIdSignal.set(initialId);
  } else {
    console.log('🔍 [FocusedPersonService] Aucun ID trouvé. On va chercher l’utilisateur principal...');
    this.personService.getMainUser().subscribe({
      next: (person) => {
        console.log('✅ [FocusedPersonService] Utilisateur principal trouvé :', person);
        this.setFocusedPersonId(person.id!);
      },
      error: () => {
        console.warn('⚠️ Aucun utilisateur principal trouvé dans la BDD.');
        this.clear();
      },
    });
  }

    // 🔁 charge la personne centrée automatiquement quand l’ID change
  effect(() => {
    const id = this.personIdSignal();
    if (!id) return;
    this.personService.getPersonById(id).subscribe({
      next: (person) => this.personSignal.set(person),
      error: () => this.personSignal.set(null),
    });
  });
  }

  private loadFromStorage(): string | null {
    return localStorage.getItem(this.storageKey);
  }

  get focusedPersonId() {
    console.log('🎯 [FocusedPersonService] get focusedPersonId :', this.personIdSignal);
    return this.personIdSignal;
  }

  get focusedPerson() {
    console.log('🎯 [FocusedPersonService] get focusedPerson :', this.personSignal);
    return this.personSignal; // 👈 getter pour la personne complète
  }

  setFocusedPersonId(id: string) {
    console.log('🎯 [FocusedPersonService] Mise à jour de l’ID centré :', id);
    this.personIdSignal.set(id);
    localStorage.setItem(this.storageKey, id);
  }

  clear() {
    this.personIdSignal.set(null);
    localStorage.removeItem(this.storageKey);
    this.personSignal.set(null);
  }
}
