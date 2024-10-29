import mongoose, { Document, Model } from 'mongoose';
import UserSchema from './UserSchema';

// Kullanıcı arayüzü tanımı (TypeScript için)
export interface IUser extends Document {
  firstName: string;
  lastName: string;
  age: number;
  profession: string;
  interests: string[];
  skills: mongoose.Types.ObjectId[]; // Referans olarak Skill IDs
  currentlyLearning?: string;
  wantsToLearn?: string;
  careerPlan?: string;
}

// Model tanımı
const UserModel: Model<IUser> = mongoose.model<IUser>('User', UserSchema);

export default UserModel;
