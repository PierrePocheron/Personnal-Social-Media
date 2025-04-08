import { Component } from '@angular/core';
import { MainLayoutComponent } from '@app/layouts/main-layout/main-layout.component';
import { BentoGridComponent } from '@app/components/bento/bento-grid.component';
import { UserCardComponent } from '@src/app/components/user-card/user-card.component';
import { Person } from '@src/app/models/person.model'; // ✅ le modèle d'utilisateur

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [MainLayoutComponent, BentoGridComponent],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent {
  user: Person = {
    id: '123',
    firstName: 'Pierre',
    lastName: 'Pocheron',
    nickname: 'Pedro',
    email: 'pierre@example.com',
    phoneNumber: '+33612345678',
    job: 'Développeur Fullstack',
    company: 'Pedro Corp'
  };
}
