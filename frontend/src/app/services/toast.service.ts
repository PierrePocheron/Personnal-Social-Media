import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class ToastService {
  success(message: string) {
    alert('✅ ' + message); // 💡 Remplace par une vraie lib plus tard
  }

  error(message: string) {
    alert('❌ ' + message);
  }
}
