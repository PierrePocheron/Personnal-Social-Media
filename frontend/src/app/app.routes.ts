import { Routes } from '@angular/router';
import { HomeComponent } from '@pages/home/home.component';

export const routes: Routes = [
  { path: '', component: HomeComponent },
  // TODO: Create/Import these components
  { path: 'graph', component: HomeComponent }, // Placeholder - should be GraphComponent
  { path: 'calendar', component: HomeComponent }, // Placeholder - should be CalendarComponent
  { path: 'data', component: HomeComponent }, // Placeholder - should be DataComponent
  { path: 'settings', component: HomeComponent } // Placeholder - should be SettingsComponent
];
