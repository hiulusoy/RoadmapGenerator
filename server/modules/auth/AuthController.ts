// AuthController.ts
import { Request, Response } from 'express';
import AuthService from './AuthService';
import { sendResponse, sendErrorResponse } from '../../utils/ControllerUtil';
import { IUser } from '../users/UserModel';

class AuthController {
  // Kullanıcı kaydı
  register = async (req: Request, res: Response): Promise<void> => {
    try {
      const { email, password, role, ...userData } = req.body;
      const auth = await AuthService.register(email, password, { ...userData, role });
      sendResponse(res, { auth }, 201);
    } catch (error) {
      sendErrorResponse(res, (error as Error).message, 400);
    }
  };

  // Kullanıcı giriş
  login = async (req: Request, res: Response): Promise<void> => {
    try {
      const { email, password } = req.body;
      const { auth, token } = await AuthService.login(email, password);

      // auth.user'ın IUser olup olmadığını kontrol eden type guard
      const isPopulatedUser = (user: typeof auth.user): user is IUser => {
        return (user as IUser).firstName !== undefined;
      };

      if (!isPopulatedUser(auth.user)) {
        throw new Error('User details not populated');
      }

      // Gereksiz alanları kaldırarak sadeleştirilmiş bir `user` nesnesi oluştur
      const user = {
        _id: auth.user._id,
        firstName: auth.user.firstName,
        lastName: auth.user.lastName,
        role: auth.user.role,
        email: auth.email, // E-posta bilgisi varsa dahil edin
      };

      sendResponse(res, { user, token });
    } catch (error) {
      sendErrorResponse(res, (error as Error).message, 400);
    }
  };
}

export default new AuthController();
