import { Component } from '@angular/core';
import { NavigationStart, NavigationEnd, NavigationCancel, NavigationError, Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { environment } from '../environments/environement';
import { LoadingService } from '../shared/services/loading.service';
import { SetLastUrl, Logout } from './modules/authentication-module/+state/auth.actions';
import { AuthState } from './modules/authentication-module/+state/auth.state';
import { StartupService } from '../shared/services/startup.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
})
export class AppComponent {
  title = 'RoadMapGeneratorDashboard';

  constructor(private router: Router, private loadingService: LoadingService, private startupService: StartupService, private store: Store<AuthState>) {
    this.router.events.subscribe((event) => {
      this.navigationInterceptor(event);
    });
  }

  ngOnInit(): void {
    this.startupService.loadInitialState();
    this.checkVersion();
  }

  navigationInterceptor(event): void {
    if (event instanceof NavigationStart) {
      this.loadingService.show();
    }
    if (event instanceof NavigationEnd) {
      this.store.dispatch(new SetLastUrl({ url: event.urlAfterRedirects }));
      this.loadingService.hide();
    } else if (event instanceof NavigationCancel || event instanceof NavigationError) {
      this.loadingService.hide();
    }
  }

  checkVersion() {
    const currentVersion = environment.version;
    const storedVersion = localStorage.getItem('appVersion');

    if (storedVersion !== currentVersion) {
      localStorage.clear();
      localStorage.setItem('appVersion', currentVersion);
      this.store.dispatch(new Logout());
    }
  }
}
