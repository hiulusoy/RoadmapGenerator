import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LayoutComponent } from "./layout/layout/layout.component";
import { UserListComponent } from "./components/users/user-list/user-list.component";
import { TenantListComponent } from "./components/tenants/tenant-list/tenant-list.component";
import { DashboardComponent } from "./components/dashboard/dashboard/dashboard.component";

const routes: Routes = [
  {
    path: '',
    component: LayoutComponent,
    children: [{ path: 'dashboard', component: DashboardComponent },
    { path: 'users', component: UserListComponent },
    { path: 'tenants', component: TenantListComponent },
    { path: '', redirectTo: '/dashboard', pathMatch: 'full' }, // Varsayılan rota
    { path: '**', redirectTo: '/dashboard' }]
  }
]


@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {
}
