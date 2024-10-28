import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { UserListComponent } from "./components/users/user-list/user-list.component";
import { TenantListComponent } from "./components/tenants/tenant-list/tenant-list.component";
import { DashboardComponent } from "./components/dashboard/dashboard/dashboard.component";
import { environment } from '../environments/environement';
import { AuthLayoutComponent } from './layouts/auth/auth-layout.component';
import { BrowserModule } from '@angular/platform-browser';
import { AdminLayoutComponent } from './layouts/admin/admin-layout/admin-layout.component';
import { UserLayoutComponent } from './layouts/user/user-layout/user-layout.component';

const routes: Routes = [
  {
    path: 'admin',
    component: AdminLayoutComponent,
    children: [{ path: 'dashboard', component: DashboardComponent },
    { path: 'users', component: UserListComponent },
    { path: 'tenants', component: TenantListComponent },
    { path: '', redirectTo: '/dashboard', pathMatch: 'full' }, // Varsayılan rota
    { path: '**', redirectTo: '/dashboard' }]
  },
  {
    path: 'user',
    component: UserLayoutComponent,
    children: [
      { path: 'dashboard', component: DashboardComponent },      
      { path: '', redirectTo: '/dashboard', pathMatch: 'full' }, // Varsayılan rota
      { path: '**', redirectTo: '/dashboard' }
    ]
  },
  {
    path: environment.ROUTE_PARENT_AUTHENTICATION,
    component: AuthLayoutComponent,
    children: [
      {
        path: environment.ROUTE_AUTHENTICATION,
        loadChildren: () => import('./modules/authentication-module/authentication.module').then(m => m.AuthenticationModule)
      }
    ]
  },
]


@NgModule({

  imports: [
    BrowserModule,
    RouterModule.forRoot(routes)
  ],
  exports: [RouterModule]
})
export class AppRoutingModule {
}
