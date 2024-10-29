import { Component, OnDestroy, OnInit } from '@angular/core';
import { environment } from '../../../../environments/environement';
import { FormBuilder, FormGroup } from '@angular/forms';
import { LoadingService } from '../../../../shared/services/loading.service';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrl: './forgot-password.component.css'
})
export class ForgotPasswordComponent implements OnInit, OnDestroy {
  loginRoute: string = `/${environment.ROUTE_PARENT_AUTHENTICATION}/${environment.ROUTE_AUTHENTICATION}/${environment.ROUTE_LOGIN}`;
  forgotPasswordForm: FormGroup;
  constructor(public formBuilder: FormBuilder, private loadingService: LoadingService, private authService: AuthService) {

  }

  ngOnInit(): void {
    this.forgotPasswordForm = this.formBuilder.group({
      email: [""]
    });
  }

  forgotPassword() {
    this.loadingService.show();
    if (this.forgotPasswordForm.valid) {
      const email = this.forgotPasswordForm.get('email').value;
      this.loadingService.show();
      if (email) {
        this.authService.forgotPassword(email).subscribe((res)=>{
          console.log(res);          
        });
        // this.recaptchaV3Service.execute('login').subscribe(token => {
        //   this.authService.signIn(email, password, token);
        // });
      }

    } else {
      this.loadingService.hide();
    }
  }
  ngOnDestroy(): void {

  }
}
