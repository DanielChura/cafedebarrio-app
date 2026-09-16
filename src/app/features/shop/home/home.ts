import { Component, inject, resource } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { CategoryService } from '../../../core/services/category';
import { CategoryResponse } from '../../../core/models/category';
import { CategoryRow } from '../components/category-row/category-row';
import { PromoBanner } from '../components/promo-banner/promo-banner';

const HOT_DRINKS_ID = '808fec6f-53d6-4f1f-b5a0-a66d75b687c1';
const COLD_DRINKS_ID = '54dcaba6-d44a-4297-a2b7-1e562e1d261e';

@Component({
  selector: 'app-home',
  imports: [CategoryRow, PromoBanner],
  templateUrl: './home.html',
})
export class Home {
  private readonly categories = inject(CategoryService);

  readonly featured = resource({
    loader: () => firstValueFrom(this.categories.findAll({ size: 5 })),
  });

  readonly hotDrinks = {
    id: HOT_DRINKS_ID,
    name: 'Bebidas calientes',
  } as CategoryResponse;

  readonly coldDrinks = {
    id: COLD_DRINKS_ID,
    name: 'Bebidas frías',
  } as CategoryResponse;
}
