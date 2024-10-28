import mongoose, { Document, Schema, Model } from 'mongoose';

// Auth arayüzü tanımı (TypeScript için)
export interface IAuth extends Document {
  email: string;
  password?: string;
  user: mongoose.Types.ObjectId;
}

// Auth şeması tanımı
const AuthSchema: Schema = new Schema(
  {
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true, select: false },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
  },
  {
    timestamps: true,
    toJSON: {
      transform: function (doc, ret) {
        delete ret.password; // Şifre alanını kaldırıyoruz
        delete ret.createdAt;
        delete ret.updatedAt;
        delete ret.__v;
        return ret;
      },
    },
  }
);

// Model tanımı ve dışa aktarma
const AuthModel: Model<IAuth> = mongoose.model<IAuth>('Auth', AuthSchema);

export default AuthModel;
