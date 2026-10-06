import { CurrencyPipe, DatePipe } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import { NonNullableFormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ReturnResponse, ReturnStatus } from '../../../core/models';
import { ReturnService } from '../../../core/services/return';
import { ToastService } from '../../../core/services/toast';
import { getReturnStatusClass, getReturnStatusLabel } from '../../../core/utils/status';

const NEXT_STATES: Record<ReturnStatus, ReturnStatus[]> = {
  REQUESTED: ['IN_REVIEW'],
  IN_REVIEW: ['APPROVED', 'REJECTED'],
  APPROVED: ['COMPLETED'],
  REJECTED: [],
  COMPLETED: [],
};

@Component({
  selector: 'app-admin-returns',
  imports: [ReactiveFormsModule, CurrencyPipe, DatePipe],
  templateUrl: './admin-returns.html',
})
export class AdminReturns {
  private readonly returns = inject(ReturnService);
  private readonly toast = inject(ToastService);
  private readonly fb = inject(NonNullableFormBuilder);

  readonly items = signal<ReturnResponse[]>([]);
  readonly loading = signal(true);
  readonly error = signal(false);
  readonly selected = signal<ReturnResponse | null>(null);
  readonly detailLoading = signal(false);
  readonly saving = signal(false);

  readonly getStatusLabel = getReturnStatusLabel;
  readonly getStatusClass = getReturnStatusClass;

  readonly form = this.fb.group({
    status: ['', Validators.required],
    operatorNote: ['', [Validators.required, Validators.maxLength(500)]],
  });

  constructor() {
    this.load();
  }

  load(): void {
    this.loading.set(true);
    this.error.set(false);
    this.returns.findAll({ size: 50 }).subscribe({
      next: (page) => {
        this.items.set(page.content);
        this.loading.set(false);
      },
      error: () => {
        this.loading.set(false);
        this.error.set(true);
      },
    });
  }

  nextStates(status: ReturnStatus): ReturnStatus[] {
    return NEXT_STATES[status] ?? [];
  }

  openDetail(item: ReturnResponse): void {
    this.detailLoading.set(true);
    this.returns.findById(item.id).subscribe({
      next: (detail) => {
        this.items.update((list) => list.map((i) => (i.id === detail.id ? detail : i)));
        this.selected.set(detail);
        this.form.reset({ status: '', operatorNote: detail.operatorNote ?? '' });
        this.detailLoading.set(false);
      },
      error: () => {
        this.detailLoading.set(false);
        this.toast.show('No pudimos cargar el detalle de la devolución.', 'error');
      },
    });
  }

  closeDetail(): void {
    this.selected.set(null);
  }

  submitStatus(): void {
    const detail = this.selected();
    if (!detail) return;
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const raw = this.form.getRawValue();
    this.saving.set(true);
    this.returns
      .updateStatus(detail.id, {
        status: raw.status as ReturnStatus,
        operatorNote: raw.operatorNote.trim(),
      })
      .subscribe({
        next: (updated) => {
          this.saving.set(false);
          this.items.update((list) => list.map((i) => (i.id === updated.id ? updated : i)));
          this.selected.set(updated);
          this.form.reset({ status: '', operatorNote: updated.operatorNote ?? '' });
          this.toast.show('Estado de la devolución actualizado.', 'success');
        },
        error: () => {
          this.saving.set(false);
          this.toast.show('No pudimos actualizar el estado. Revisa el flujo permitido.', 'error');
        },
      });
  }
}
