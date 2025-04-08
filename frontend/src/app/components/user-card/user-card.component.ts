import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Person } from '@src/app/models/person.model';
import { PersonService } from '@src/app/services/person.service';

@Component({
  selector: 'app-user-card',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './user-card.component.html',
})
export class UserCardComponent implements OnInit {
  me: Person | null = null;

  constructor(private personService: PersonService) {}

  ngOnInit(): void {
    this.personService.getMe().subscribe((data) => {
      this.me = data;
    });
  }
}
