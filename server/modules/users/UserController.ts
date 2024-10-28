import { Request, Response } from 'express';
import UserService from './UserService';
import { sendResponse, sendErrorResponse } from '../../utils/ControllerUtil';

class UserController {
  getAll = async (req: Request, res: Response): Promise<void> => {
    try {
      const users = await UserService.getAll();
      sendResponse(res, users);
    } catch (error) {
      sendErrorResponse(res, (error as Error).message, 500);
    }
  };

  getById = async (req: Request, res: Response): Promise<void> => {
    try {
      const id = req.params.id;
      const user = await UserService.getById(id);
      if (!user) {
        sendErrorResponse(res, 'User not found', 404);
        return;
      }
      sendResponse(res, user);
    } catch (error) {
      sendErrorResponse(res, (error as Error).message, 404);
    }
  };

  createUser = async (req: Request, res: Response): Promise<void> => {
    try {
      const userData = req.body;
      const user = await UserService.create(userData);
      sendResponse(res, user, 201);
    } catch (error) {
      sendErrorResponse(res, (error as Error).message, 400);
    }
  };

  updateUser = async (req: Request, res: Response): Promise<void> => {
    try {
      const id = req.params.id;
      const userData = req.body;
      const user = await UserService.update(id, userData);
      if (!user) {
        sendErrorResponse(res, 'User not found', 404);
        return;
      }
      sendResponse(res, user);
    } catch (error) {
      sendErrorResponse(res, (error as Error).message, 400);
    }
  };

  deleteUser = async (req: Request, res: Response): Promise<void> => {
    try {
      const id = req.params.id;
      const result = await UserService.delete(id);
      if (!result) {
        sendErrorResponse(res, 'User not found', 404);
        return;
      }
      sendResponse(res, { message: 'User deleted' });
    } catch (error) {
      sendErrorResponse(res, (error as Error).message, 500);
    }
  };
}

export default new UserController();
