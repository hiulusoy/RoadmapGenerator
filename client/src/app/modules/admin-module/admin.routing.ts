import { Routes } from '@angular/router';
import { environment } from '../../../environments/environement';
import { DashboardComponent } from './dashboard/dashboard.component';
import { TenantListComponent } from './tenant-list/tenant-list.component';
import { UserListComponent } from './users/user-list/user-list.component';

export const AdminRoutes: Routes = [
  {
    path: '', // Ana yolu boş string olarak ayarlayın
    children: [
      { path: 'dashboard', component: DashboardComponent },
      { path: 'users', component: UserListComponent },
      { path: 'tenants', component: TenantListComponent },
    ],
  },
];
