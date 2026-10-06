import { Injectable, signal } from '@angular/core';

export type ToastType = 'success' | 'error' | 'info';

export interface ToastData {
  message: string;
  type: ToastType;
}

@Injectable({
  providedIn: 'root',
})
export class ToastService {
  readonly toast = signal<ToastData | null>(null);
  private timer: ReturnType<typeof setTimeout> | undefined;

  show(message: string, type: ToastType = 'info'): void {
    this.toast.set({ message, type });
    clearTimeout(this.timer);
    this.timer = setTimeout(() => this.toast.set(null), 10000);
  }

  dismiss(): void {
    clearTimeout(this.timer);
    this.toast.set(null);
  }
}
