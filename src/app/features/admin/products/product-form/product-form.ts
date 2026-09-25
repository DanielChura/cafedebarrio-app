import { Component, effect, inject, input, output } from '@angular/core';
import {
  NonNullableFormBuilder,
  ReactiveFormsModule,
  Validators,
  FormControl,
} from '@angular/forms';
import { CategoryResponse, ProductRequest, ProductResponse } from '../../../../core/models';

@Component({
  selector: 'app-product-form',
  imports: [ReactiveFormsModule],
  templateUrl: './product-form.html',
})
export class ProductForm {
  private readonly fb = inject(NonNullableFormBuilder);

  readonly categories = input<CategoryResponse[]>([]);
  readonly initial = input<ProductResponse | null>(null);
  readonly saving = input(false);

  readonly submitted = output<ProductRequest>();
  readonly cancelled = output<void>();

  readonly image = new FormControl<File | null>(null);

  readonly form = this.fb.group({
    name: ['', Validators.required],
    price: [0, [Validators.required, Validators.min(0.01)]],
    stock: [0, [Validators.required, Validators.min(0)]],
    categoryId: ['', Validators.required],
    description: ['', Validators.required],
  });

  constructor() {
    effect(
      () => {
        const item = this.initial();
        if (item)
          this.form.setValue({
            name: item.name,
            price: item.price,
            stock: item.stock,
            categoryId: item.categoryId,
            description: item.description ?? '',
          });
        else this.form.reset();
        this.image.reset();
        if (item) this.image.clearValidators();
        else this.image.setValidators(Validators.required);
        this.image.updateValueAndValidity();
      },
      { allowSignalWrites: true },
    );
    effect(
      () => {
        const cats = this.categories();
        if (cats.length && !this.form.controls.categoryId.value)
          this.form.controls.categoryId.setValue(cats[0].id);
      },
      { allowSignalWrites: true },
    );
  }

  onFile(event: Event): void {
    const file = (event.target as HTMLInputElement).files?.[0] ?? null;
    this.image.setValue(file);
    this.image.markAsTouched();
  }

  save(): void {
    const isEdit = !!this.initial();
    if (this.form.invalid || (!isEdit && this.image.invalid)) {
      this.form.markAllAsTouched();
      this.image.markAsTouched();
      return;
    }
    const v = this.form.getRawValue();
    const image = this.image.value;
    if (!isEdit && !image) {
      this.image.markAsTouched();
      return;
    }
    this.submitted.emit({
      name: v.name.trim(),
      price: Number(v.price),
      stock: Number(v.stock),
      categoryId: v.categoryId,
      description: v.description.trim(),
      ...(image ? { image } : {}),
    });
  }
}
