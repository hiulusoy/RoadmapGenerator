// types/express.d.ts

import { IUser } from '../modules/users/UserModel';

declare global {
  namespace Express {
    interface Request {
      userId?: string;
      auth?: any;
      user?: IUser;
    }
  }
}
