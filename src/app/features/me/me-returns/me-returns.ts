import { CurrencyPipe, DatePipe } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ReturnResponse } from '../../../core/models';
import { ReturnService } from '../../../core/services/return';
import { getReturnStatusClass, getReturnStatusLabel } from '../../../core/utils/status';
import { CalendarIcon } from '../../../shared/icons/calendar-icon';
import { ReturnIcon } from '../../../shared/icons/return-icon';

@Component({
  selector: 'app-me-returns',
  standalone: true,
  imports: [CurrencyPipe, DatePipe, RouterLink, ReturnIcon, CalendarIcon],
  templateUrl: './me-returns.html',
})
export class MeReturns {
  private readonly returnService = inject(ReturnService);

  readonly returns = signal<ReturnResponse[]>([]);
  readonly loading = signal(true);
  readonly error = signal(false);

  readonly getStatusLabel = getReturnStatusLabel;
  readonly getStatusClass = getReturnStatusClass;

  constructor() {
    this.loadReturns();
  }

  loadReturns(): void {
    this.loading.set(true);
    this.returnService.findMyReturns({ size: 100 }).subscribe({
      next: (page) => {
        this.returns.set(page.content);
        this.loading.set(false);
      },
      error: () => {
        this.loading.set(false);
        this.error.set(true);
      },
    });
  }

}
