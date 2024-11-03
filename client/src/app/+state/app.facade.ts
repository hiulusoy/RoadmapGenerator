import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { AppState } from './app.state';
import { setCurrentUser, setLastUrl } from './app.actions';
import { selectCurrentUser, selectLastUrl } from './app.selector';
import { UserModel } from '../modules/authentication-module/model/model';

@Injectable({ providedIn: 'root' })
export class AppFacade {
  currentUser$ = this.store.select(selectCurrentUser);
  lastUrl$ = this.store.select(selectLastUrl);

  constructor(private store: Store<AppState>) {}

  setCurrentUser(user: UserModel): void {
    this.store.dispatch(setCurrentUser(user));
  }

  setLastUrl(lastUrl: string): void {
    this.store.dispatch(setLastUrl(lastUrl));
  }
}
