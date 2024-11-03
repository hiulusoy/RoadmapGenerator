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
  }

  private checkCurrentUser(): void {
    this.store
      .select(selectCurrentUser)
      .pipe(take(1))
      .subscribe((user) => {
        if (!user) {
          this.router.navigate([`${environment.ROUTE_LANDING}`]);
        } else {
          // Kullanıcı giriş yapmışsa uygun bir ana sayfaya yönlendirme yapın
          this.router.navigate([`${environment.ROUTE_ROADMAP}`]); // Örneğin admin paneli
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
