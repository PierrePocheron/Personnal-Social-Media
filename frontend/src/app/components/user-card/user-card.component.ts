import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-user-card',
  standalone: true,
  templateUrl: './user-card.component.html',
  styleUrls: ['./user-card.component.scss']
})
export class UserCardComponent {
  @Input() name: string = 'Pedro';
  @Input() job: string = 'Développeur Fullstack';
  @Input() company: string = 'Pedro Corp';
  @Input() email: string = 'pierre@example.com';
  @Input() phone: string = '+33612345678';
}
