// reducers/index.ts
import { appStateReducer } from './app.reducer';

import { authReducer } from '../modules/authentication-module/+state/auth.reducer';

export const reducers = {
  app: appStateReducer,
  auth: authReducer,
};
