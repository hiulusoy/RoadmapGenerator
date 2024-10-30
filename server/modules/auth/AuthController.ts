// AuthController.ts
import { Request, Response } from 'express';
import AuthService from './AuthService';
import { sendResponse, sendErrorResponse } from '../../utils/ControllerUtil';

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
      sendResponse(res, { auth, token });
    } catch (error) {
      sendErrorResponse(res, (error as Error).message, 400);
    }
  };
}

export default new AuthController();
