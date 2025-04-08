import { Component } from '@angular/core';
import { UserCardComponent } from '@src/app/components/user-card/user-card.component';

@Component({
  selector: 'app-bento-grid',
  standalone: true,
  imports: [UserCardComponent],
  templateUrl: './bento-grid.component.html',
  styleUrls: ['./bento-grid.component.scss'],
})
export class BentoGridComponent {
  user = {
    firstName: 'Pierre',
    lastName: 'Pocheron',
    nickname: 'Pedro',
    job: 'Développeur Fullstack',
    company: 'Pedro Corp',
    email: 'pierre@example.com',
    phoneNumber: '06 12 34 56 78',
    relations: [],
    participations: [],
  };

}
