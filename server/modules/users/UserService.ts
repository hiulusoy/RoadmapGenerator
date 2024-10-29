import UserRepository from './UserRepository';
import { IUser } from './UserModel';

class UserService {
  async getAll(): Promise<IUser[]> {
    try {
      return await UserRepository.getAll();
    } catch (error) {
      throw new Error(`Error getting users: ${(error as Error).message}`);
    }
  }

  async getById(id: string): Promise<IUser | null> {
    try {
      return await UserRepository.getById(id);
    } catch (error) {
      throw new Error(`Error getting user: ${(error as Error).message}`);
    }
  }

  async create(userData: IUser): Promise<IUser> {
    try {
      return await UserRepository.create(userData);
    } catch (error) {
      throw new Error(`Error creating user: ${(error as Error).message}`);
    }
  }

  async update(id: string, userData: Partial<IUser>): Promise<IUser | null> {
    try {
      return await UserRepository.update(id, userData);
    } catch (error) {
      throw new Error(`Error updating user: ${(error as Error).message}`);
    }
  }

  async delete(id: string): Promise<IUser | null> {
    try {
      return await UserRepository.delete(id);
    } catch (error) {
      throw new Error(`Error deleting user: ${(error as Error).message}`);
    }
  }
}

export default new UserService();
