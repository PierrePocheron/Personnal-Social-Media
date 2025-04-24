import { Component, computed, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Person } from '@src/app/models/person.model';
import { FocusedPersonService } from '@src/app/services/focused-person.service';

@Component({
  selector: 'app-user-card',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './user-card.component.html',
  styleUrls: ['./user-card.component.scss'],
})
export class UserCardComponent {
  private focusedPersonService = inject(FocusedPersonService);
  

  user = computed(() => {
    const data = this.focusedPersonService.focusedPerson() ?? null;
    console.log('👤 [UserCardComponent] Données utilisateur centrée :', data);
    return data;
  });

  get initials(): string {
    const person = this.user();
    const first = person?.firstName?.[0] || '';
    const last = person?.lastName?.[0] || '';
    return `${first}${last}`.toUpperCase();
  }
}
