import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MeStats } from '@src/app/models/me-stats.model';

@Component({
  selector: 'app-stats-card',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './stats-card.component.html',
  styleUrls: ['./stats-card.component.scss'],
})
export class StatsCardComponent {
  @Input() stats!: MeStats;
}
