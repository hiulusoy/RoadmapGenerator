import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import 'iconify-icon';
import 'simplebar'; // or "import SimpleBar from 'simplebar';" if you want to use it manually.
import { SidebarComponent } from './layouts/admin/sidebar/sidebar.component';
import { TopbarComponent } from './layouts/admin/topbar/topbar.component';
import { FooterComponent } from './layouts/admin/footer/footer.component';
import { RouterModule } from '@angular/router';
import { DashboardComponent } from './modules/admin-module/dashboard/dashboard.component';
import { ChartComponent } from 'ng-apexcharts';
import { AuthLayoutComponent } from './layouts/auth/auth-layout.component';
import { AuthService } from './modules/authentication-module/services/auth.service';
import { LoadingService } from '../shared/services/loading.service';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { UserLayoutComponent } from './layouts/user/user-layout/user-layout.component';
import { AdminLayoutComponent } from './layouts/admin/admin-layout/admin-layout.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ActionReducer, MetaReducer, Action, StoreModule } from '@ngrx/store';
import { AppState } from './+state/app.state';
import { localStorageSync } from 'ngrx-store-localstorage';
import { reducers } from './+state';
import { EffectsModule } from '@ngrx/effects';
import { AuthEffects } from './modules/authentication-module/+state/auth.effects';
import { RoadmapLayoutComponent } from './layouts/roadmap/roadmap-layout.component';
import { JwtInterceptor } from '../shared/services/jwt-interceptor.service';
import { LoaderComponent } from './components/loader/loader.component';
import { InterceptorService } from '../shared/services/interceptor.service';

export function localStorageSyncReducer(reducer: ActionReducer<any>): ActionReducer<any> {
  return localStorageSync({
    keys: ['auth'],
    rehydrate: true,
  })(reducer);
}

export const metaReducers: MetaReducer<{ app: AppState }, Action>[] = [localStorageSyncReducer];

@NgModule({
  declarations: [
    AppComponent,
    AdminLayoutComponent,
    SidebarComponent,
    TopbarComponent,
    FooterComponent,
    DashboardComponent,
    AuthLayoutComponent,
    UserLayoutComponent,
    AdminLayoutComponent,
    RoadmapLayoutComponent,
    LoaderComponent,
  ],
  imports: [BrowserModule, BrowserAnimationsModule, AppRoutingModule, RouterModule, ChartComponent, HttpClientModule, StoreModule.forRoot(reducers, { metaReducers }), EffectsModule.forRoot([AuthEffects])],
  providers: [AuthService, LoadingService, { provide: HTTP_INTERCEPTORS, useClass: JwtInterceptor, multi: true }, { provide: HTTP_INTERCEPTORS, useClass: InterceptorService, multi: true }],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  bootstrap: [AppComponent],
})
export class AppModule {}
