import { Component, signal } from '@angular/core';
import { NavigationEnd, Router, RouterOutlet } from '@angular/router';
import { Header } from './shared/components/header/header';
import { Footer } from './shared/components/footer/footer';
import { filter } from 'rxjs';

@Component({
  imports: [RouterOutlet, Header, Footer],
  selector: 'app-root',
  templateUrl: './app.html',
})
export class App {
  isAuthPage: boolean = false;

  constructor(private router: Router) {
    this.isAuthPage = this.isAuthUrl(this.router.url);
    this.router.events
      .pipe(filter((event) => event instanceof NavigationEnd))
      .subscribe(
        (event: NavigationEnd) => (this.isAuthPage = this.isAuthUrl(event.urlAfterRedirects)),
      );
  }

  private isAuthUrl(url: string): boolean {
    const path = url.split('?')[0];
    return path === '/login' || path === '/register';
  }
}
