// auth.effects.ts
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { AuthActionTypes, Login, LoginFailure, LoginSuccess } from './auth.actions';
import { catchError, map, mergeMap, of, tap } from 'rxjs';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { LoadingService } from '../../../../shared/services/loading.service';
import { AuthService } from '../services/auth.service';
import { UserModel } from '../model/model';
import { environment } from '../../../../environments/environement';

@Injectable()
export class AuthEffects {
  login$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AuthActionTypes.LOGIN),
      mergeMap((action: Login) =>
        this.authService.login(action.payload.loginRequest).pipe(
          map((response) => {
            const userData = response.user;
            const token = response.token;

            const user: UserModel = {
              id: userData._id,
              firstName: userData.firstName,
              lastName: userData.lastName,
              email: userData.email,
              role: userData.role,
              accessToken: token,
              lastUrl: '/',
            };

            return new LoginSuccess({ user });
          }),
          catchError((error) => of(new LoginFailure({ error: error.toString() })))
        )
      )
    )
  );

  loginSuccess$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(AuthActionTypes.LOGIN_SUCCESS),
        tap((action: LoginSuccess) => {
          this.loadingService.hide();
          const redirectTo = this.getFirstAccessibleRoute(action.payload.user);
          this.router.navigate([redirectTo]);
        })
      ),
    { dispatch: false }
  );

  loginFailure$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(AuthActionTypes.LOGIN_FAILURE),
        tap(({ payload }) => {
          this.loadingService.hide();
        })
      ),
    { dispatch: false }
  );

  logout$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(AuthActionTypes.LOGOUT),
        tap(() => {})
      ),
    { dispatch: false }
  );

  constructor(private actions$: Actions, private authService: AuthService, private router: Router, private loadingService: LoadingService) {}

  private getFirstAccessibleRoute(user: UserModel): string {
    if (!user || !user.role) return '/';

    if (user.role.toLocaleUpperCase() == 'ADMIN') {
      return `/${environment.ROUTE_ADMIN}/dashboard`;
    } else if (user.role.toLocaleUpperCase() == 'USER') {
      return `/${environment.ROUTE_ROADMAP}/list`;
    }

    return '/';
  }
}
