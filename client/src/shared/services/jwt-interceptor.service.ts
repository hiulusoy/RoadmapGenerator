import { HttpErrorResponse, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs/internal/Observable';
import { Injectable } from '@angular/core';
import { tap } from 'rxjs/operators';
import { Store } from '@ngrx/store';
import { AuthState } from '../../app/modules/authentication-module/+state/auth.state';
import { selectCurrentUserToken } from '../../app/modules/authentication-module/+state/auth.selector';
import { first, switchMap } from 'rxjs';
import { UpdateRefreshToken } from '../../app/modules/authentication-module/+state/auth.actions';

@Injectable()
export class JwtInterceptor implements HttpInterceptor {
  constructor(private store: Store<AuthState>) {}

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return this.store.select(selectCurrentUserToken).pipe(
      first(),
      switchMap((token) => {
        if (token) {
          request = request.clone({
            setHeaders: {
              Authorization: `Bearer ${token}`,
            },
          });
        }

        return next.handle(request).pipe(
          tap(
            (event) => {
              if (event instanceof HttpResponse && event.body) {
                this.modifyBody(event.body); // Assumed modifyBody method exists
              }
            },
            (error) => {
              if (error instanceof HttpErrorResponse && error.error && error.error.refreshToken) {
                this.modifyBody(error.error); // Handle refreshToken logic
              }
            }
          )
        );
      })
    );
  }

  modifyBody(body: any) {
    if (body && body.refreshToken) {
      // NgRx store üzerinden refreshToken güncellemesi yap
      this.store.dispatch(new UpdateRefreshToken({ refreshToken: body.refreshToken }));
    }
  }
}
