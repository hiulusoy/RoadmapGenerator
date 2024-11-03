import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { take } from 'rxjs/operators';
import { selectUserLastUrl } from '../../app/modules/authentication-module/+state/auth.selector';
import { AppState } from '../../app/+state/app.state';
import { selectCurrentUser } from '../../app/+state/app.selector';
import { environment } from '../../environments/environement';

@Injectable({
  providedIn: 'root',
})
export class StartupService {
  constructor(private store: Store<AppState>, private router: Router) {}

  loadInitialState(): void {
    this.checkCurrentUser();
    this.redirectToLastUrl();
  }

  private checkCurrentUser(): void {
    this.store
      .select(selectCurrentUser)
      .pipe(take(1))
      .subscribe((user) => {
        if (!user) {
          this.router.navigate([`${environment.ROUTE_PAGES}/${environment.ROUTE_AUTHENTICATION}/${environment.ROUTE_LOGIN}`]);
        } else {
          // Burada ek kullanıcı yükleme işlemleri yapılabilir
          // kullanıcı giriş yapmamış, giriş sayfasına yönlendir
          this.router.navigate([`${environment.ROUTE_PAGES}/${environment.ROUTE_AUTHENTICATION}/${environment.ROUTE_LOGIN}`]);
          return false;
        }
      });
  }

  private redirectToLastUrl(): void {
    this.store
      .select(selectUserLastUrl)
      .pipe(take(1))
      .subscribe((lastUrl) => {
        if (lastUrl && lastUrl !== '' && this.router.url === '/') {
          this.router.navigateByUrl(lastUrl);
        }
      });
  }
}
