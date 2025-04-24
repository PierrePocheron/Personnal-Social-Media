import { Component, computed, effect, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UserCardComponent } from '@app/components/user-card/user-card.component';
import { StatsCardComponent } from '@app/components/stats-card/stats-card.component';
import { LifeGraphCardComponent } from '../life-graph-card/life-graph-card.component';
import { AddDataCardComponent } from '@app/components/add-data-card/add-data-card.component';

import { PersonService } from '@app/services/person.service';
import { StatsService } from '@app/services/stats.service';
import { FocusedPersonService } from '@app/services/focused-person.service';

import { Person } from '@app/models/person.model';
import { MeStats } from '@app/models/me-stats.model';

@Component({
  selector: 'app-bento-grid',
  standalone: true,
  imports: [CommonModule, UserCardComponent, StatsCardComponent, LifeGraphCardComponent, AddDataCardComponent],
  templateUrl: './bento-grid.component.html',
  styleUrls: ['./bento-grid.component.scss'],
})
export class BentoGridComponent {
  private personService = inject(PersonService);
  private statsService = inject(StatsService);
  private focusedService = inject(FocusedPersonService);

  private userSignal = signal<Person | null>(null);
  private statsSignal = signal<MeStats | null>(null);

  user = computed(() => this.userSignal());
  stats = computed(() => this.statsSignal());

  constructor() {
    effect(() => {
      const personId = this.focusedService.focusedPersonId();
      console.log('📍 [BentoGrid] ID centré reçu :', personId);

      if (!personId) {
        this.userSignal.set(null);
        this.statsSignal.set(null);
        return;
      }

      this.personService.getPersonById(personId).subscribe({
        next: (user) => {
          console.log('✅ [BentoGrid] Utilisateur chargé :', user);
          this.userSignal.set(user);
        },
        error: () => {
          console.warn('❌ [BentoGrid] Échec du chargement utilisateur');
          this.userSignal.set(null);
        },
      });

      this.statsService.getStats().subscribe({
        next: (stats) => {
          console.log('✅ [BentoGrid] Stats chargé :', stats);
          this.statsSignal.set(stats);
        },
        error: () => {
          console.warn('❌ [BentoGrid] Échec du chargement des stats');
          this.statsSignal.set(null);
        },
      });
    });
  }
}
