// auth.state.ts
import { UserModel } from '../model/model';

export interface AuthState {
  isLoggedIn: boolean;
  user: UserModel | null;
  error: string | null;
}

export const initialAuthState: AuthState = {
  isLoggedIn: false,
  user: null,
  error: null,
};
