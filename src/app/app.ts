import { Component, signal } from '@angular/core';
import { NavigationEnd, Router, RouterOutlet } from '@angular/router';
import { Header } from './shared/header/header';
import { Footer } from './shared/footer/footer';
import { filter } from 'rxjs';

@Component({
  imports: [RouterOutlet, Header, Footer],
  selector: 'app-root',
  templateUrl: './app.html',
})
export class App {
  isAuthPage: boolean = false;
  isAdminPage: boolean = false;

  constructor(private router: Router) {
    this.updateFlags(this.router.url);
    this.router.events
      .pipe(filter((event) => event instanceof NavigationEnd))
      .subscribe((event: NavigationEnd) => this.updateFlags(event.urlAfterRedirects));
  }

  private updateFlags(url: string): void {
    const path = url.split('?')[0];
    this.isAdminPage = path.startsWith('/admin');
    this.isAuthPage = path === '/login' || path === '/register' || this.isAdminPage;
  }
}
