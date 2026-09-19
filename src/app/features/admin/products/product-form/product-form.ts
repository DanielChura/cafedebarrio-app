import { Component, effect, inject, input, output } from '@angular/core';
import { NonNullableFormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
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

  readonly form = this.fb.group({
    name: ['', Validators.required],
    price: [0, [Validators.required, Validators.min(0.01)]],
    stock: [0, [Validators.required, Validators.min(0)]],
    categoryId: ['', Validators.required],
    description: ['', Validators.required],
    imageUrl: ['', [Validators.required, Validators.pattern(/^https?:\/\/[^\s/$.?#].[^\s]*$/)]],
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
            imageUrl: item.imageUrl ?? '',
          });
        else this.form.reset();
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

  save(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    const v = this.form.getRawValue();
    this.submitted.emit({
      name: v.name.trim(),
      price: Number(v.price),
      stock: Number(v.stock),
      categoryId: v.categoryId,
      description: v.description.trim(),
      imageUrl: v.imageUrl.trim(),
    });
  }
}
