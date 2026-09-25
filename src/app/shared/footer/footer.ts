import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { LogoIcon } from '../icons/logo-icon';

@Component({
  imports: [RouterLink, LogoIcon],
  selector: 'app-footer',
  templateUrl: './footer.html',
})
export class Footer {}
