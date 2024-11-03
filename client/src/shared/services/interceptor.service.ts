import { Injectable } from '@angular/core';
import { HttpErrorResponse, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest, HttpResponse } from '@angular/common/http';
import { catchError, Observable, tap, throwError } from 'rxjs';
import { Router } from '@angular/router';
import { LoadingService } from './loading.service';

@Injectable()
export class InterceptorService implements HttpInterceptor {
  constructor(private loaderService: LoadingService, private router: Router) {}

  intercept(httpRequest: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    httpRequest = httpRequest.clone({
      headers: httpRequest.headers.set('Cache-Control', 'no-cache').set('Pragma', 'no-cache').set('Expires', 'Thu, 01 Jan 1970 00:00:00 GMT').set('If-Modified-Since', '0'),
    });

    this.loaderService.show();

    return next.handle(httpRequest).pipe(
      tap((event) => {
        if (event instanceof HttpResponse) {
          this.loaderService.hide();
        }
      }),
      catchError((error: HttpErrorResponse) => {
        this.loaderService.hide();
        if (error.status === 401) {
          // Inform the user they need to re-authenticate or automatically prompt for re-authentication
          console.error('Authentication error. Session may have expired.');
          this.handleSessionAlert(); // Show a modal or message to re-authenticate
        } else if (error.status === 403) {
          // Inform the user they don't have permission to access this resource
          console.error('Authorization error. Access denied.');
          this.handleAccessDenied(); // Show a modal or message that access is denied
        }
        return throwError(() => new Error(error.statusText));
      })
    );
  }

  private handleSessionAlert(): void {
    // You could implement a modal popup to re-login without navigating away from the current page
  }

  private handleAccessDenied(): void {
    // Show an alert or modal indicating that access is denied but keep the user on the same page
  }
}

export enum ToasterPosition {
  topRight = 'toast-top-right',
  topLeft = 'toast-top-left',
  bottomRight = 'toast-bottom-right',
  bottomLeft = 'toast-bottom-left',
}
