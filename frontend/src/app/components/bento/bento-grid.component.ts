import { Component } from '@angular/core';
import { UserCardComponent } from '@src/app/components/user-card/user-card.component';

@Component({
  selector: 'app-bento-grid',
  standalone: true,
  imports: [UserCardComponent],
  templateUrl: './bento-grid.component.html',
  styleUrls: ['./bento-grid.component.scss'],
})
export class BentoGridComponent {}
