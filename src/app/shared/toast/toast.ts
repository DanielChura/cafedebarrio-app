import { Component, inject } from '@angular/core';
import { ToastService, ToastType } from '../../core/services/toast';

@Component({
  selector: 'app-toast',
  templateUrl: './toast.html',
})
export class Toast {
  private readonly toastService = inject(ToastService);

  readonly toast = this.toastService.toast;

  bgClass(type: ToastType): string {
    switch (type) {
      case 'success':
        return 'bg-emerald-500';
      case 'error':
        return 'bg-red-500';
      default:
        return 'bg-blue-500';
    }
  }
}
