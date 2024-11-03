import mongoose, { Document, Schema, Model } from 'mongoose';

// Kullanıcı arayüzü tanımı (TypeScript için)
export interface IUser extends Document {
  firstName: string;
  lastName: string;
  age?: number;
  profession?: string;
  interests?: string[];
  skills?: mongoose.Types.ObjectId[]; // Referans olarak Skill IDs
  currentlyLearning?: string;
  wantsToLearn?: string;
  careerPlan?: string;
  role: 'User' | 'Admin'; // Rol tanımı eklendi
}

// Kullanıcı şeması tanımı
const UserSchema: Schema = new Schema(
  {
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    age: { type: Number, min: 0, required: false },
    profession: { type: String, required: false },
    interests: { type: [String], default: [] },
    skills: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Skill',
      },
    ],
    currentlyLearning: { type: String, default: '' },
    wantsToLearn: { type: String, default: '' },
    careerPlan: { type: String, default: '' },
    role: {
      type: String,
      enum: ['User', 'Admin'],
      default: 'User',
      required: true,
    },
  },
  {
    timestamps: true,
    toJSON: {
      transform: function (doc, ret) {
        delete ret.createdAt; // createdAt alanını kaldırıyoruz
        delete ret.updatedAt; // updatedAt alanını kaldırıyoruz
        delete ret.__v; // __v alanını kaldırıyoruz
        return ret;
      },
    },
  }
);

// Model tanımı ve dışa aktarma
const UserModel: Model<IUser> = mongoose.model<IUser>('User', UserSchema);

export default UserModel;
