import { Component, OnDestroy, OnInit } from '@angular/core';
import { environment } from '../../../../environments/environement';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { LoadingService } from '../../../../shared/services/loading.service';
import { AuthFacade } from '../+state/auth.facade';

import { LoginRequest } from '../model/request/request';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
})
export class LoginComponent implements OnInit, OnDestroy {
  registerRoute: string = `/${environment.ROUTE_PAGES}/${environment.ROUTE_AUTHENTICATION}/${environment.ROUTE_REGISTER}`;
  forgotPasswordRoute: string = `/${environment.ROUTE_PAGES}/${environment.ROUTE_AUTHENTICATION}/${environment.ROUTE_FORGOT_PASSWORD}`;
  hide = true;
  loginForm: FormGroup;

  constructor(public formBuilder: FormBuilder, private loadingService: LoadingService, private authFacade: AuthFacade) {}

  ngOnInit(): void {
    this.loginForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required]],
    });
  }

  login(): void {
    if (this.loginForm.valid) {
      this.loadingService.show();

      const loginRequest: LoginRequest = {
        email: this.loginForm.get('email')?.value,
        password: this.loginForm.get('password')?.value,
      };

      this.authFacade.login(loginRequest);
      this.loadingService.hide();
    }
  }

  toggleHide(): void {
    this.hide = !this.hide;
  }

  ngOnDestroy(): void {}
}
