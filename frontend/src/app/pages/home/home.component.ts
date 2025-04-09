import { Component } from '@angular/core';
import { MainLayoutComponent } from '@app/layouts/main-layout/main-layout.component';
import { BentoGridComponent } from '@app/components/bento/bento-grid.component';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [MainLayoutComponent, BentoGridComponent],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent {}
