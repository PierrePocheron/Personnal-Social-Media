import { Component, computed, effect, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UserCardComponent } from '@app/components/user-card/user-card.component';
import { StatsCardComponent } from '@app/components/stats-card/stats-card.component';
import { PersonService } from '@app/services/person.service';
import { StatsService } from '@app/services/stats.service';
import { Person } from '@app/models/person.model';
import { MeStats } from '@app/models/me-stats.model';

@Component({
  selector: 'app-bento-grid',
  standalone: true,
  imports: [CommonModule, UserCardComponent, StatsCardComponent],
  templateUrl: './bento-grid.component.html',
  styleUrls: ['./bento-grid.component.scss'],
})
export class BentoGridComponent {
  private personService = inject(PersonService);
  private statsService = inject(StatsService);

  private userSignal = signal<Person | null>(null);
  private statsSignal = signal<MeStats | null>(null);

  user = computed(() => this.userSignal());
  stats = computed(() => this.statsSignal());

  constructor() {
    effect(() => {
      this.personService.getMe().subscribe((user) => this.userSignal.set(user));
      this.statsService.getStats().subscribe((stats) => this.statsSignal.set(stats));
    });
  }
}
