import { Routes } from '@angular/router';
import { environment } from '../../../environments/environement';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { ForgotPasswordComponent } from './forgot-password/forgot-password.component';

export const AuthenticationRoutes: Routes = [
  {
    path: '', // Ana yolu boş string olarak ayarlayın
    children: [
      {
        path: `${environment.ROUTE_LOGIN}`,
        component: LoginComponent
      },
      {
        path: `${environment.ROUTE_REGISTER}`,
        component: RegisterComponent
      },
      {
        path: `${environment.ROUTE_FORGOT_PASSWORD}`,
        component: ForgotPasswordComponent
      },
    ]
  }
];
