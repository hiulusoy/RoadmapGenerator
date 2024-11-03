import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { BaseService } from '../../../../shared/services/base.service';
import { LoginRequest, RegisterRequest } from '../model/request/request';

@Injectable()
export class AuthService extends BaseService {
 
  constructor(http: HttpClient) {
    super(http);
  }
  register(registerRequest: RegisterRequest): Observable<any> {
    return this.post<any, any>('/auth/register', registerRequest);
  }

  login(loginRequest: LoginRequest): Observable<any> {
    return this.post<any, any>('/auth/login', loginRequest);
  }
}
