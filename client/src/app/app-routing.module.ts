import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { environment } from '../environments/environement';
import { BrowserModule } from '@angular/platform-browser';
import { LandingComponent } from './modules/landing-module/landing.component';
import { RoadmapGeneratorComponent } from './modules/roadmap-module/roadmap-generator/roadmap-generator.component';
import { AdminLayoutComponent } from './layouts/admin/admin-layout/admin-layout.component';
import { AuthLayoutComponent } from './layouts/auth/auth-layout.component';
import { RoadmapLayoutComponent } from './layouts/roadmap/roadmap-layout.component';

const routes: Routes = [
  {
    path: environment.ROUTE_ADMIN,
    component: AdminLayoutComponent,
    children: [
      {
        path: '',
        loadChildren: () => import('./modules/admin-module/admin.module').then((m) => m.AdminModule),
      },
    ],
  },
  {
    path: environment.ROUTE_ROADMAP,
    component: RoadmapLayoutComponent,
    children: [
      {
        path: '',
        loadChildren: () => import('./modules/roadmap-module/roadmap-generator.module').then((m) => m.RoadmapGeneratorModule),
      },
    ],
  },
  {
    path: environment.ROUTE_PAGES,
    component: AuthLayoutComponent,
    children: [
      {
        path: environment.ROUTE_AUTHENTICATION,
        loadChildren: () => import('./modules/authentication-module/authentication.module').then((m) => m.AuthenticationModule),
      },
    ],
  },
  {
    path: environment.ROUTE_LANDING,
    component: LandingComponent,
  },
];

@NgModule({
  imports: [BrowserModule, RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
