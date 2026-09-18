import { Component, input } from '@angular/core';

@Component({
  selector: 'app-promo-banner',
  templateUrl: './promo-banner.html',
})
export class PromoBanner {
  readonly imageUrl = input.required<string>();
  readonly alt = input<string>('Banner promocional');
}

