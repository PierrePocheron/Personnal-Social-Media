import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AddPersonFormComponent } from './forms/add-person-form/add-person-form.component';
import { AddRelationFormComponent } from './forms/add-relation-form/add-relation-form.component';
import { AddEventFormComponent } from './forms/add-event-form/add-event-form.component';
import { AddPlaceFormComponent } from './forms/add-place-form/add-place-form.component';

@Component({
  selector: 'app-add-data-card',
  standalone: true,
  imports: [
    CommonModule,
    AddPersonFormComponent,
    AddRelationFormComponent,
    AddEventFormComponent,
    AddPlaceFormComponent,
  ],
  templateUrl: './add-data-card.component.html',
  styleUrls: ['./add-data-card.component.scss'],
})
export class AddDataCardComponent {}
