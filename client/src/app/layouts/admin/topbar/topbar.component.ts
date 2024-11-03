import { Component, OnDestroy } from '@angular/core';
import { AuthFacade } from '../../../modules/authentication-module/+state/auth.facade';
import { Observable, Subscription } from 'rxjs';
import { Store, select } from '@ngrx/store';
import { selectLoggedUser } from '../../../modules/authentication-module/+state/auth.selector';
import { UserModel } from '../../../modules/authentication-module/model/model';
import { Router } from '@angular/router';
import { environment } from '../../../../environments/environement';

@Component({
  selector: 'app-topbar',
  templateUrl: './topbar.component.html',
  styleUrl: './topbar.component.css',
})
export class TopbarComponent implements OnDestroy {
  currentUser: UserModel | null = null;
  private subscription: Subscription = new Subscription();

  constructor(private authFacade: AuthFacade, private store: Store, private router: Router) {
    this.getCurrentUser();
  }

  logout(): void {
    localStorage.removeItem('auth');
    this.router.navigate([`${environment.ROUTE_PAGES}/${environment.ROUTE_AUTHENTICATION}/${environment.ROUTE_LOGIN}`]);
  }

  private getCurrentUser(): void {
    this.subscription.add(
      this.store.pipe(select(selectLoggedUser)).subscribe((user) => {
        this.currentUser = user;
      })
    );
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}
