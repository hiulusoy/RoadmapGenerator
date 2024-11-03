// auth.facade.ts
import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { AuthState } from './auth.state';
import { ForgotPassword, Login, Logout } from './auth.actions';
import { selectAuthError, selectIsLoggedIn, selectLoggedUser } from './auth.selector';
import { LoginRequest } from '../model/request/request';
import { UserModel } from '../model/model';

@Injectable({
  providedIn: 'root',
})
export class AuthFacade {
  isLoggedIn$: Observable<boolean> = this.store.select(selectIsLoggedIn);
  currentUser$: Observable<UserModel | null> = this.store.select(selectLoggedUser);
  authError$: Observable<string | null> = this.store.select(selectAuthError);

  constructor(private store: Store<AuthState>) {}

  login(loginRequest: LoginRequest): void {
    this.store.dispatch(new Login({ loginRequest }));
  }

  logout(): void {
    this.store.dispatch(new Logout());
  }

  forgotPassword(email: string) {
    this.store.dispatch(new ForgotPassword({ email }));
  }
}
