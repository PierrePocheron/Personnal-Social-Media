import { Component, Input } from '@angular/core';
import { Person, Participation } from '@src/app/models/person.model';

@Component({
  selector: 'app-user-card',
  standalone: true,
  templateUrl: './user-card.component.html',
  styleUrls: ['./user-card.component.scss'],
})
export class UserCardComponent {
  @Input() user!: Person;

  get initials(): string {
    const first = this.user.firstName?.[0] || '';
    const last = this.user.lastName?.[0] || '';
    return `${first}${last}`.toUpperCase();
  }

  get averageNote(): number | string {
    const participations = this.user.participations ?? [];
    if (participations.length === 0) return '-';

    const total = participations
      .map((p: Participation) => p.note)
      .reduce((a: number, b: number) => a + b, 0);

    return Math.round(total / participations.length);
  }
}
