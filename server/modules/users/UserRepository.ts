import UserModel, { IUser } from './UserModel';

class UserRepository {
  async getAll(): Promise<IUser[]> {
    try {
      // skills alanını populate ile getiriyoruz
      return await UserModel.find().populate('skills');
    } catch (error) {
      throw error;
    }
  }

  async getById(id: string): Promise<IUser | null> {
    try {
      // Belirli kullanıcıyı skills ile birlikte getir
      return await UserModel.findById(id).populate('skills');
    } catch (error) {
      throw error;
    }
  }

  async create(userData: IUser): Promise<IUser> {
    try {
      const user = new UserModel(userData);
      return await user.save();
    } catch (error) {
      throw error;
    }
  }

  async update(id: string, userData: Partial<IUser>): Promise<IUser | null> {
    try {
      // Kullanıcıyı güncellerken skills alanını da yönetiyoruz
      return await UserModel.findByIdAndUpdate(id, userData, {
        new: true,
        runValidators: true,
      }).populate('skills');
    } catch (error) {
      throw error;
    }
  }

  async delete(id: string): Promise<IUser | null> {
    try {
      return await UserModel.findByIdAndDelete(id);
    } catch (error) {
      throw error;
    }
  }
}

export default new UserRepository();
