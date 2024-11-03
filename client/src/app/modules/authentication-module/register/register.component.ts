// src/app/components/register/register.component.ts

import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { LoadingService } from '../../../../shared/services/loading.service';
import { Router } from '@angular/router';
import { environment } from '../../../../environments/environement';
import { AuthService } from '../services/auth.service';
import { RegisterRequest } from '../model/request/request';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css'],
})
export class RegisterComponent implements OnInit {
  loginRoute: string = `${environment.ROUTE_PAGES}/${environment.ROUTE_AUTHENTICATION}/${environment.ROUTE_LOGIN}`;
  registerForm: FormGroup;
  hide = true;

  constructor(private formBuilder: FormBuilder, private loadingService: LoadingService, private authService: AuthService, private router: Router) {}

  ngOnInit(): void {
    this.createRegisterForm();
  }

  private createRegisterForm(): void {
    this.registerForm = this.formBuilder.group({
      firstName: ['', [Validators.required, Validators.maxLength(50)]],
      lastName: ['', [Validators.required, Validators.maxLength(50)]],
      email: ['', [Validators.required, Validators.email, Validators.maxLength(100)]],
      password: ['', [Validators.required, Validators.minLength(6), Validators.maxLength(100)]],
      termsAndCondition: [false, [Validators.requiredTrue]],
    });
  }

  register(): void {
    if (this.registerForm.invalid) {
      // Form geçersizse işlemi durdur
      return;
    }

    const registerRequest: RegisterRequest = this.registerForm.value;

   
    this.loadingService.show();

    this.authService.register(registerRequest).subscribe({
      next: () => {
        this.loadingService.hide();
        // Başarılı kayıt sonrası login sayfasına yönlendir
        this.router.navigate([this.loginRoute]);
      },
      error: (error) => {
        console.error('Register error:', error);
        this.loadingService.hide();
        // Hata mesajını kullanıcıya göster
      },
    });
  }

  toggleHide(): void {
    this.hide = !this.hide;
  }
}
