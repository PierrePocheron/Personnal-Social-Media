import { ApplicationConfig, importProvidersFrom, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
import { routes } from './app.routes';
import { provideHttpClient } from '@angular/common/http';
import { provideClientHydration } from '@angular/platform-browser';
import { provideAnimations } from '@angular/platform-browser/animations';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations'; // ✅ Obligatoire pour ngx-toastr
import { ToastrModule } from 'ngx-toastr';

import { LucideAngularModule, LucideIconProvider, LUCIDE_ICONS, Home, Activity, Calendar, Settings, Database } from 'lucide-angular';


export const appConfig: ApplicationConfig = {
  providers: [
    provideHttpClient(),
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    provideClientHydration(),
    provideAnimations(),

    importProvidersFrom(BrowserAnimationsModule),
    importProvidersFrom(ToastrModule.forRoot({
      timeOut: 3000,
      positionClass: 'toast-bottom-right',
      preventDuplicates: true,
    })),
    { provide: LUCIDE_ICONS, multi: true, useValue: new LucideIconProvider({ Home, Activity, Calendar, Settings, Database }) }
  ]
};
