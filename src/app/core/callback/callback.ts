import { Component, inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../services/auth';

@Component({
  imports: [],
  selector: 'app-callback',
  styles: ``,
  template: ``,
})
export class Callback {
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly auth = inject(AuthService);

  constructor() {
    this.route.queryParams.subscribe((p) => {
      const token = p['token'];
      if (token && this.auth.saveSessionFromToken(token)) {
        this.router.navigate(['/']);
      } else {
        this.router.navigate(['/login']);
      }
    });
  }
}
