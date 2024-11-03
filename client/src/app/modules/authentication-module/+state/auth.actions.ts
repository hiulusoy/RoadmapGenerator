// auth.actions.ts
import { Action } from '@ngrx/store';
import { UserModel } from '../model/model';
import { LoginRequest } from '../model/request/request';

export enum AuthActionTypes {
  LOGIN = '[Auth] Login',
  LOGIN_SUCCESS = '[Auth] Login Success',
  LOGIN_FAILURE = '[Auth] Login Failure',
  LOGOUT = '[Auth] Logout',
  UPDATE_REFRESH_TOKEN = '[Auth] Update Refresh Token',
  SET_LAST_URL = '[Auth] Set Last Url',
  FORGOT_PASSWORD = '[Auth] Forgot Password',
}

export interface CustomAction extends Action {
  payload?: any;
}

export class Login implements CustomAction {
  readonly type = AuthActionTypes.LOGIN;

  constructor(public payload: { loginRequest: LoginRequest }) {}
}

export class LoginSuccess implements CustomAction {
  readonly type = AuthActionTypes.LOGIN_SUCCESS;

  constructor(public payload: { user: UserModel }) {}
}

export class LoginFailure implements CustomAction {
  readonly type = AuthActionTypes.LOGIN_FAILURE;

  constructor(public payload: { error: string }) {}
}

export class Logout implements CustomAction {
  readonly type = AuthActionTypes.LOGOUT;
}

export class UpdateRefreshToken implements CustomAction {
  constructor(public payload: { refreshToken: string }) {}

  readonly type = AuthActionTypes.UPDATE_REFRESH_TOKEN;
}

export class SetLastUrl implements CustomAction {
  readonly type = AuthActionTypes.SET_LAST_URL;

  constructor(public payload: { url: string }) {}
}

export class ForgotPassword implements CustomAction {
  readonly type = AuthActionTypes.FORGOT_PASSWORD;

  constructor(public payload: { email: string }) {}
}
