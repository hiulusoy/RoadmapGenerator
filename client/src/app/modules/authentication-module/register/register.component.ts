import { Component, OnDestroy, OnInit } from '@angular/core';
import { environment } from '../../../../environments/environement';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { LoadingService } from '../../../../shared/services/loading.service';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrl: './register.component.css'
})
export class RegisterComponent implements OnInit, OnDestroy {


  loginRoute: string = `/${environment.ROUTE_PARENT_AUTHENTICATION}/${environment.ROUTE_AUTHENTICATION}/${environment.ROUTE_LOGIN}`;
  registerForm: FormGroup;
  hide = true;
  constructor(public formBuilder: FormBuilder, private loadingService: LoadingService, private authService: AuthService) {

  }
  ngOnInit(): void {
    this.registerForm = this.formBuilder.group({
      firstName:["",Validators.required],
      lastName:["",Validators.required],
      email: ["",Validators.required],
      password: ["",Validators.required],
      termsAndCondition:[false, [Validators.requiredTrue]]
    });
  }
  register() {
    this.loadingService.show();
    if (this.registerForm.valid) {
      const firstName = this.registerForm.get('firstName').value;
      const lastName = this.registerForm.get('lastName').value;
      const email = this.registerForm.get('email').value;
      const password = this.registerForm.get('password').value;
      this.loadingService.show();
      if (firstName && lastName && email && password) {
        this.authService.register(firstName, lastName, email, password).subscribe((res)=>{
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
  toggleHide() {
    this.hide = !this.hide;
  }
  ngOnDestroy(): void {
  }
}
