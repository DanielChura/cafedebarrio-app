import { Component, input } from '@angular/core';
import { CurrencyPipe } from '@angular/common';
import { ProductResponse } from '../../../../core/models';

@Component({
  selector: 'app-product-card',
  imports: [CurrencyPipe],
  templateUrl: './product-card.html',
})
export class ProductCard {
  readonly product = input.required<ProductResponse>();
}
