import { UserModel } from '../modules/authentication-module/model/model';

export enum AppActionTypes {
  SET_CURRENT_USER = '[App] Set Current User',
  SET_LAST_URL = '[App] Set Last URL', //
}

export const setCurrentUser = (user: UserModel) => {
  return { type: AppActionTypes.SET_CURRENT_USER, payload: user };
};

export const setLastUrl = (url: string) => ({
  type: AppActionTypes.SET_LAST_URL,
  payload: url,
});
