import { Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { environment } from '../../../../environments/environement';
import { FormBuilder, FormGroup } from '@angular/forms';
import { LoadingService } from '../../../../shared/services/loading.service';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
})
export class LoginComponent implements OnInit, OnDestroy {
  // @ViewChild('bannerVideo') videoPlayer?: ElementRef;

  // playVideo() {
  //   const video: HTMLVideoElement = this.videoPlayer?.nativeElement;
  //   video.play();
  
  // }

  // pauseVideo() {
  //   const video: HTMLVideoElement = this.videoPlayer?.nativeElement;
  //   video.pause();
  // }


  registerRoute: string = `/${environment.ROUTE_PARENT_AUTHENTICATION}/${environment.ROUTE_AUTHENTICATION}/${environment.ROUTE_REGISTER}`;
  forgotPasswordRoute: string = `/${environment.ROUTE_PARENT_AUTHENTICATION}/${environment.ROUTE_AUTHENTICATION}/${environment.ROUTE_FORGOT_PASSWORD}`;
  hide = true;
  loginForm: FormGroup;

  constructor(public formBuilder: FormBuilder, private loadingService: LoadingService, private authService: AuthService) {}

  ngOnInit(): void {
    // this.playVideo();
    this.loginForm = this.formBuilder.group({
      email: [''],
      password: [''],
    });
  }

  login() {
    this.loadingService.show();
    if (this.loginForm.valid) {
      const email = this.loginForm.get('email').value;
      const password = this.loginForm.get('password').value;
      this.loadingService.show();
      if (email && password) {
        this.authService.signIn(email, password, '').subscribe((res) => {
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
    // this.pauseVideo();
  }
}
