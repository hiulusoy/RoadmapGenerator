import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AuthenticationRoutes } from './authentication.routing';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import 'iconify-icon';
import { ForgotPasswordComponent } from './forgot-password/forgot-password.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from '../shared/shared.module';

@NgModule({
  imports: [
    SharedModule,
    RouterModule.forChild(AuthenticationRoutes),
  ],
  declarations: [
    LoginComponent,
    RegisterComponent,
    ForgotPasswordComponent
  ],
  providers: [],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class AuthenticationModule {
}
