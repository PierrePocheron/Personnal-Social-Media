import { Injectable, signal } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class GraphReloadService {
  private reloadSignal = signal(0);

  triggerReload() {
    this.reloadSignal.update((v) => v + 1);
  }

  onReload() {
    return this.reloadSignal;
  }
}
