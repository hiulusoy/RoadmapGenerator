import { UserModel } from '../modules/authentication-module/model/model';

// app-state.model.ts
export interface AppState {
  currentUser: UserModel | null;
  lastUrl: string | null; // Son URL'yi tutacak alan
}
